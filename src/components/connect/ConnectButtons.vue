<template>
    <div class="space-y-2">

        <!-- info -->
        <div class="flex flex-col mx-auto my-auto text-gray-700 text-center">
            <div class="mb-2 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" class="w-10">
                    <rect width="256" height="256" fill="none"/>
                    <circle cx="136" cy="64" r="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/>
                    <line x1="8" y1="128" x2="200" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/>
                    <polygon points="200 96 200 160 248 128 200 96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/>
                    <rect x="112" y="168" width="48" height="48" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/>
                    <path d="M112,64H72a8,8,0,0,0-8,8V184a8,8,0,0,0,8,8h40" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/>
                </svg>
            </div>
            <div class="font-semibold">Not Connected</div>
            <div>Connect a MeshCore device to continue</div>
        </div>

        <!-- bluetooth -->
        <button @click="connectViaBluetooth" type="button" class="w-full flex cursor-pointer bg-white rounded shadow px-3 py-2 text-black space-x-2 font-semibold hover:bg-gray-100">
            <span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" class="w-6">
                    <rect width="256" height="256" fill="none"/>
                    <polygon points="128 32 192 80 128 128 128 32" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/>
                    <polygon points="128 128 192 176 128 224 128 128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/>
                    <line x1="64" y1="80" x2="128" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/>
                    <line x1="64" y1="176" x2="128" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/>
                </svg>
            </span>
            <span>Connect via Bluetooth</span>
        </button>

        <!-- serial -->
        <button @click="connectViaSerial" type="button" class="w-full flex cursor-pointer bg-white rounded shadow px-3 py-2 text-black space-x-2 font-semibold hover:bg-gray-100">
            <span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" class="w-6">
                    <rect width="256" height="256" fill="none"/>
                    <circle cx="136" cy="64" r="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/>
                    <line x1="8" y1="128" x2="200" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/>
                    <polygon points="200 96 200 160 248 128 200 96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/>
                    <rect x="112" y="168" width="48" height="48" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/>
                    <path d="M112,64H72a8,8,0,0,0-8,8V184a8,8,0,0,0,8,8h40" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/>
                </svg>
            </span>
            <span>Connect via Serial</span>
        </button>

    </div>
</template>

<script>
import Connection from "../../js/Connection.js";

export default {
    name: 'ConnectButtons',
    methods: {
        async connectViaBluetooth() {
            await Connection.connectViaBluetooth();
            this.$router.push({
                name: "main",
            });
        },
        async connectViaSerial() {
            await Connection.connectViaSerial();
            this.$router.push({
                name: "main",
            });
        },
    },
}
</script>
