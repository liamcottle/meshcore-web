import {reactive} from "vue";

// global state
const globalState = reactive({
    connection: null,
    database: null,
    selfInfo: null,
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
