<template>
    <canvas
        ref="canvas"
        class="starry_sky"
    />
</template>
<script lang="ts">
/**
 * 绘制地球背后的银河星空
 */
import { Component, Vue } from 'vue-property-decorator';
@Component({
    components: {}
})
export default class StarrySky extends Vue {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private animationFrame: number;
    private onWindowResize!: () => void;
    constructor() {
        super();
    }
    private init() {
        let w = 0;
        let h = 0;
        let x = 0;
        let y = 0;
        let z = 0;
        let zRatio: number;
        let isTest = true;
        let lastx;
        let lasty;
        const speed = 0.8;
        const size = 256;
        const ratio = 256;
        const points: number[][] = [];
        this.canvas = this.$refs.canvas as HTMLCanvasElement;
        this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.onWindowResize = () => {
            const rect: ClientRect = this.canvas.getBoundingClientRect();
            window.cancelAnimationFrame(this.animationFrame);
            w = rect.width;
            h = rect.height;
            x = Math.round(w / 2);
            y = Math.round(h / 2);
            z = (w + h) / 2;
            zRatio = 1 / z;
            for (let i = 0; i < size; i++) {
                points[i] = [];
                points[i][0] = Math.random() * w * 2 - x * 2;
                points[i][1] = Math.random() * h * 2 - y * 2;
                points[i][2] = Math.round(Math.random() * z);
                points[i][3] = 0;
                points[i][4] = 0;
            }
            this.canvas.width = w;
            this.canvas.height = h;
            this.animationFrame = requestAnimationFrame(plsy);
        };
        const plsy = () => {
            this.animationFrame = requestAnimationFrame(plsy);
            this.context.fillStyle = '#171924';
            this.context.fillRect(0, 0, w, h);
            this.context.save(); // 保存画布的状态
            this.context.strokeStyle = 'rgb(255,255,255)';
            for (let i = 0; i < size; i++) {
                isTest = true;
                lastx = points[i][3];
                lasty = points[i][4];
                points[i][2] -= speed;
                if (points[i][2] > z) {
                    points[i][2] -= z;
                    isTest = false;
                }
                if (points[i][2] < 0) {
                    points[i][2] += z;
                    isTest = false;
                }
                points[i][3] = x + (points[i][0] / points[i][2]) * ratio;
                points[i][4] = y + (points[i][1] / points[i][2]) * ratio;
                if (
                    lastx > 0 &&
                    lastx < w &&
                    lasty > 0 &&
                    lasty < h &&
                    isTest
                ) {
                    this.context.lineWidth = (1 - zRatio * points[i][2]) * 2;
                    this.context.beginPath();
                    this.context.moveTo(lastx, lasty);
                    this.context.lineTo(points[i][3], points[i][4]);
                    this.context.stroke();
                    this.context.closePath();
                }
            }
            this.context.restore();
        };
        this.onWindowResize();
        this.animationFrame = requestAnimationFrame(plsy);
        window.addEventListener('resize', this.onWindowResize);
    }
    mounted() {
        this.init();
    }
    beforeDestroy() {
        cancelAnimationFrame(this.animationFrame);
        removeEventListener('resize', this.onWindowResize);
    }
}
</script>
