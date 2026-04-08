export const SITES = [
  { n: "Kedarnath", s: "Uttarakhand", lat: 30.735, lng: 79.067, r: "High", rain: "121 mm", sc: 91 },
  { n: "Wayanad", s: "Kerala", lat: 11.685, lng: 76.132, r: "High", rain: "182 mm", sc: 88 },
  { n: "Joshimath", s: "Uttarakhand", lat: 30.556, lng: 79.564, r: "High", rain: "96 mm", sc: 84 },
  { n: "Darjeeling", s: "West Bengal", lat: 27.036, lng: 88.263, r: "Moderate", rain: "74 mm", sc: 62 },
  { n: "Gangtok", s: "Sikkim", lat: 27.338, lng: 88.606, r: "Moderate", rain: "68 mm", sc: 58 },
  { n: "Shimla", s: "Himachal Pradesh", lat: 31.104, lng: 77.173, r: "Moderate", rain: "41 mm", sc: 47 },
  { n: "Idukki", s: "Kerala", lat: 9.85, lng: 76.97, r: "Low", rain: "22 mm", sc: 29 },
  { n: "Nilgiris", s: "Tamil Nadu", lat: 11.41, lng: 76.7, r: "Low", rain: "18 mm", sc: 24 },
];

export const COL = {
  High: "#c8200e",
  Moderate: "#d99200",
  Low: "#2f7a52",
};

export const GAZ = [
  ...SITES.map(s => ({ name: `${s.n}, ${s.s}`, lat: s.lat, lng: s.lng })),
  { name: "Mussoorie, Uttarakhand", lat: 30.459, lng: 78.066 },
  { name: "Nainital, Uttarakhand", lat: 29.391, lng: 79.456 },
  { name: "Munnar, Kerala", lat: 10.089, lng: 77.059 },
  { name: "Kalimpong, West Bengal", lat: 27.066, lng: 88.469 },
  { name: "Shillong, Meghalaya", lat: 25.578, lng: 91.893 },
  { name: "Kanpur, Uttar Pradesh", lat: 26.449, lng: 80.332 },
];

export const FILTER_TABS = ["All", "High", "Moderate", "Low"];

