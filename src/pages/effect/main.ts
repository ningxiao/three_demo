import '@ss/mtd-vue/lib/theme2/index.css';
import '@/style/base/aqua.less';
import Vue, { CreateElement } from 'vue';
import App from '@/pages/effect/App.vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
const router = new VueRouter({
    mode: 'hash',
    base: '/',
    routes: [
        {
            name: 'sun',
            path: '/',
            component: () => import('./views/Sun.vue'),
        },{
            name: 'particle',
            path: '/particle',
            component: () => import('./views/ParticleExplode.vue'),
        },{
            name: 'marchingball',
            path: '/marchingball',
            component: () => import('./views/MarchingBall.vue'),
        }
    ],
});
new Vue({
    router,
    render: (h: CreateElement) => h(App)
}).$mount('#app');
