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
import Header from "../Header.vue";
import Page from "./Page.vue";
import GlobalState from "../../js/GlobalState.js";
import ConnectButtons from "../connect/ConnectButtons.vue";
import ContactsList from "../contacts/ContactsList.vue";
import Connection from "../../js/Connection.js";

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

            // ask user for message
            const message = prompt("Enter message to send");
            if(!message){
                return;
            }

            // send message
            await Connection.sendMessage(contact.publicKey, message);

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
