export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? ""
    : "https://terra-guard-back.vercel.app");
export const ASSESS_ENDPOINT = `${API_BASE_URL}/api/v1/live/assess`;

