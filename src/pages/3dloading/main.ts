import '@/style/3dloading.less';
import Vue, { CreateElement } from 'vue';
import App from '@/pages/3dloading/App.vue';
new Vue({
    render: (h: CreateElement) => h(App)
}).$mount('#app');
