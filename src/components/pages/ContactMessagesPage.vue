<template>
    <Page>

        <!-- app bar -->
        <AppBar title="Direct Messages" :subtitle="subtitle"/>

        <!-- list -->
        <div class="flex h-full w-full overflow-hidden">
            <MessageViewer v-if="contact != null" :contact="contact"/>
        </div>

    </Page>
</template>

<script>
import Page from "./Page.vue";
import AppBar from "../AppBar.vue";
import MessageViewer from "../messages/MessageViewer.vue";
import GlobalState from "../../js/GlobalState.js";
import Utils from "../../js/Utils.js";

export default {
    name: 'ContactMessagesPage',
    components: {MessageViewer, AppBar, Page},
    props: {
        publicKey: String,
    },
    mounted() {

        // redirect to main page if contact not found
        if(!this.contact){
            this.$router.push({
                name: "main",
            });
            return;
        }

    },
    computed: {
        GlobalState() {
            return GlobalState;
        },
        contact() {
            return GlobalState.contacts.find((contact) => Utils.bytesToHex(contact.publicKey) === this.publicKey);
        },
        subtitle() {
            return this.contact ? this.contact.advName : "Unknown Contact";
        },
    },
}
</script>
