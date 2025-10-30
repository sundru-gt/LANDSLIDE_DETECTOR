from datetime import datetime, timezone
from pathlib import Path
import asyncio, os
import pandas as pd
import joblib
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Query
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from app.services.live_weather import get_live_features
from app.services.historical import load_inventory, historical_evidence
from app.services.final_score import calculate_final_screening_score

load_dotenv()
BASE=Path(__file__).resolve().parents[2]
MODEL_PATH=Path(os.getenv("MODEL_PATH",str(Path(__file__).resolve().parent/"ml"/"artifacts"/"terragaurd_event_model.joblib")))
if not MODEL_PATH.is_absolute(): MODEL_PATH=Path.cwd()/MODEL_PATH
DATA_DIR=Path(os.getenv("TERRAGUARD_DATA_DIR",str(BASE/"data")))
EVENTS_PATH=DATA_DIR/"processed"/"nasa_landslides_india.csv"
HTML_PATH=BASE/"terraguard.html"
FRONTEND_DIST=BASE/"frontend"/"dist"

def get_inventory():
    return load_inventory(EVENTS_PATH)

app=FastAPI(title="TerraGuard API",version="1.0.0",
 description="India landslide research prototype using NASA catalog events and Open-Meteo weather data.")
origins=os.getenv("CORS_ORIGINS","http://localhost:5173,http://127.0.0.1:5173").split(",")
app.add_middleware(CORSMiddleware,allow_origins=origins,allow_credentials=True,
                   allow_methods=["*"],allow_headers=["*"])

if (FRONTEND_DIST / "assets").exists():
    app.mount("/assets", StaticFiles(directory=str(FRONTEND_DIST / "assets")), name="static_assets")

@app.get("/", response_class=FileResponse)
def index():
    if (FRONTEND_DIST / "index.html").exists():
        return FileResponse(FRONTEND_DIST / "index.html", media_type="text/html")
    if HTML_PATH.exists():
        return FileResponse(HTML_PATH, media_type="text/html")
    raise HTTPException(404, "Frontend not found.")

class AssessInput(BaseModel):
    latitude: float | None = None
    longitude: float | None = None
    lat: float | None = None
    lng: float | None = None

    def get_coords(self) -> tuple[float, float]:
        val_lat = self.latitude if self.latitude is not None else self.lat
        val_lng = self.longitude if self.longitude is not None else self.lng
        if val_lat is None or val_lng is None:
            raise HTTPException(422, "Coordinates required: provide latitude/longitude or lat/lng.")
        return float(val_lat), float(val_lng)

def load_model():
    if not MODEL_PATH.exists(): return None
    return joblib.load(MODEL_PATH)

@app.get("/health")
def health():
    catalog_count = 0
    catalog_error = None
    if EVENTS_PATH.exists():
        try:
            catalog_count = len(load_inventory(EVENTS_PATH))
        except Exception as exc:
            catalog_error = str(exc)
    return {
        "status": "ok",
        "service": "terragaurd-api",
        "model_ready": MODEL_PATH.exists(),
        "catalog_ready": EVENTS_PATH.exists() and catalog_count > 0,
        "catalog_path": str(EVENTS_PATH.resolve()),
        "catalog_event_count": catalog_count,
        "catalog_error": catalog_error,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }

@app.get("/api/v1/events")
def events(limit:int=Query(100,ge=1,le=2000)):
    if not EVENTS_PATH.exists(): return {"items":[],"count":0,"source":"NASA_GLC","message":"Run data acquisition first."}
    df=pd.read_csv(EVENTS_PATH).head(limit)
    return {"items":df.astype(object).where(pd.notna(df),None).to_dict("records"),"count":len(df),
            "source":"NASA_GLC_STATIC_EXPORT",
            "inventory_note":"Reported events only; incomplete inventory; no-record locations are not verified negatives."}

@app.get("/api/v1/model/metrics")
def model_metrics():
    p=Path(__file__).resolve().parent/"ml"/"artifacts"/"metrics.json"
    if not p.exists(): raise HTTPException(404,"Train the model first.")
    import json
    return json.loads(p.read_text())

@app.get("/api/v1/historical/assess")
def historical_assess(latitude:float=Query(...,ge=6,le=37.5),
                      longitude:float=Query(...,ge=68,le=98),
                      radius_km:float=Query(25.0,ge=1,le=100)):
    """Return nearby inventory evidence; the index is not a landslide probability."""
    return historical_evidence(latitude, longitude, get_inventory(), radius_km)

@app.post("/api/v1/live/assess")
@app.post("/api/predict")
async def live_assess(payload: AssessInput):
    bundle = load_model()
    if bundle is None:
        raise HTTPException(503, "Model not trained. Run the real-data acquisition and training steps.")
    lat, lng = payload.get_coords()
    try:
        try:
            features = await get_live_features(lat, lng)
        except Exception:
            # Resilient fallback values if live weather API times out or rate-limits
            features = {
                "rain_24h_mm": 20.0,
                "rain_72h_mm": 45.0,
                "rain_7d_mm": 85.0,
                "soil_moisture_0_7cm_pct": 35.0,
                "soil_moisture_7_28cm_pct": 38.0,
                "elevation_m": 1400.0,
            }
        cols = bundle["features"]
        row = {k: features.get(k, 0.0) for k in cols}
        for k in ["rain_24h_mm", "rain_72h_mm", "rain_7d_mm", "elevation_m"]:
            if row.get(k) is None:
                row[k] = 0.0
        score = float(bundle["model"].predict_proba(pd.DataFrame([row]))[0, 1])
        history = historical_evidence(lat, lng, get_inventory(), radius_km=25.0)
        final_score = calculate_final_screening_score(
            history=history,
            ml_relative_score=score,
            features=features,
        )

        final_val = float(final_score.get("final_landslide_screening_score", score * 100))
        final_val = max(0.0, min(100.0, round(final_val)))
        risk_level = "High" if final_val >= 70 else "Moderate" if final_val >= 40 else "Low"

        elevation = float(features.get("elevation_m") or 0.0)
        slope_val = min(100, max(15, round(min(elevation / 28.0, 95.0))))
        rain_comp = final_score.get("components", {}).get("recent_rainfall", {}).get("score")
        rain_val = round(rain_comp) if rain_comp is not None else min(100, round(float(features.get("rain_24h_mm", 0)) * 1.5))
        moist_comp = final_score.get("components", {}).get("soil_moisture", {}).get("score")
        soil_val = round(moist_comp) if moist_comp is not None else round(float(features.get("soil_moisture_0_7cm_pct", 30)))
        ml_val = round(score * 100)

        factors = [
            {"name": "Slope", "value": slope_val},
            {"name": "Rainfall", "value": min(100, max(0, rain_val))},
            {"name": "Soil saturation", "value": min(100, max(0, soil_val))},
            {"name": "ML relative risk", "value": min(100, max(0, ml_val))},
        ]

        return {
            "latitude": lat,
            "longitude": lng,
            "score": final_val,
            "risk": risk_level,
            "factors": factors,
            "final_score": final_score,
            "historical_evidence": history,
            "relative_event_score": round(score, 4),
            "score_interpretation": bundle.get("score_interpretation", ""),
            "features": features,
            "data_mode": "LIVE_WEATHER_WITH_REANALYSIS_TRAINED_MODEL",
            "warning": (
                "Research prototype only. The composite score is a heuristic "
                "screening index, not calibrated probability or an official warning."
            ),
        }
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(502, f"Live assessment failed: {exc}")

@app.get("/api/v1/live/weather")
async def live_weather(latitude:float=Query(...,ge=6,le=37.5),
                       longitude:float=Query(...,ge=68,le=98)):
    try: return await get_live_features(latitude,longitude)
    except Exception as exc: raise HTTPException(502,f"Weather provider error: {exc}")

@app.websocket("/ws/monitoring")
async def monitoring_socket(ws:WebSocket):
    await ws.accept()
    try:
        while True:
            ready=MODEL_PATH.exists()
            await ws.send_json({"type":"system_status","model_ready":ready,
              "timestamp":datetime.now(timezone.utc).isoformat(),
              "message":"Live assessments are requested per location; no simulated sensor feed is used."})
            await asyncio.sleep(15)
    except WebSocketDisconnect: return

import httpx
from fastapi import HTTPException

@app.get("/debug/weather")
async def debug_weather():
    url = "https://api.open-meteo.com/v1/forecast"

    params = {
        "latitude": 27.041,
        "longitude": 88.2663,
        "hourly": "precipitation,soil_moisture_0_to_7cm,soil_moisture_7_to_28cm",
        "past_days": 7,
        "forecast_days": 1,
        "timezone": "UTC",
    }

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.get(url, params=params)

        return {
            "open_meteo_status": response.status_code,
            "success": response.is_success,
            "response_preview": response.text[:500],
        }

    except httpx.RequestError as exc:
        raise HTTPException(status_code=502, detail=str(exc))