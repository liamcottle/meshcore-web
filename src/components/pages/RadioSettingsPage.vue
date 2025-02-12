<template>
    <Page>

        <!-- app bar -->
        <AppBar title="Radio Settings" :subtitle="GlobalState.selfInfo?.name">
            <template v-slot:trailing>
                <SaveButton @click="save"/>
            </template>
        </AppBar>

        <!-- loaded -->
        <div class="flex h-full w-full overflow-hidden">

            <div class="w-full overflow-y-auto">

                <div class="bg-white divide-y">

                    <div class="w-full p-2">
                        <div class="block mb-2 text-sm font-medium text-gray-900">Frequency (kHz)</div>
                        <input v-model="radioFreq" type="number" placeholder="e.g: 917375" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
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

    </Page>
</template>

<script>
import Connection from "../../js/Connection.js";
import GlobalState from "../../js/GlobalState.js";
import AppBar from "../AppBar.vue";
import SaveButton from "../SaveButton.vue";
import Page from "./Page.vue";

export default {
    name: 'RadioSettingsPage',
    components: {Page, SaveButton, AppBar},
    data() {
        return {
            radioFreq: null,
            radioBw: null,
            radioSf: null,
            radioCr: null,
            txPower: null,
        };
    },
    mounted() {
        this.load();
    },
    methods: {
        async load() {
            await Connection.loadSelfInfo();
            this.radioFreq = GlobalState.selfInfo?.radioFreq;
            this.radioBw = GlobalState.selfInfo?.radioBw;
            this.radioSf = GlobalState.selfInfo?.radioSf;
            this.radioCr = GlobalState.selfInfo?.radioCr;
            this.txPower = GlobalState.selfInfo?.txPower;
        },
        async save() {
            try {

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

                // save settings
                await Connection.setRadioParams(this.radioFreq, this.radioBw, this.radioSf, this.radioCr, this.txPower);

                // show success alert
                alert("Settings saved.");

            } catch(e) {
                console.log(e);
                // DialogUtils.showErrorAlert(e);
            }
        },
    },
    computed: {
        GlobalState() {
            return GlobalState;
        },
    },
}
</script>
