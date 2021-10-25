<template>
    <div>
        <mtd-menu
            v-model="activeName"
            mode="horizontal"
        >
            <mtd-menu-item
                name="sun"
                route="/"
            >
                燃烧太阳
                <mtd-icon
                    name="home-o"
                    slot="icon"
                />
            </mtd-menu-item>
            <mtd-menu-item
                name="particle"
                route="/particle"
            >
                图片粒子
                <mtd-icon
                    name="menus-o"
                    slot="icon"
                />
            </mtd-menu-item>
            <mtd-menu-item
                name="marchingball"
                route="/marchingball"
            >
                液态光球
                <mtd-icon
                    name="database-o"
                    slot="icon"
                />
            </mtd-menu-item>
        </mtd-menu>
        <router-view />
    </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Menu from '@ss/mtd-vue/lib/menu';
import Icon from '@ss/mtd-vue/lib/icon';
import MenuItem from '@ss/mtd-vue/lib/menu-item';
@Component({
    components: {
        [Icon.name]:Icon,
        [Menu.name]: Menu,
        [MenuItem.name]: MenuItem
    },
})
export default class App extends Vue {
    activeName = 'sun';
    constructor() {
        super();
    }
}
</script>
