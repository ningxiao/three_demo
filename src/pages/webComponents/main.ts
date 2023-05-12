import '@ss/mtd-vue/lib/theme2/index.css';
import Vue, { CreateElement } from 'vue';
import App from '@/pages/webComponents/App.vue';
new Vue(
    {
        render: (h: CreateElement) => h(App)
    }
).$mount('#app');
