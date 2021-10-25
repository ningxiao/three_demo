import '@/style/earth.less';
import Vue, { CreateElement } from 'vue';
import App from '@/pages/earth/App.vue';
new Vue({
    render: (h: CreateElement) => h(App)
}).$mount('#app');
