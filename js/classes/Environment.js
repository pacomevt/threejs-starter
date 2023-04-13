import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { vertex, fragment } from '../shaders/shaders.js';
import vibrantUrl from '../../assets/textures/vibrant.jpg';
import GUI from 'lil-gui';
import gsap from 'gsap';

export class Environment {
    constructor() {
        this.#load();
    }
    #load() {
        const manager = new THREE.LoadingManager();
        // const gltfLoader = new GLTFLoader(manager);
        const textureLoader = new THREE.TextureLoader(manager);
        // const dracoLoader = new DRACOLoader(manager);
        // dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

        this.texture = textureLoader.load(vibrantUrl);
        manager.onLoad = () => {
            this.#init();            
        }
    }
    #init() {
        // Scene
        this.scene = new THREE.Scene();

        // Camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 0, 5);
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            depth: true,
            powerPreference: 'high-performance',
        });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0xffffff, 0);
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.physicallyCorrectLights = true;
        this.renderer.shadowMap.enabled = true;
        // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        // this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        // this.renderer.toneMappingExposure = 0.5;
        document.body.appendChild(this.renderer.domElement);

        // Controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = true;

        // Raycaster
        this.raycaster = new THREE.Raycaster();
        this.intersects = [];
        this.mouse = new THREE.Vector2();

        // Lights
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(this.ambientLight);

        // GUI
        this.gui = new GUI();
        // this.gui.addFolder('Camera');
        // this.gui.addFolder('Lights');
        this.gui.addFolder('Objects');

        // CLOCK
        this.clock = new THREE.Clock();
        this.time = 0;

        this.#bindEvents();
        this.#addObjects();
        this.renderer.setAnimationLoop(() => {this.#render();});
    }

    #bindEvents() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        });
        window.addEventListener('mousemove', (e) => {
            //set raycaster on windows
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
            //set raycaster on custom container
            // this.mouse.x = ((e.clientX - this.container.box.x) / this.container.box.width) * 2 - 1;
            // this.mouse.y = -((e.clientY - this.container.box.y) / this.container.box.height) * 2 + 1;
            this.raycaster.setFromCamera(this.mouse, this.camera);
        });
    }

    #addObjects() {
        this.planeGeometry = new THREE.PlaneGeometry(10, 10, 10, 10);
        this.shaderMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
                uMouse: { value: new THREE.Vector2(0, 0) },
                uTexture: { value: this.texture },
            },
            vertexShader: vertex,
            fragmentShader: fragment,
            side: THREE.DoubleSide,
            wireframe: false,
        });
        this.plane = new THREE.Mesh(this.planeGeometry, this.shaderMaterial);
        this.plane.position.set(0, 0, -5);
        this.scene.add(this.plane);
    }

    #render() {
        this.renderer.render(this.scene, this.camera);
        // this.shaderMaterial.uniforms.uTime.value = this.clock.getElapsedTime();
    }
}