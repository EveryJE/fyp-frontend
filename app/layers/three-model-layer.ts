import maplibregl, { Map, LngLatLike } from "maplibre-gl";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// --- START DEBUGGING SETTINGS ---
// You will need to tweak these values based on the console output.
const modelAltitude = 100; // Increase altitude to make model visible above ground
// Adjust rotation - try no rotation initially
const modelRotate = [0, 0, 0];
// Start with a large, obvious scale.
const modelScale = 1;
// --- END DEBUGGING SETTINGS ---

export class ThreeJSLayer {
  id: string;
  type: "custom";
  renderingMode: "3d";

  private camera: THREE.Camera;
  private scene: THREE.Scene;
  private map: Map | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private modelURL: string;
  private modelOrigin: LngLatLike;
  private modelLoaded: boolean = false;
  
  private modelTransform: {
    translateX: number;
    translateY: number;
    translateZ: number;
    rotateX: number;
    rotateY: number;
    rotateZ: number;
    scale: number;
  } | undefined;

  constructor(id: string, modelURL: string, origin: LngLatLike) {
    this.id = id;
    this.modelURL = modelURL;
    this.modelOrigin = origin;
    this.type = "custom";
    this.renderingMode = "3d";

    this.camera = new THREE.Camera();
    this.scene = new THREE.Scene();

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.75);
    directionalLight.position.set(0.5, -1, 1);
    this.scene.add(directionalLight);
  }

  onAdd(map: Map, gl: WebGLRenderingContext) {
    this.map = map;
    this.renderer = new THREE.WebGLRenderer({
      canvas: map.getCanvas(),
      context: gl,
      antialias: true,
    });
    this.renderer.autoClear = false;
    
    const modelAsMercatorCoordinate = maplibregl.MercatorCoordinate.fromLngLat(
      this.modelOrigin,
      modelAltitude
    );

    this.modelTransform = {
      translateX: modelAsMercatorCoordinate.x,
      translateY: modelAsMercatorCoordinate.y,
      translateZ: modelAsMercatorCoordinate.z,
      rotateX: modelRotate[0],
      rotateY: modelRotate[1],
      rotateZ: modelRotate[2],
      scale: modelScale,
    };
    
    // --- ESSENTIAL DEBUGGING LOGS ---
    console.log(`[ThreeJSLayer] Adding layer. Attempting to load model from: ${this.modelURL}`);
    console.log(`[ThreeJSLayer] Model will be placed at coordinates:`, this.modelOrigin);
    console.log(`[ThreeJSLayer] Model scale set to: ${modelScale}`);
    console.log(`[ThreeJSLayer] Model altitude set to: ${modelAltitude}`);
    console.log(`[ThreeJSLayer] Model rotation set to:`, modelRotate);
    // ---

    const loader = new GLTFLoader();
    loader.load(
      this.modelURL,
      // SUCCESS callback
      (gltf) => {
        console.log("%c[ThreeJSLayer] Model successfully loaded and parsed!", "color: green; font-weight: bold;", gltf);
        console.log("[ThreeJSLayer] GLTF scene:", gltf.scene);
        console.log("[ThreeJSLayer] GLTF scene children count:", gltf.scene.children.length);
        this.scene.add(gltf.scene);
        this.modelLoaded = true;
        console.log("[ThreeJSLayer] Model added to scene. Scene children count:", this.scene.children.length);
      },
      // PROGRESS callback (optional, but good for checking network activity)
      (xhr) => {
        console.log(`[ThreeJSLayer] Model loading progress: ${xhr.total ? (xhr.loaded / xhr.total * 100).toFixed(2) : 'unknown'}% loaded`);
        console.log("[ThreeJSLayer] Loaded bytes:", xhr.loaded, "Total bytes:", xhr.total);
      },
      // ERROR callback
      (error: any) => {
        console.error("[ThreeJSLayer] An error happened while loading the 3D model:", error);
        // Additional error details
        console.error("[ThreeJSLayer] Model URL that failed to load:", this.modelURL);
        if (error && typeof error === 'object') {
          console.error("[ThreeJSLayer] XMLHttpRequest status:", error.xhr?.status);
          console.error("[ThreeJSLayer] Error message:", error.message);
        }
        // Mark model as loaded even on error to prevent infinite waiting
        this.modelLoaded = true;
      }
    );
  }

  

  render(gl: WebGLRenderingContext, matrix: ArrayLike<number>) {
    console.log("[ThreeJSLayer] Render method called");
    if (!this.renderer || !this.map || !this.modelTransform || !this.modelLoaded) {
      console.log("[ThreeJSLayer] Render method returning early due to missing dependencies");
      console.log("[ThreeJSLayer] Renderer:", !!this.renderer);
      console.log("[ThreeJSLayer] Map:", !!this.map);
      console.log("[ThreeJSLayer] ModelTransform:", !!this.modelTransform);
      console.log("[ThreeJSLayer] ModelLoaded:", this.modelLoaded);
      return;
    }

    const rotationX = new THREE.Matrix4().makeRotationX(this.modelTransform.rotateX);
    const rotationY = new THREE.Matrix4().makeRotationY(this.modelTransform.rotateY);
    const rotationZ = new THREE.Matrix4().makeRotationZ(this.modelTransform.rotateZ);

    const m = new THREE.Matrix4().fromArray(matrix);
    const l = new THREE.Matrix4()
      .makeTranslation(
        this.modelTransform.translateX,
        this.modelTransform.translateY,
        this.modelTransform.translateZ
      )
      .scale(
        new THREE.Vector3(
          this.modelTransform.scale,
          -this.modelTransform.scale, // Inverting Y is typical for map alignment
          this.modelTransform.scale
        )
      )
      .multiply(rotationX)
      .multiply(rotationY)
      .multiply(rotationZ);

    console.log("[ThreeJSLayer] Camera projection matrix being set");
    this.camera.projectionMatrix = m.multiply(l);
    console.log("[ThreeJSLayer] Renderer state being reset");
    this.renderer.resetState();
    console.log("[ThreeJSLayer] Scene being rendered");
    this.renderer.render(this.scene, this.camera);
    console.log("[ThreeJSLayer] Map repaint being triggered");
    this.map.triggerRepaint();
  }
}