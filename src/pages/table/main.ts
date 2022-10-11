import '@/style/table.less';
import Vue, { CreateElement } from 'vue';
import App from '@/pages/table/App.vue';
new Vue({
    render: (h: CreateElement) => h(App)
}).$mount('#app');
