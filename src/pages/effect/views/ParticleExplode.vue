<template>
    <div class="w-screen h-screen flex-center">
        <img
            style="width: 30rem;"
            class="absolute cursor-pointer opacity-0"
            src="../../../assets/particle-explode/1761634220614_.pic_hd.jpg"
        />
        <div class="explode w-screen h-screen bg-black"></div>
    </div>
</template>
<script lang="ts">
import * as dat from "dat.gui";
import gsap from "gsap";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import Base from "@/utils/Base";
import { Component, Vue } from 'vue-property-decorator';
import explodeVertexShader from "../shaders/explode/vertex.glsl";
import explodeFragmentShader from "../shaders/explode/fragment.glsl";
import { getScreenFov, Maku } from "@/utils/dom";
class Explode extends Base {
    maku: Maku;
    clock: THREE.Clock;
    image: Element;
    isOpen: boolean;
    bloomPass: UnrealBloomPass;
    texture: HTMLImageElement;
    particleExplodeMaterial!: THREE.ShaderMaterial;
    params: { [key: string]: number } = {
        exposure: 1,
        bloomStrength: 0,
        bloomThreshold: 0,
        bloomRadius: 0,
    };
    constructor(sel: string, debug: boolean) {
        super(sel, debug);
        this.clock = new THREE.Clock();
        this.cameraPosition = new THREE.Vector3(0, 0, 1500);
        const fov = getScreenFov(this.cameraPosition.z);
        this.perspectiveCameraParams = {
            fov,
            near: 0.1,
            far: 5000,
        };
        this.isOpen = false;
    }
    // 初始化
    createInit(texture: HTMLImageElement) {
        this.texture = texture;
        this.createScene();
        this.createPerspectiveCamera();
        this.createRenderer();
        this.createParticleExplodeMaterial();
        this.createPoints();
        this.createPostprocessingEffect();
        this.createClickEffect();
        this.createLight();
        this.trackMousePos();
        this.createOrbitControls();
        // this.createDebugPanel();
        this.addListeners();
        this.setLoop();
    }
    // 创建材质
    createParticleExplodeMaterial() {
        const particleExplodeMaterial = new THREE.ShaderMaterial({
            vertexShader: explodeVertexShader,
            fragmentShader: explodeFragmentShader,
            side: THREE.DoubleSide,
            uniforms: {
                uTime: {
                    value: 0,
                },
                uMouse: {
                    value: new THREE.Vector2(0, 0)
                },
                uResolution: {
                    value: new THREE.Vector2(window.innerWidth, window.innerHeight),
                },
                uProgress: {
                    value: 0
                },
                uTexture: {
                    value: null
                }
            }
        });
        this.particleExplodeMaterial = particleExplodeMaterial;
    }
    // 创建点
    createPoints() {
        const maku = new Maku(
            this.texture,
            this.particleExplodeMaterial,
            this.scene,
            "points",
            "size",
            { width: 128 * 4, height: 128 * 4 }
        );
        maku.setPosition();
        this.maku = maku;
    }
    // 创建后期特效
    createPostprocessingEffect() {
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5,
            0.4,
            0.85
        );
        bloomPass.threshold = this.params.bloomThreshold;
        bloomPass.strength = this.params.bloomStrength;
        bloomPass.radius = this.params.bloomRadius;
        this.bloomPass = bloomPass;
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(new RenderPass(this.scene, this.camera));
        this.composer.addPass(bloomPass);
    }
    // 创建点击效果
    createClickEffect() {
        const material = this.maku.mesh.material as THREE.ShaderMaterial;
        this.maku.el.addEventListener("click", () => {
            if (!this.isOpen) {
                gsap.to(material.uniforms.uProgress, {
                    value: 3,
                    duration: 1,
                });
                this.isOpen = true;
            } else {
                gsap.to(material.uniforms.uProgress, {
                    value: 0,
                    duration: 1,
                });
                this.isOpen = false;
            }
        });
    }
    // 动画
    update() {
        const elapsedTime = this.clock.getElapsedTime();
        const mousePos = this.mousePos;
        if (this.maku) {
            const material = this.maku.mesh.material as THREE.ShaderMaterial;
            material.uniforms.uTime.value = elapsedTime;
            material.uniforms.uMouse.value = mousePos;
        }
        this.bloomPass.strength = this.params.bloomStrength;
    }
    // 创建调试面板
    createDebugPanel() {
        const gui = new dat.GUI();
        const material = this.maku.mesh.material as THREE.ShaderMaterial;
        const uniforms = material.uniforms;
        const params = this.params;
        gui
            .add(uniforms.uProgress, "value")
            .min(0)
            .max(3)
            .step(0.01)
            .name("progress");
        gui
            .add(params, "bloomStrength")
            .min(0)
            .max(10)
            .step(0.01);
    }

}
@Component({
    components: {},
})
export default class ParticleExplode extends Vue {
    mounted() {
        const img = document.querySelector('img');
        img.onload = () => {
            new Explode(".explode", false).createInit(img);
        };
    }
}
</script>
