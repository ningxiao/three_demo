import '@ss/mtd-vue/lib/theme2/index.css';
import Vue, { CreateElement } from 'vue';
import App from '@/App.vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
new Vue({
    router: new VueRouter({
        mode: 'hash',
        base: '/',
        routes: [],
    }),
    render: (h: CreateElement) => h(App)
}).$mount('#app');
