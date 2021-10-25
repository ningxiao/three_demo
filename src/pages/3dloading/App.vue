<template>
    <div class="loading">Loading</div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component({
    components: {},
})
export default class App extends Vue {
    constructor() {
        super();
    }
    mounted() {
        const loading = document.querySelector(".loading");
        const letters = loading.textContent.split("");
        loading.textContent = "";
        letters.forEach((letter, i) => {
            const span = document.createElement("span");
            span.textContent = letter;
            span.style.animationDelay = `${i / 10}s`;
            loading.append(span);
        });
    }
}
</script>
