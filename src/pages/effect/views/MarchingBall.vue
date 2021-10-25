<template>
    <div class="ray-marching-ball w-screen h-screen bg-black"></div>
</template>
<script lang="ts">
import * as THREE from "three";
import Base from "@/utils/Base";
import { Component, Vue } from 'vue-property-decorator';
import vertexShader from "../shaders/marching/vertex.glsl";
import fragmentShader from "../shaders/marching/fragment.glsl";
class VMarchingBall extends Base {
    clock: THREE.Clock = new THREE.Clock();
    cameraPosition: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    rayMarchingBallMaterial: THREE.ShaderMaterial;
    params: { [key: string]: number | string } = {
        brightness: "#808080",
        contrast: "#808080",
        oscilation: "#d9fcfb",
        phase: "#3c4f82",
        oscilationPower: 1.8,
        bgColor: "#07111d",
    };
    constructor(sel: string, debug: boolean) {
        super(sel, debug);
    }
    // 初始化
    init() {
        this.createScene();
        this.createOrthographicCamera();
        this.createRenderer();
        this.createRayMarchingBallMaterial();
        this.createPlane();
        this.createLight();
        this.addListeners();
        this.setLoop();
    }
    createRayMarchingBallMaterial() {
        this.shaderMaterial = this.rayMarchingBallMaterial = new THREE.ShaderMaterial(
            {
                vertexShader: vertexShader,
                fragmentShader: fragmentShader,
                side: THREE.DoubleSide,
                uniforms: {
                    uTime: {
                        value: 0,
                    },
                    uMouse: {
                        value: new THREE.Vector2(0, 0),
                    },
                    uResolution: {
                        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
                    },
                    uBrightness: {
                        value: new THREE.Color(this.params.brightness),
                    },
                    uContrast: {
                        value: new THREE.Color(this.params.contrast),
                    },
                    uOscilation: {
                        value: new THREE.Color(this.params.oscilation),
                    },
                    uPhase: {
                        value: new THREE.Color(this.params.phase),
                    },
                    uOscilationPower: {
                        value: this.params.oscilationPower,
                    },
                    uScale: {
                        value: 12,
                    },
                    uScaleUv: {
                        value: 1.5,
                    },
                    uEye: {
                        value: 8,
                    },
                    uVelocity: {
                        value: 0.1,
                    },
                    uBgColor: {
                        value: new THREE.Color(this.params.bgColor),
                    },
                },
            });
    }
    // 创建平面
    createPlane() {
        this.createMesh(
            {
                material: this.rayMarchingBallMaterial,
                geometry: new THREE.PlaneBufferGeometry(2, 2, 100, 100)
            }
        );
    }
    // 动画
    update() {
        if (this.rayMarchingBallMaterial) {
            this.rayMarchingBallMaterial.uniforms.uTime.value = this.clock.getElapsedTime();
            this.rayMarchingBallMaterial.uniforms.uMouse.value = this.mousePos;
        }
    }
}
@Component({
    components: {},
})
export default class MarchingBall extends Vue {
    mounted() {
        new VMarchingBall(".ray-marching-ball", false).init();
    }
}
</script>
