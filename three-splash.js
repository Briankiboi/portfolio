import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// ==========================================
// 1. MAIN 3D DESKTOP PC SCENE
// ==========================================
const canvas = document.getElementById('webgl-canvas');
const loaderElement = document.getElementById('loader');
const loaderProgress = document.getElementById('loader-progress');

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  25,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(20, 3, 5);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true,
  preserveDrawingBuffer: true,
  powerPreference: "high-performance"
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.maxPolarAngle = Math.PI / 2;
controls.minPolarAngle = Math.PI / 2;
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.autoRotate = false;

// Lights
const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.15);
scene.add(hemisphereLight);

const spotLight = new THREE.SpotLight(0xffffff, 1);
spotLight.position.set(-20, 50, 10);
spotLight.angle = 0.12;
spotLight.penumbra = 1;
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
scene.add(spotLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
scene.add(pointLight);

// Responsive sizing & positioning
let desktopModel = null;
const DESKTOP_INITIAL_ROT_Y = -0.2;
const MOBILE_INITIAL_ROT_Y = 0.75;

function isMobile() {
  return window.innerWidth <= 768;
}

function getInitialRotY() {
  return isMobile() ? MOBILE_INITIAL_ROT_Y : DESKTOP_INITIAL_ROT_Y;
}

function updateModelTransform() {
  if (!desktopModel) return;
  const width = window.innerWidth;

  if (width <= 480) {
    // Mobile phones: Scale 0.70, position [0, -3.10, -1.5]
    desktopModel.scale.set(0.70, 0.70, 0.70);
    desktopModel.position.set(0, -3.10, -1.5);
  } else if (width <= 768) {
    // Tablets / Large phones
    desktopModel.scale.set(0.74, 0.74, 0.74);
    desktopModel.position.set(0, -3.10, -1.5);
  } else if (width <= 1024) {
    // Small laptops
    desktopModel.scale.set(0.78, 0.78, 0.78);
    desktopModel.position.set(0.4, -2.8, -1.5);
  } else {
    // Full Desktop Monitors (Exact untouched position)
    desktopModel.scale.set(0.88, 0.88, 0.88);
    desktopModel.position.set(0.6, -3.0, -1.5);
  }
  
  if (!isSpinning) {
    desktopModel.rotation.set(-0.01, getInitialRotY(), -0.1);
  }
}

// Load GLTF Model
const gltfLoader = new GLTFLoader();
gltfLoader.load(
  './desktop_pc/scene.gltf',
  (gltf) => {
    desktopModel = gltf.scene;

    desktopModel.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.needsUpdate = true;
        }
      }
    });

    updateModelTransform();
    scene.add(desktopModel);

    // Hide loader
    if (loaderElement) {
      loaderElement.style.opacity = '0';
      setTimeout(() => {
        loaderElement.style.display = 'none';
      }, 350);
    }
  },
  (xhr) => {
    if (xhr.lengthComputable && loaderProgress) {
      const percent = (xhr.loaded / xhr.total) * 100;
      loaderProgress.textContent = percent.toFixed(2) + '%';
    }
  },
  (error) => {
    console.error('Error loading 3D model:', error);
  }
);

// Window Resize Handler
window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  updateModelTransform();
});

// Ultra-Smooth Single 360 Clockwise Rotation Engine
let isSpinning = false;
let spinProgress = 0;
const SPIN_SPEED = 0.0075;

export function trigger360Spin() {
  if (isSpinning) return;
  isSpinning = true;
  spinProgress = 0;
  controls.enabled = false;
}

// Render loop
function animate() {
  requestAnimationFrame(animate);

  if (isSpinning && desktopModel) {
    spinProgress += SPIN_SPEED;
    const startRotY = getInitialRotY();

    if (spinProgress <= 1.0) {
      const ease = 0.5 - 0.5 * Math.cos(spinProgress * Math.PI);
      desktopModel.rotation.y = startRotY - ease * (Math.PI * 2);
    } else {
      isSpinning = false;
      spinProgress = 0;
      desktopModel.rotation.y = startRotY;
      controls.enabled = true;
    }
  } else {
    controls.update();
  }

  renderer.render(scene, camera);
}

animate();

// ==========================================
// 2. TYPEWRITER ANIMATION
// ==========================================
const typedHead = document.getElementById('typed-head');
const typedSub = document.getElementById('typed-sub');

const headPrefix = "Hi, I'm ";
const headName = "Brian Kiboi";
const subText = "Mobile Developer & Full-Stack Engineer";

let charIndexHead = 0;
let charIndexName = 0;
let charIndexSub = 0;

function startTypewriter() {
  if (!typedHead || !typedSub) return;
  typedHead.innerHTML = '';
  typedSub.textContent = '';

  function typeHeadPrefix() {
    if (charIndexHead < headPrefix.length) {
      typedHead.appendChild(document.createTextNode(headPrefix.charAt(charIndexHead)));
      charIndexHead++;
      setTimeout(typeHeadPrefix, 80);
    } else {
      const spanName = document.createElement('span');
      spanName.className = 'purple-highlight';
      typedHead.appendChild(spanName);
      typeHeadName(spanName);
    }
  }

  function typeHeadName(spanElement) {
    if (charIndexName < headName.length) {
      spanElement.textContent += headName.charAt(charIndexName);
      charIndexName++;
      setTimeout(typeHeadName.bind(null, spanElement), 90);
    } else {
      setTimeout(() => {
        trigger360Spin();
        typeSub();
      }, 550);
    }
  }

  function typeSub() {
    if (charIndexSub < subText.length) {
      typedSub.textContent += subText.charAt(charIndexSub);
      charIndexSub++;
      setTimeout(typeSub, 45);
    }
  }

  setTimeout(typeHeadPrefix, 600);
}

startTypewriter();