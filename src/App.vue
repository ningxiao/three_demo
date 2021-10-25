<template>
    <div class="demo-sidebar-container">
        <div class="demo-sidebar-aside">
            <mtd-sidebar
                :data="data"
                title="数据可视化"
                :expand-keys="expandKeys"
                :active-key="activeKey"
                @menu-item-click="handleItemClick"
            />
        </div>
        <div class="demo-sidebar-main">
            <iframe
                ref="box"
                class="box"
                src="./astar.html"
            ></iframe>
        </div>
    </div>
</template>
<script lang="ts">
import { menus } from '@/constants';
import Sidebar from '@ss/mtd-vue/lib/sidebar';
import { Component, Vue } from 'vue-property-decorator';
@Component({
    components: {
        [Sidebar.name]:Sidebar
    },
})
export default class App extends Vue {
    data = menus;
    activeKey = 'astar';
    expandKeys = ['1', '1-1'];
    private box: HTMLIFrameElement;
    showExpand(key: string, isExpand = true) {
        this.data.forEach(item => {
            if (Reflect.has(item, 'children')) {
                const { children } = item;
                for (let i = 0; i < children.length; i++) {
                    if (children[i].route === key) {
                        this.activeKey = children[i].id;
                        if (isExpand) {
                            this.expandKeys = [item.id, children[i].route];
                        }
                        break;
                    }
                }
            }
        });
    }
    handleItemClick({ item }) {
        this.box.src = `./${item.route}.html`;
        this.showExpand(item.route, false);
    }
    created() {
        const hash = location.hash;
        if (hash !== '#/') {
            this.activeKey = hash.replace('#/', '');
        }
        this.showExpand(this.activeKey);
        console.log(this.expandKeys, this.activeKey);
    }
    mounted() {
        this.box = this.$refs.box as HTMLIFrameElement;
        this.box.src = `./${this.expandKeys[1]}.html`;
    }

}
</script>
<style lang='less' scoped>
.box {
    border: none;
    width: 100%;
    height: 100%;
    overflow: auto;
}
.demo-sidebar-container {
    display: flex;
    height: 100vh;
}
.demo-sidebar-aside {
    flex: 0 0 auto;
    position: relative;
    z-index: 1;
}
.demo-sidebar-main {
    min-width: 0;
    flex: 1 1 auto;
    background-color: #f7f8fc;
}
</style>
