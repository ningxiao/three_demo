<template>
    <div class="sun w-screen h-screen bg-black"></div>
</template>
<script lang="ts">
import * as THREE from "three";
import Base from "@/utils/Base";
import { Component, Vue } from 'vue-property-decorator';
import sunNoiseVertexShader from "../shaders/sun/noise/vertex.glsl";
import sunNoiseFragmentShader from "../shaders/sun/noise/fragment.glsl";
import sunShapeVertexShader from "../shaders/sun/shape/vertex.glsl";
import sunShapeFragmentShader from "../shaders/sun/shape/fragment.glsl";
import sunRingVertexShader from "../shaders/sun/ring/vertex.glsl";
import sunRingFragmentShader from "../shaders/sun/ring/fragment.glsl";

class VSun extends Base {
    width: number;
    height: number;
    clock: THREE.Clock;
    cubeScene: THREE.Scene;
    cubeCamera: THREE.CubeCamera;
    cubeRt: THREE.WebGLCubeRenderTarget;
    sunRingMaterial: THREE.ShaderMaterial;
    sunNoiseMaterial: THREE.ShaderMaterial;
    sunShapeMaterial: THREE.ShaderMaterial;
    constructor(sel: string, debug: boolean) {
        super(sel, debug);
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.clock = new THREE.Clock();
        this.cameraPosition = new THREE.Vector3(0, 0, 2);
    }
    // 初始化
    init() {
        this.createScene();
        this.createPerspectiveCamera();
        this.createRenderer();
        this.createSunNoiseMaterial();
        this.createCubeRt();
        this.createSunShapeMaterial();
        this.createSun();
        this.createSunRingMaterial();
        this.createSunRing();
        this.createLight();
        this.trackMousePos();
        this.createOrbitControls();
        this.addListeners();
        this.setLoop();
    }
    // 创建噪声材质
    createSunNoiseMaterial() {
        const sunNoiseMaterial = new THREE.ShaderMaterial({
            vertexShader: sunNoiseVertexShader,
            fragmentShader: sunNoiseFragmentShader,
            side: THREE.DoubleSide,
            uniforms: {
                uTime: {
                    value: 0,
                },
                uMouse: {
                    value: new THREE.Vector2(0, 0),
                },
                uResolution: {
                    value: new THREE.Vector2(this.width, this.height),
                },
            },
        });
        this.sunNoiseMaterial = sunNoiseMaterial;
    }
    // 创建立方体离屏渲染目标，将其作为太阳本体的噪声贴图
    createCubeRt() {
        this.cubeRt = new THREE.WebGLCubeRenderTarget(256);
        this.cubeCamera = new THREE.CubeCamera(0.1, 10, this.cubeRt);
        this.cubeScene = new THREE.Scene();
        this.createMesh(
            {
                material: this.sunNoiseMaterial,
                geometry: new THREE.SphereBufferGeometry(1, 100, 100),
            },
            this.cubeScene
        );
    }
    // 创建太阳本体材质
    createSunShapeMaterial() {
        this.sunShapeMaterial = new THREE.ShaderMaterial(
            {
                vertexShader: sunShapeVertexShader,
                fragmentShader: sunShapeFragmentShader,
                side: THREE.DoubleSide,
                uniforms: {
                    uTime: {
                        value: 0,
                    },
                    uMouse: {
                        value: new THREE.Vector2(0, 0),
                    },
                    uResolution: {
                        value: new THREE.Vector2(this.width, this.height),
                    },
                    uNoiseTexture: {
                        value: null,
                    },
                    uVelocity: {
                        value: 0.05,
                    },
                    uBrightness: {
                        value: 0.33,
                    },
                    uStagger: {
                        value: 16,
                    },
                },
            });
    }
    // 创建太阳
    createSun() {
        this.createMesh({
            material: this.sunShapeMaterial,
            geometry: new THREE.SphereBufferGeometry(1, 100, 100),
        });
    }
    // 创建太阳环材质
    createSunRingMaterial() {
        this.sunRingMaterial = new THREE.ShaderMaterial({
            vertexShader: sunRingVertexShader,
            fragmentShader: sunRingFragmentShader,
            side: THREE.BackSide,
            uniforms: {
                uTime: {
                    value: 0,
                },
                uMouse: {
                    value: new THREE.Vector2(0, 0),
                },
                uResolution: {
                    value: new THREE.Vector2(this.width, this.height),
                },
            },
        });
    }
    // 创建太阳环
    createSunRing() {
        this.createMesh({
            material: this.sunRingMaterial,
            geometry: new THREE.SphereBufferGeometry(1.2, 100, 100)
        });
    }
    // 动画
    update() {
        const mousePos = this.mousePos;
        const elapsedTime = this.clock.getElapsedTime();
        if (this.sunNoiseMaterial && this.sunShapeMaterial) {
            this.cubeCamera.update(this.renderer, this.cubeScene);
            this.sunNoiseMaterial.uniforms.uTime.value = elapsedTime;
            this.sunNoiseMaterial.uniforms.uMouse.value = mousePos;
            this.sunShapeMaterial.uniforms.uTime.value = elapsedTime;
            this.sunShapeMaterial.uniforms.uMouse.value = mousePos;
            this.sunShapeMaterial.uniforms.uNoiseTexture.value = this.cubeRt.texture;
            this.sunRingMaterial.uniforms.uTime.value = elapsedTime;
            this.sunRingMaterial.uniforms.uMouse.value = mousePos;
        }
    }
}
@Component({
    components: {},
})
export default class Sun extends Vue {
    mounted() {
        new VSun(".sun", false).init();
    }
}
</script>
