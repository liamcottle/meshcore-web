import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import vClickOutside from "click-outside-vue3";
import "./style.css";

import App from './components/App.vue';
import GlobalState from "./js/GlobalState.js";

// helper function that force redirects to the main page if there is no device connection
function handleRouteThatRequiresDeviceConnection() {
    if(!GlobalState.connection){
        return {
            name: 'main',
        };
    }
}

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
        beforeEnter: handleRouteThatRequiresDeviceConnection,
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes,
});

// preload all route components, so they are available even if the server deploys a new version before the user navigates to a page
for(const route of routes){
    if(typeof route.component === 'function'){
        route.component();
    }
}

// listen for postMessage events from service worker
navigator.serviceWorker.addEventListener("message", async (event) => {
    if(event.data.type === "notificationclick"){

        // get notification data
        const notificationData = event.data.data;

        // if notification data includes vue-route-push, push the route to vue
        const vueRoutePush = notificationData["vue-route-push"];
        if(vueRoutePush){
            await router.push(vueRoutePush);
        }

    }
});

createApp(App)
    .use(router)
    .use(vClickOutside)
    .mount('#app');
