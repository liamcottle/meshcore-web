<template>
    <Page>

        <!-- app bar -->
        <AppBar title="Settings">
            <template v-slot:trailing>
                <SaveButton @click="save" :is-saving="isSaving"/>
            </template>
        </AppBar>

        <div class="flex h-full w-full overflow-hidden">
            <div class="w-full overflow-y-auto">

                <!-- node details -->
                <div class="flex flex-col items-center p-4 leading-tight">
                    <div class="mb-2">
                        <div class="flex rounded-full h-20 w-20 text-white text-xl shadow bg-[#607e8c]">
                            <div class="mx-auto my-auto drop-shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-8">
                                    <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clip-rule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="font-semibold">{{ GlobalState.selfInfo?.name }}</div>
                    <div v-if="GlobalState.selfInfo?.publicKey" class="text-sm text-gray-500">
                        &lt;{{ bytesToHex(GlobalState.selfInfo.publicKey.slice(0, 4)) }}...{{ bytesToHex(GlobalState.selfInfo.publicKey.slice(-4)) }}&gt;
                    </div>
                </div>

                <!-- setting groups -->
                <div class="space-y-4">

                    <div class="bg-white divide-y">

                        <div class="bg-white p-2 font-semibold">Public Info</div>

                        <div class="w-full p-2">
                            <div class="block mb-2 text-sm font-medium text-gray-900">Name</div>
                            <input v-model="name" type="text" placeholder="e.g: Anonymous" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                        </div>

                        <div class="w-full p-2">
                            <div class="block mb-2 text-sm font-medium text-gray-900">Latitude</div>
                            <input v-model="latitude" type="number" placeholder="e.g: -38.664646" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                        </div>

                        <div class="w-full p-2">
                            <div class="block mb-2 text-sm font-medium text-gray-900">Longitude</div>
                            <input v-model="longitude" type="number" placeholder="e.g: 178.023507" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                        </div>

                    </div>

                    <div class="bg-white divide-y">

                        <div class="bg-white p-2 font-semibold">Radio Settings</div>

                        <div class="w-full p-2">
                            <div class="block mb-2 text-sm font-medium text-gray-900">Frequency (MHz)</div>
                            <input v-model="radioFreq" type="number" placeholder="e.g: 917.375" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                        </div>

                        <div class="w-full p-2">
                            <div class="block mb-2 text-sm font-medium text-gray-900">Bandwidth (kHz)</div>
                            <input v-model="radioBw" type="number" placeholder="e.g: 250000" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                        </div>

                        <div class="w-full p-2">
                            <div class="block mb-2 text-sm font-medium text-gray-900">Spreading Factor</div>
                            <input v-model="radioSf" type="number" placeholder="e.g: 7" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                        </div>

                        <div class="w-full p-2">
                            <div class="block mb-2 text-sm font-medium text-gray-900">Coding Rate</div>
                            <input v-model="radioCr" type="number" placeholder="e.g: 5" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                        </div>

                        <div class="w-full p-2">
                            <div class="block mb-2 text-sm font-medium text-gray-900">Transmit Power (dBm)</div>
                            <input v-model="txPower" type="number" placeholder="e.g: 22" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                        </div>

                    </div>

                </div>

            </div>
        </div>

    </Page>
</template>

<script>
import Connection from "../../js/Connection.js";
import GlobalState from "../../js/GlobalState.js";
import AppBar from "../AppBar.vue";
import SaveButton from "../SaveButton.vue";
import Page from "./Page.vue";
import Utils from "../../js/Utils.js";

export default {
    name: 'SettingsPage',
    components: {Page, SaveButton, AppBar},
    data() {
        return {
            isSaving: false,
            name: null,
            radioFreq: null,
            radioBw: null,
            radioSf: null,
            radioCr: null,
            txPower: null,
            latitude: null,
            longitude: null,
        };
    },
    mounted() {
        this.load();
    },
    methods: {
        async load() {

            await Connection.loadSelfInfo();

            this.name = GlobalState.selfInfo.name;

            // convert radio frequency from kHz to MHz
            // e.g: 917375 -> 917.375
            this.radioFreq = GlobalState.selfInfo.radioFreq / 1000;

            this.radioBw = GlobalState.selfInfo.radioBw;
            this.radioSf = GlobalState.selfInfo.radioSf;
            this.radioCr = GlobalState.selfInfo.radioCr;
            this.txPower = GlobalState.selfInfo.txPower;

            // convert latitude and longitude from integer to decimal
            // e.g: -38664646, 178023507 -> -38.664646, 178.023507
            this.latitude = GlobalState.selfInfo.advLat / 1000000;
            this.longitude = GlobalState.selfInfo.advLon / 1000000;

        },
        async save() {

            // show loading
            this.isSaving = true;

            try {

                // ensure name provided
                if(!this.name || this.name.length === 0){
                    alert("Name is required!");
                    return;
                }

                // ensure frequency provided
                if(!this.radioFreq){
                    alert("Frequency is required!");
                    return;
                }

                // ensure bandwidth provided
                if(!this.radioBw){
                    alert("Bandwidth is required!");
                    return;
                }

                // ensure spreading factor provided
                if(!this.radioSf){
                    alert("Spreading Factor is required!");
                    return;
                }

                // ensure coding rate provided
                if(!this.radioCr){
                    alert("Coding Rate is required!");
                    return;
                }

                // ensure transmit power provided
                if(!this.txPower){
                    alert("Transmit Power is required!");
                    return;
                }

                // if user didn't provide latitude, set to zero
                if(this.latitude == null){
                    this.latitude = 0;
                }

                // if user didn't provide longitude, set to zero
                if(this.longitude == null){
                    this.longitude = 0;
                }

                // convert radio frequency from MHz to kHz
                // e.g: 917.375 -> 917375
                const radioFreq = this.radioFreq * 1000;

                // convert latitude and longitude from decimal to integer
                // e.g: -38.664646, 178.023507 -> -38664646, 178023507
                const latitude = Math.floor(this.latitude * 1000000);
                const longitude = Math.floor(this.longitude * 1000000);

                // save settings
                await Connection.setAdvertName(this.name);
                await Connection.setAdvertLatLong(latitude, longitude);
                await Connection.setRadioParams(radioFreq, this.radioBw, this.radioSf, this.radioCr);
                await Connection.setTxPower(this.txPower);

                // reload self info
                await Connection.loadSelfInfo();

                // show success alert
                alert("Settings saved.");

                // go back to main page
                this.$router.push({
                    name: "main",
                });

            } catch(e) {
                console.log(e);
                alert("Failed to save settings!");
            }

            // show loading
            this.isSaving = false;

        },
        bytesToHex(uint8Array) {
            return Utils.bytesToHex(uint8Array);
        },
    },
    computed: {
        GlobalState() {
            return GlobalState;
        },
    },
}
</script>
