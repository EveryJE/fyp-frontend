import { NavigationControl } from "maplibre-gl";
import { useEffect, useState } from "react";
import IndoorMapLayer from "~/layers/indoor-map-layer";
import ThreeJsModelLayer from "~/layers/three-model-layer";
import useFloorStore from "~/stores/floor-store";
import useMapStore from "~/stores/use-map-store";

interface FloorUpDownControlProps {
  indoorMapLayer: IndoorMapLayer;
  threeJsLayer: ThreeJsModelLayer;
}

export function FloorUpDownControl({
  indoorMapLayer,
  threeJsLayer,
}: FloorUpDownControlProps) {
  const map = useMapStore((state) => state.mapInstance);
  const { currentFloor, setCurrentFloor } = useFloorStore();
  const [availableFloors, setAvailableFloors] = useState<number[]>([0]);

  useEffect(() => {
    const loadFloors = async () => {
      const floors = await indoorMapLayer.getAvailableFloors();
      setAvailableFloors(floors.sort((a, b) => a - b));
    };
    loadFloors();
  }, [indoorMapLayer]);

  useEffect(() => {
    const floorControl = new NavigationControl({
      showCompass: false,
      showZoom: false,
      visualizePitch: false,
    });

    map?.addControl(floorControl, "bottom-right");

    const upButton = document.createElement("button");
    upButton.className = "maplibregl-ctrl-icon maplibregl-ctrl-floor-up dark:text-black";
    upButton.innerHTML = "&#8593;";
    upButton.addEventListener("click", () => {
      const nextFloor = availableFloors.find((f) => f > currentFloor) ?? currentFloor;
      if (nextFloor !== currentFloor) {
        setCurrentFloor(nextFloor);
        indoorMapLayer.setFloorLevel(nextFloor);
        threeJsLayer.setFloorLevel(nextFloor);
        map?.flyTo({ pitch: 45, zoom: 18, duration: 1000 });
      }
    });

    const downButton = document.createElement("button");
    downButton.className = "maplibregl-ctrl-icon maplibregl-ctrl-floor-down dark:text-black";
    downButton.innerHTML = "&#8595;";
    downButton.addEventListener("click", () => {
      const prevFloor = availableFloors.reverse().find((f) => f < currentFloor) ?? currentFloor;
      if (prevFloor !== currentFloor) {
        setCurrentFloor(prevFloor);
        indoorMapLayer.setFloorLevel(prevFloor);
        threeJsLayer.setFloorLevel(prevFloor);
        map?.flyTo({ pitch: 45, zoom: 18, duration: 1000 });
      }
    });

    floorControl._container.append(upButton, downButton);

    return () => {
      map?.removeControl(floorControl);
    };
  }, [map, currentFloor, setCurrentFloor, indoorMapLayer, threeJsLayer, availableFloors]);

  return null;
}