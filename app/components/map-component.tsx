import MaplibreInspect from "@maplibre/maplibre-gl-inspect";
import "@maplibre/maplibre-gl-inspect/dist/maplibre-gl-inspect.css";
import maplibregl, {
  FullscreenControl,
  LngLatLike,
  Map,
  NavigationControl,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { Theme, useTheme } from "remix-themes";
import config from "~/config";
import IndoorMapLayer from "~/layers/indoor-map-layer";
import POIsLayer from "~/layers/pois-layer";
import { ThreeJSLayer } from "~/layers/three-model-layer"; // Ensure this path is correct
import building from "~/mock/building.json";
import useMapStore from "~/stores/use-map-store";
import "~/maplibre.css";
import { IndoorMapGeoJSON } from "~/types/geojson";
import DiscoveryPanel from "./discovery-panel/discovery-panel";
import { FloorSelector } from "./floor-selector";
import { FloorUpDownControl } from "./floor-up-down-control";
import GeolocationControlComponent from "./geolocation-control";

export default function MapComponent() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [theme] = useTheme();
  const setMapInstance = useMapStore((state) => state.setMapInstance);

  // We use useState to hold the map instance.
  const [map, setMap] = useState<Map | null>(null);

  const indoorMapLayer = useMemo(
    () =>
      new IndoorMapLayer(
        building.indoor_map as IndoorMapGeoJSON,
        theme as string,
      ),
    [theme],
  );

  // Effect for creating the map instance ONCE
  useEffect(() => {
    if (map || !mapContainer.current) return; // If map exists or container is not ready, do nothing.

    const mapInstance = new maplibregl.Map({
      ...config.mapConfig,
      style: config.mapStyles[theme as Theme],
      container: mapContainer.current,
    });
    
    setMap(mapInstance);
    setMapInstance(mapInstance);

    // Add controls once the map is created.
    mapInstance.addControl(new NavigationControl(), "bottom-right");
    mapInstance.addControl(new FullscreenControl(), "bottom-right");

    if (process.env.NODE_ENV === "development") {
      mapInstance.addControl(
        new MaplibreInspect({
          popup: new maplibregl.Popup({ closeOnClick: false }),
          blockHoverPopupOnClick: true,
        }),
        "bottom-right",
      );
    }
    
    // The cleanup function is now only for when the component is unmounted.
    return () => {
      mapInstance.remove();
      setMap(null);
    };
  }, []); // Empty dependency array means this runs only once.

  // Effect for handling THEME changes
  useEffect(() => {
    if (!map || !theme) return;
    // Instead of creating a new map, we just update the style.
    map.setStyle(config.mapStyles[theme as Theme]);
    
  }, [theme, map]);


  // Effect for loading data and adding layers
  useEffect(() => {
    if (!map) return;

    const onMapLoad = () => {
      try {
        map.addLayer(indoorMapLayer);
        map.addLayer(
          new POIsLayer(building.pois as GeoJSON.GeoJSON, theme as string),
        );

        // Try loading the Main Administration model first
        const mainAdminPoi = building.pois.features.find(
          (feature) => feature.properties?.name === "Administration",
        );

        if (mainAdminPoi && mainAdminPoi.geometry.type === "Point") {
          console.log("Main Administration POI found, adding 3D model.");
          const adminCoordinates = mainAdminPoi.geometry.coordinates as LngLatLike;
          
          const threeJSLayer = new ThreeJSLayer(
            "main-admin-model",
            "/models/main_administration.glb",
            adminCoordinates,
          );
          map.addLayer(threeJSLayer);
        } else {
          console.warn("Main Administration POI not found in building data.");
          
          // Fallback to Kofi Tetteh Hall
          const ktHallPoi = building.pois.features.find(
            (feature) => feature.properties?.name === "Kofi Tetteh Hall",
          );

          if (ktHallPoi && ktHallPoi.geometry.type === "Point") {
            console.log("Kofi Tetteh Hall POI found, adding 3D model.");
            const ktHallCoordinates = ktHallPoi.geometry.coordinates as LngLatLike;
            
            const threeJSLayer = new ThreeJSLayer(
              "kt-hall-model",
              "/models/kt_hall.glb",
              ktHallCoordinates,
            );
            map.addLayer(threeJSLayer);
          } else {
            console.warn("Kofi Tetteh Hall POI not found in building data.");
          }
        }
      } catch (error) {
        console.error("Failed to initialize map layers:", error);
      }
    };
    
    // We need to wait for the map to be fully loaded before adding layers.
    if (map.isStyleLoaded()) {
      onMapLoad();
    } else {
      map.on('load', onMapLoad);
    }

    // Cleanup: remove the listener when the effect re-runs
    return () => {
      map.off('load', onMapLoad);
    }
  }, [map, indoorMapLayer, theme]); // This effect now depends on the map and layers.


  return (
    <div className="flex size-full flex-col">
      <DiscoveryPanel />
      {process.env.NODE_ENV === "development" && (
        <>
    
          <FloorSelector indoorMapLayer={indoorMapLayer} />
          <FloorUpDownControl indoorMapLayer={indoorMapLayer} />
        </>
      )}

      <div className="size-full" ref={mapContainer}>
        {map && <GeolocationControlComponent map={map} />}
      </div>
    </div>
  );
}