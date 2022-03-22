<template>
    <main class="container">
        <video />
        <canvas
            width="1280px"
            height="720px"
        />
    </main>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Stats from 'three/examples/jsm/libs/stats.module';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { Hands, HAND_CONNECTIONS } from '@mediapipe/hands';
@Component({
    components: {
    },
})
export default class App extends Vue {
    constructor() {
        super();
    }
    mounted() {
        const stats = Stats();
        const dpr = window.devicePixelRatio || 1;
        const video: HTMLVideoElement = document.querySelector('video');
        const canvas: HTMLCanvasElement = document.querySelector('canvas');
        const ctx = canvas.getContext('2d');
        const width: number = canvas.offsetWidth;
        const height: number = canvas.offsetHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.cssText = `width:${width}px;height:${height}px`;
        const onResults = (results) => {
            ctx.save();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
            if (results.multiHandLandmarks) {
                for (const landmarks of results.multiHandLandmarks) {
                    drawConnectors(ctx, landmarks, HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 5 });
                    drawLandmarks(ctx, landmarks, { color: '#FF0000', lineWidth: 2 });
                }
            }
            ctx.restore();
            stats.update();
        };
        stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(stats.dom);
        const hands = new Hands({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
            }
        });
        hands.setOptions({
            maxNumHands: 2,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });
        hands.onResults(onResults);
        new Camera(video, {
            width: 1280,
            height: 720,
            onFrame: async () => {
                await hands.send({ image: video });
            }
        }).start();
    }
}
</script>
