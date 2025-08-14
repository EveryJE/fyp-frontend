const isMobile = typeof globalThis === "undefined" ? false : globalThis.innerWidth < 640;

const config = {
  geoCodingApi: "https://nominatim.openstreetmap.org",
  routingApi: "https://router.project-osrm.org/route/v1",
  mapConfig: {
    center: [-2.0004313035171037,
      5.298313460071185],
    zoom: 18,
    bearing: -15,
    pitch: 45,
    maxBounds: [[-2.00454, 5.29415], [-1.98929, 5.30060]
    ]
  } as maplibregl.MapOptions,
  mapStyles: {
    light: "https://tiles.openfreemap.org/styles/bright",
    dark: "/styles/dark/style.json",
  },
};

export default config;
