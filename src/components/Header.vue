<template>
    <div class="flex bg-white p-2 border-b h-16">
        <div class="my-auto mr-auto overflow-hidden">
            <div class="font-bold">MeshCore</div>
            <div class="text-sm truncate">

                <!-- connected or configured -->
                <span v-if="GlobalState.connection != null">
                    <span v-if="GlobalState.selfInfo">{{ GlobalState.selfInfo.name }}</span>
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

            <!-- disconnect button -->
            <div v-else class="space-x-1">
                <button @click="sendFloodAdvert" type="button" class="bg-gray-500 text-white px-2 py-1 p-1 rounded shadow hover:bg-gray-400">
                    Advert
                </button>
                <button @click="disconnect" type="button" class="bg-gray-500 text-white px-2 py-1 p-1 rounded shadow hover:bg-gray-400">
                    Disconnect
                </button>
            </div>

        </div>
    </div>
</template>

<script>
import GlobalState from "../js/GlobalState.js";
import Connection from "../js/Connection.js";

export default {
    name: 'Header',
    methods: {
        async sendFloodAdvert() {
            await GlobalState.connection.sendFloodAdvert();
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
