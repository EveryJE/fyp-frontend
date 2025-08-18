import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import maplibregl, { CustomLayerInterface, Map } from "maplibre-gl";
import { mat4 } from "gl-matrix";
import { IndoorMapGeoJSON } from "~/types/geojson";

interface ModelConfig {
  featureId: number;
  modelUrl: string;
  scale: number;
}

export default class ThreeJsModelLayer implements CustomLayerInterface {
  id = "threejs-model-layer";
  type = "custom" as const;
  renderingMode = "3d" as const;
  private map: Map | null = null;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private models: Map<number, THREE.Group> = new Map();
  private geojson: IndoorMapGeoJSON;
  private modelConfigs: ModelConfig[];

  constructor(geojson: IndoorMapGeoJSON, modelConfigs: ModelConfig[]) {
    this.geojson = geojson;
    this.modelConfigs = modelConfigs;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
  }

  onAdd(map: Map, gl: WebGLRenderingContext) {
    this.map = map;
    this.renderer.setSize(map.getCanvas().width, map.getCanvas().height);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 0, 10);
    this.scene.add(directionalLight);

    this.loadModels();

    this.updateCamera();
    map.on("move", () => this.updateCamera());
    map.on("resize", () => {
      this.renderer.setSize(map.getCanvas().width, map.getCanvas().height);
      this.camera.aspect = map.getCanvas().width / map.getCanvas().height;
      this.camera.updateProjectionMatrix();
    });
  }

  private loadModels() {
    const loader = new GLTFLoader();
    this.modelConfigs.forEach((config) => {
      const feature = this.geojson.features.find((f) => f.id === config.featureId);
      if (!feature || feature.geometry.type !== "Polygon") return;

      const coordinates = feature.geometry.coordinates[0];
      const centroid = coordinates.reduce(
        (acc, [lon, lat]) => [acc[0] + lon / coordinates.length, acc[1] + lat / coordinates.length],
        [0, 0],
      );

      loader.load(
        config.modelUrl,
        (gltf) => {
          const model = gltf.scene;
          model.scale.set(config.scale, config.scale, config.scale);

          const mercator = maplibregl.MercatorCoordinate.fromLngLat(
            { lng: centroid[0], lat: centroid[1] },
            0,
          );
          model.position.set(mercator.x, mercator.y, 0);

          this.models.set(config.featureId, model);
          this.scene.add(model);
        },
        undefined,
        (error) => console.error(`Failed to load model ${config.modelUrl}:`, error),
      );
    });
  }

  private updateCamera() {
    if (!this.map) return;
    const { lng, lat } = this.map.getCenter();
    const mercator = maplibregl.MercatorCoordinate.fromLngLat({ lng, lat }, 0);
    const pitch = this.map.getPitch();
    const zoom = this.map.getZoom();

    const cameraHeight = 2 * Math.pow(2, 18 - zoom);
    this.camera.position.set(mercator.x, mercator.y, cameraHeight);
    this.camera.lookAt(mercator.x, mercator.y, 0);
    this.camera.fov = 60;
    this.camera.aspect = this.map.getCanvas().width / this.map.getCanvas().height;
    this.camera.updateProjectionMatrix();
  }

  render(_gl: WebGLRenderingContext, matrix: mat4) {
    const m = new THREE.Matrix4().fromArray(matrix as number[]);
    this.camera.projectionMatrix = m;

    this.renderer.state.reset();
    this.renderer.render(this.scene, this.camera);
    this.map?.triggerRepaint();
  }

  setFloorLevel(_floor: number) {
    // No-op for complete building models
  }

  onRemove() {
    this.renderer.dispose();
    this.models.clear();
    this.scene.clear();
    this.map = null;
  }
}