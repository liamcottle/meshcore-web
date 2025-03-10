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
                    <div v-if="deviceInfo" class="text-sm text-gray-500">
                        <span>Firmware Build Date: {{ deviceInfo.firmware_build_date }}</span>
                    </div>
                </div>

                <!-- setting groups -->
                <div class="space-y-4">

                    <!-- public info -->
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

                    <!-- radio settings -->
                    <div class="bg-white divide-y">

                        <div class="bg-white p-2 font-semibold">Radio Settings</div>

                        <div class="w-full p-2">
                            <div class="block mb-2 text-sm font-medium text-gray-900">Frequency (MHz)</div>
                            <input v-model="radioFreq" type="number" placeholder="e.g: 917.375" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                        </div>

                        <div class="w-full p-2">
                            <div class="block mb-2 text-sm font-medium text-gray-900">Bandwidth</div>
                            <select v-model="radioBw" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                                <option :value="7800">7.8 kHz</option>
                                <option :value="10400">10.4 kHz</option>
                                <option :value="15600">15.6 kHz</option>
                                <option :value="20800">20.8 kHz</option>
                                <option :value="31250">31.25 kHz</option>
                                <option :value="41700">41.7 kHz</option>
                                <option :value="62500">62.5 kHz</option>
                                <option :value="125000">125 kHz</option>
                                <option :value="250000">250 kHz</option>
                                <option :value="500000">500 kHz</option>
                            </select>
                        </div>

                        <div class="w-full p-2">
                            <div class="block mb-2 text-sm font-medium text-gray-900">Spreading Factor</div>
                            <select v-model="radioSf" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                                <option :value="7">7</option>
                                <option :value="8">8</option>
                                <option :value="9">9</option>
                                <option :value="10">10</option>
                                <option :value="11">11</option>
                                <option :value="12">12</option>
                            </select>
                        </div>

                        <div class="w-full p-2">
                            <div class="block mb-2 text-sm font-medium text-gray-900">Coding Rate</div>
                            <select v-model="radioCr" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                                <option :value="5">5</option>
                                <option :value="6">6</option>
                                <option :value="7">7</option>
                                <option :value="8">8</option>
                            </select>
                        </div>

                        <div class="w-full p-2">
                            <div class="block mb-2 text-sm font-medium text-gray-900">Transmit Power (dBm)</div>
                            <input v-model="txPower" type="number" placeholder="e.g: 22" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                        </div>

                    </div>

                    <!-- commands -->
                    <div class="flex flex-col divide-y bg-white">

                        <div class="bg-white p-2 font-semibold">Commands</div>

                        <RouterLink :to="{ name: 'rxlog' }">
                            <div class="flex cursor-pointer px-2 py-3 bg-white hover:bg-gray-50">

                                <!-- leading -->
                                <div class="my-auto ml-2 mr-4 text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                    </svg>
                                </div>

                                <!-- title -->
                                <div class="my-auto mr-auto">RX Log</div>

                                <!-- trailing -->
                                <div class="my-auto mr-2 text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                    </svg>
                                </div>

                            </div>
                        </RouterLink>

                        <div @click="reboot" class="flex cursor-pointer px-2 py-3 bg-white hover:bg-gray-50">

                            <!-- leading -->
                            <div class="my-auto ml-2 mr-4 text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9" />
                                </svg>
                            </div>

                            <!-- title -->
                            <div class="my-auto mr-auto">Reboot</div>

                            <!-- trailing -->
                            <div class="my-auto mr-2 text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                            </div>

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
            deviceInfo: null,
        };
    },
    mounted() {
        this.load();
    },
    methods: {
        async load() {

            await Connection.loadSelfInfo();
            await this.loadDeviceInfo();

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
        async loadDeviceInfo() {
            try {
                this.deviceInfo = await Connection.deviceQuery();
            } catch(e) {
                console.log(e);
            }
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

            } catch(e) {
                console.log(e);
                alert("Failed to save settings!");
            } finally {

                // show loading
                this.isSaving = false;

            }

        },
        async reboot() {

            // ask user to confirm action
            if(!confirm("Are you sure you want to reboot this device?")){
                return;
            }

            // tell radio to reboot
            try {
                await Connection.reboot();
            } catch(e) {
                alert("Failed to reboot device!");
                console.log(e);
                return;
            }

            // tell user device is rebooting
            alert("Device is rebooting. You will need to reconnect!");

            // go back to main page
            this.$router.push({
                name: "main",
            });

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
