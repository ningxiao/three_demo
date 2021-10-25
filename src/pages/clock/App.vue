<template>
    <div class="clock">
        <div class="flip">
            <div
                class="digital front"
                data-number="0"
            ></div>
            <div
                class="digital back"
                data-number="1"
            ></div>
        </div>
        <div class="flip">
            <div
                class="digital front"
                data-number="0"
            ></div>
            <div
                class="digital back"
                data-number="1"
            ></div>
        </div>
        <em class="divider">:</em>
        <div class="flip">
            <div
                class="digital front"
                data-number="0"
            ></div>
            <div
                class="digital back"
                data-number="1"
            ></div>
        </div>
        <div class="flip">
            <div
                class="digital front"
                data-number="0"
            ></div>
            <div
                class="digital back"
                data-number="1"
            ></div>
        </div>
        <em class="divider">:</em>
        <div class="flip">
            <div
                class="digital front"
                data-number="0"
            ></div>
            <div
                class="digital back"
                data-number="1"
            ></div>
        </div>
        <div class="flip">
            <div
                class="digital front"
                data-number="0"
            ></div>
            <div
                class="digital back"
                data-number="1"
            ></div>
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
class Flipper {
    private duration = 600;
    private isFlipping = false;
    private dom: Element;
    private frontNode: HTMLElement;
    private backNode: HTMLElement;
    constructor(dom: Element, currentTime: string, nextTime: string) {
        this.dom = dom;
        this.frontNode = dom.querySelector(".front");
        this.backNode = dom.querySelector(".back");
        this.setFrontTime(currentTime);
        this.setBackTime(nextTime);
    }
    setFrontTime(time: string) {
        this.frontNode!.dataset.number = time;
    }
    setBackTime(time: string) {
        this.backNode!.dataset.number = time;
    }
    flipDown(currentTime: string, nextTime: string) {
        if (this.isFlipping) {
            return false;
        }
        this.isFlipping = true;
        this.setFrontTime(currentTime);
        this.setBackTime(nextTime);
        this.dom.classList.add("running");
        setTimeout(() => {
            this.dom.classList.remove("running");
            this.isFlipping = false;
            this.setFrontTime(nextTime);
        }, this.duration);
    }
}


@Component({
    components: {},
})
export default class App extends Vue {
    private tid: number;
    private flips: HTMLElement[];
    constructor() {
        super();
    }
    private getTimeFromDate(date: Date) {
        return date.toTimeString()
            .slice(0, 8)
            .split(":")
            .join("");
    }
    mounted() {
        this.flips = Array.from(document.querySelectorAll(".flip"));
        let now = new Date();
        let nowTimeStr = this.getTimeFromDate(new Date(now.getTime() - 1000));
        let nextTimeStr = this.getTimeFromDate(now);
        const flippers = this.flips.map((dom, i) => new Flipper(dom, nowTimeStr[i], nextTimeStr[i]));
        setInterval(() => {
            clearInterval(this.tid);
            now = new Date();
            nowTimeStr = this.getTimeFromDate(new Date(now.getTime() - 1000));
            nextTimeStr = this.getTimeFromDate(now);
            for (let i = 0; i < flippers.length; i++) {
                if (nowTimeStr[i] === nextTimeStr[i]) {
                    continue;
                }
                flippers[i].flipDown(nowTimeStr[i], nextTimeStr[i]);
            }
        }, 1000);
    }
    destroyed () {
        clearInterval(this.tid);
    }
}
</script>
