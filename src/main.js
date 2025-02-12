import { createApp } from 'vue';
import { createRouter, createMemoryHistory } from 'vue-router';
import vClickOutside from "click-outside-vue3";
import "./style.css";

import App from './components/App.vue';

const router = createRouter({
    history: createMemoryHistory(),
    routes: [
        {
            name: "main",
            path: '/',
            component: () => import("./components/pages/MainPage.vue"),
        },
        {
            name: "connect",
            path: '/connect',
            component: () => import("./components/pages/ConnectPage.vue"),
        },
    ],
});

createApp(App)
    .use(router)
    .use(vClickOutside)
    .mount('#app');
