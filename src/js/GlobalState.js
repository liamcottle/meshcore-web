import {reactive} from "vue";

// global state
const globalState = reactive({
    connection: null,
    isDatabaseReady: false,
    selfInfo: null,
    batteryPercentage: null,
    batteryPercentageInterval: null,
    contacts: [],
    channels: [
        {
            idx: 0,
            name: "Public Channel",
            description: "This is the default public channel.",
        },
    ],
});

export default globalState;
