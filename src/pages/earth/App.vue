<template>
    <div class="scenes">
        <starry-sky />
        <div class="total">
            <span>{{poiCount[0]}}</span><span>{{poiCount[1]}}</span>,<span>{{poiCount[2]}}</span><span>{{poiCount[3]}}</span><span>{{poiCount[4]}}</span>,<span>{{poiCount[5]}}</span><span>{{poiCount[6]}}</span><span>{{poiCount[7]}}</span>
        </div>
        <div class="earth">
            <div class="inner"></div>
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import StarrySky from '@/pages/earth/components/StarrySky.vue';
@Component({
    components: {
        StarrySky
    },
})
export default class App extends Vue {
    private poiCount: string[] = ['1', '3', '1', '6', '1', '8', '3', '9'];
    constructor() {
        super();
    }
}
</script>
