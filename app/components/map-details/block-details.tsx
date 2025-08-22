import { useCallback, useEffect, useState } from "react";
import { MapGeoJSONFeature, MapMouseEvent } from "maplibre-gl";
import building from "~/mock/building.json";
import useMapStore from "~/stores/use-map-store";
import poiMap from "~/utils/poi-map";
import { POI } from "~/types/poi";

export default function DiscoveryPanel() {
  const map = useMapStore((state) => state.mapInstance);
  const [mode, setMode] = useState<"discovery" | "detail" | "navigation">("discovery");
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);

  // Navigate to the selected POI's coordinates
  const navigateToPOI = useCallback(
    (coordinates: GeoJSON.Position) => {
      if (!map) return;
      try {
        map.flyTo({
          center: coordinates as [number, number],
          zoom: 20,
          duration: 1300,
        });
      } catch (error) {
        console.error("Error navigating to POI:", error);
      }
    },
    [map],
  );

  // Handle POI selection
  const handleSelectPOI = useCallback(
    (poi: POI) => {
      setSelectedPOI(poi);
      setMode("detail");
      navigateToPOI(poi.coordinates);
    },
    [navigateToPOI],
  );

  // Handle map clicks on the indoor-map-extrusion layer
  const handleMapClick = useCallback(
    (
      event: MapMouseEvent & {
        features?: MapGeoJSONFeature[];
      },
    ) => {
      const { features } = event;
      if (!features?.length) return;

      const clickedFeature = features[0];
      const unitId = Number(clickedFeature.id);
      const relatedPOIs = poiMap.get(unitId);

      console.log(`Clicked Unit ID: ${unitId}, Related POIs:`, relatedPOIs);

      if (relatedPOIs && relatedPOIs[0]) {
        const firstPOI = relatedPOIs[0];
        const poi: POI = {
          id: firstPOI.properties?.id as number,
          name: firstPOI.properties?.name as string,
          coordinates: firstPOI.geometry.coordinates,
        };
        handleSelectPOI(poi);
      } else {
        console.warn(`No POIs found for unit ID: ${unitId}`);
      }
    },
    [handleSelectPOI],
  );

  // Bind click event to the map
  useEffect(() => {
    if (!map) return;
    map.on("click", "indoor-map-extrusion", handleMapClick);
    return () => {
      map.off("click", "indoor-map-extrusion", handleMapClick);
    };
  }, [map, handleMapClick]);

  return (
    <div>
      {mode === "detail" && selectedPOI && (
        <div>
          <h2>{selectedPOI.name}</h2>
          <p>ID: {selectedPOI.id}</p>
          <p>Coordinates: {selectedPOI.coordinates.join(", ")}</p>
          <button onClick={() => setMode("discovery")}>Back</button>
        </div>
      )}
      {/* Other UI modes (discovery, navigation) */}
    </div>
  );
}