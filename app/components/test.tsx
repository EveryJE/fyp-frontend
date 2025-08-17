import MaplibreInspect from "@maplibre/maplibre-gl-inspect";
import "@maplibre/maplibre-gl-inspect/dist/maplibre-gl-inspect.css";
import maplibregl, {
  FullscreenControl,
  NavigationControl,
  Map,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useMemo, useRef, useState } from "react";
import config from "~/config";
import IndoorMapLayer from "~/layers/indoor-map-layer";
import POIsLayer from "~/layers/pois-layer";
import building from "~/mock/building.json";
import useMapStore from "~/stores/use-map-store";
import DiscoveryPanel from "./discovery-panel/discovery-panel";
import { FloorSelector } from "./floor-selector";
import { FloorUpDownControl } from "./floor-up-down-control";
import { IndoorMapGeoJSON } from "~/types/geojson";
import DemoBanner from "./demo-banner";
// import OIMLogo from "../controls/oim-logo";
import { Theme, useTheme } from "remix-themes";
import "~/maplibre.css";
import GeolocationControlComponent from "./geolocation-control";
import {
  Feature,
  Point,
  Polygon,
  LineString,
  GeoJsonProperties,
} from "geojson";

export default function MapComponent() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [theme] = useTheme();

  const setMapInstance = useMapStore((state) => state.setMapInstance);
  const indoorMapLayer = useMemo(
    () =>
      new IndoorMapLayer(
        building.indoor_map as IndoorMapGeoJSON,
        theme as string,
      ),
    [theme],
  );

  const [map, setMap] = useState<Map | null>(null);

  useEffect(() => {
    if (mapContainer.current && !map) {
      const isDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      const mapStyle = isDarkMode
        ? config.mapStyles.dark
        : config.mapStyles.light;

      const mapInstance = new maplibregl.Map({
        container: mapContainer.current,
        style: mapStyle,
        center: config.mapConfig.center as [number, number],
        zoom: config.mapConfig.zoom,
        bearing: config.mapConfig.bearing,
        pitch: config.mapConfig.pitch,
        maxBounds: config.mapConfig.maxBounds as [
          [number, number],
          [number, number],
        ],
      });

      setMap(mapInstance);
    }
  }, []);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      ...config.mapConfig,
      style: config.mapStyles[theme as Theme],
      container: mapContainer.current,
    });
    setMapInstance(map);

    map.on("load", () => {
      try {
        // map.addLayer(new Tile3dLayer());
        map.addLayer(indoorMapLayer);
        map.addLayer(
          new POIsLayer(building.pois as GeoJSON.GeoJSON, theme as string),
        );
      } catch (error) {
        console.error("Failed to initialize map layers:", error);
      }
    });

    map.addControl(new NavigationControl(), "bottom-right");
    map.addControl(new FullscreenControl(), "bottom-right");

    if (process.env.NODE_ENV === "development") {
      map.addControl(
        new MaplibreInspect({
          popup: new maplibregl.Popup({
            closeOnClick: false,
          }),
          blockHoverPopupOnClick: true,
        }),
        "bottom-right",
      );
    }

    // map.addControl(new OIMLogo());

    return () => {
      map.remove();
    };
  }, [indoorMapLayer, setMapInstance, theme]);

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
      {/* <DemoBanner /> */}
    </div>
  );
}
