import '@/style/clock.less';
import Vue, { CreateElement } from 'vue';
import App from '@/pages/clock/App.vue';
new Vue({
    render: (h: CreateElement) => h(App)
}).$mount('#app');
