<template>
    <Page>

        <!-- header -->
        <Header/>

        <!-- tabs -->
        <div v-if="GlobalState.connection || (contacts.length > 0 || channels.length > 0)" class="bg-white border-b border-gray-200">
            <div class="-mb-px flex">
                <div @click="tab = 'contacts'" class="w-full border-b-2 py-3 px-1 text-center text-sm font-medium cursor-pointer" :class="[ tab === 'contacts' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700']">Contacts</div>
                <div @click="tab = 'channels'" class="w-full border-b-2 py-3 px-1 text-center text-sm font-medium cursor-pointer" :class="[ tab === 'channels' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700']">Channels</div>
            </div>
        </div>

        <!-- tab content -->
        <div v-if="GlobalState.connection || (contacts.length > 0 || channels.length > 0)" class="flex h-full w-full overflow-hidden">
            <ContactsList v-if="tab === 'contacts'" :contacts="contacts" @contact-click="onContactClick"/>
            <ChannelsList v-if="tab === 'channels'" :channels="channels" @channel-click="onChannelClick"/>
        </div>

        <!-- not connected and no content -->
        <div v-if="!GlobalState.connection && contacts.length === 0 && channels.length === 0" class="mx-auto my-auto">
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
import ChannelsList from "../channels/ChannelsList.vue";

export default {
    name: 'MainPage',
    components: {
        ChannelsList,
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
            alert("Messaging this contact type is not supported.");

        },
        async onChannelClick(channel) {
            this.$router.push({
                name: "channel.messages",
                params: {
                    channelIdx: channel.idx.toString(),
                },
            });
        },
    },
    computed: {
        GlobalState() {
            return GlobalState;
        },
        contacts() {
            return GlobalState.contacts;
        },
        channels() {
            return GlobalState.channels;
        },
        tab: {
            get(){
                return this.$route.query.tab ?? 'contacts';
            },
            set(value){
                this.$router.replace({
                    query: {
                        ...this.$route.query,
                        tab: value,
                    },
                });
            },
        },
    },
}
</script>
