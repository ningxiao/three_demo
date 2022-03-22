import '@/style/nexus.less';
import Vue, { CreateElement } from 'vue';
import App from '@/pages/nexus/App.vue';
new Vue({
    render: (h: CreateElement) => h(App)
}).$mount('#app');
