import {reactive} from "vue";

// global state
const globalState = reactive({
    connection: null,
    selfInfo: null,
    contacts: [],
});

export default globalState;
