import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router/routers.js';


const app = createApp(App);
const pinia = createPinia();

app.use(router)
    .use(pinia)

app.mount('#app');
