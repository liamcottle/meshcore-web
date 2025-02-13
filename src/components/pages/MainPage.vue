<template>
    <Page>

        <!-- header -->
        <Header/>

        <!-- tab content -->
        <div v-if="contacts.length > 0" class="flex h-full w-full overflow-hidden">
            <ContactsList :contacts="contacts" @contact-click="onContactClick"/>
        </div>

        <!-- not connected and no content -->
        <div v-if="!GlobalState.connection && contacts.length === 0" class="mx-auto my-auto">
            <ConnectButtons/>
        </div>

    </Page>
</template>

<script>
import { Constants } from "@liamcottle/meshcore.js";
import Header from "../Header.vue";
import Page from "./Page.vue";
import GlobalState from "../../js/GlobalState.js";
import ConnectButtons from "../connect/ConnectButtons.vue";
import ContactsList from "../contacts/ContactsList.vue";
import Utils from "../../js/Utils.js";

export default {
    name: 'MainPage',
    components: {
        ContactsList,
        ConnectButtons,
        Page,
        Header,
    },
    methods: {
        async onContactClick(contact) {

            // handle clicking a chat contact
            if(contact.type === Constants.AdvType.Chat){
                this.$router.push({
                    name: "contact.messages",
                    params: {
                        publicKey: Utils.bytesToHex(contact.publicKey),
                    },
                });
                return;
            }

            // user clicked an unsupported contact type
            alert("Unsupported contact type");

        },
    },
    computed: {
        GlobalState() {
            return GlobalState;
        },
        contacts() {
            return GlobalState.contacts;
        },
    },
}
</script>
