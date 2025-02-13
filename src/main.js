import { createApp } from 'vue';
import { createRouter, createMemoryHistory } from 'vue-router';
import vClickOutside from "click-outside-vue3";
import "./style.css";

import App from './components/App.vue';

const routes = [
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
    {
        name: "contact.messages",
        path: '/contacts/:publicKey/messages',
        props: true,
        component: () => import("./components/pages/ContactMessagesPage.vue"),
    },
    {
        name: "settings.radio",
        path: '/settings/radio',
        component: () => import("./components/pages/RadioSettingsPage.vue"),
    },
];

const router = createRouter({
    history: createMemoryHistory(),
    routes: routes,
});

// preload all route components, so they are available even if the server deploys a new version before the user navigates to a page
for(const route of routes){
    if(typeof route.component === 'function'){
        route.component();
    }
}

createApp(App)
    .use(router)
    .use(vClickOutside)
    .mount('#app');
