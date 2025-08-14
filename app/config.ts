const isMobile = typeof globalThis === "undefined" ? false : globalThis.innerWidth < 640;

const config = {
  geoCodingApi: "https://nominatim.openstreetmap.org",
  routingApi: "https://router.project-osrm.org/route/v1",
  mapConfig: {
    center: [-2.0019, 5.2974],
    zoom: 16,
    bearing: -15,
    pitch: 45,
    maxBounds :[[-2.00454, 5.29415], [-1.99929, 5.30060] 
    ]
  } as maplibregl.MapOptions,
  mapStyles: {
  light: "https://tiles.openfreemap.org/styles/bright",
    dark: "/styles/dark/style.json",
  },
};

export default config;
