<template>
    <div class="flex bg-white p-2 border-b h-16">
        <div class="flex-shrink-0 my-auto mr-2">
            <img src="/icon.png" class="size-12 rounded"/>
        </div>
        <div class="my-auto mr-auto overflow-hidden">
            <div class="font-bold">MeshCore Client</div>
            <div class="text-sm truncate">

                <!-- connected or configured -->
                <span v-if="GlobalState.connection != null">
                    <span v-if="GlobalState.selfInfo">
                        <span v-if="GlobalState.batteryPercentage">Battery {{ GlobalState.batteryPercentage }}% - </span>
                        <span>{{ GlobalState.selfInfo.name }}</span>
                    </span>
                    <span v-else>Connecting...</span>
                </span>

                <!-- disconnected -->
                <span v-else>
                    Built by <a href="https://liamcottle.com" target="_blank" class="text-blue-600 hover:underline">Liam Cottle</a>
                </span>

            </div>
        </div>
        <div class="my-auto flex font-semibold">

            <!-- connect button -->
            <RouterLink v-if="GlobalState.connection == null" :to="{ name: 'connect' }">
                <div class="bg-blue-500 text-white px-2 py-1 rounded shadow hover:bg-blue-400">
                    Connect
                </div>
            </RouterLink>

            <!-- action buttons -->
            <div v-else class="flex space-x-1">
                <DropDownMenu>
                    <template v-slot:button>
                        <button type="button" class="my-auto bg-gray-500 text-white px-2 py-1 p-1 rounded shadow hover:bg-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9.348 14.652a3.75 3.75 0 0 1 0-5.304m5.304 0a3.75 3.75 0 0 1 0 5.304m-7.425 2.121a6.75 6.75 0 0 1 0-9.546m9.546 0a6.75 6.75 0 0 1 0 9.546M5.106 18.894c-3.808-3.807-3.808-9.98 0-13.788m13.788 0c3.808 3.807 3.808 9.98 0 13.788M12 12h.008v.008H12V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                        </button>
                    </template>
                    <template v-slot:items>
                        <DropDownMenuItem @click="sendZeroHopAdvert">Advert (Zero Hop)</DropDownMenuItem>
                        <DropDownMenuItem @click="sendFloodAdvert">Advert (Flood Routed)</DropDownMenuItem>
                    </template>
                </DropDownMenu>
                <RouterLink :to="{ name: 'settings' }">
                    <button type="button" class="my-auto bg-gray-500 text-white px-2 py-1 p-1 rounded shadow hover:bg-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                            <path fill-rule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clip-rule="evenodd" />
                        </svg>
                    </button>
                </RouterLink>
                <button @click="disconnect" type="button" class="my-auto bg-gray-500 text-white px-2 py-1 p-1 rounded shadow hover:bg-gray-400">
                    <span class="block sm:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                        <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                    </svg>
                    </span>
                    <span class="hidden sm:block">Disconnect</span>
                </button>
            </div>

        </div>
    </div>
</template>

<script>
import GlobalState from "../js/GlobalState.js";
import Connection from "../js/Connection.js";
import IconButton from "./IconButton.vue";
import DropDownMenu from "./DropDownMenu.vue";
import DropDownMenuItem from "./DropDownMenuItem.vue";

export default {
    name: 'Header',
    components: {DropDownMenuItem, DropDownMenu, IconButton},
    methods: {
        async sendZeroHopAdvert() {
            await GlobalState.connection.sendZeroHopAdvert();
            alert("A zero hop advert has been sent.");
        },
        async sendFloodAdvert() {
            await GlobalState.connection.sendFloodAdvert();
            alert("A flood routed advert has been sent.");
        },
        async disconnect() {
            await Connection.disconnect();
        },
    },
    computed: {
        GlobalState() {
            return GlobalState;
        },
    },
}
</script>
