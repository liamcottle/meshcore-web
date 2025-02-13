<template>
    <div class="flex cursor-pointer p-2 bg-white hover:bg-gray-50">

        <!-- icon -->
        <ContactIcon :contact="contact" class="my-auto mr-2"/>

        <!-- name and info -->
        <div class="mr-auto">
            <div>{{ contact.advName }}</div>
            <div class="text-sm text-gray-500">&lt;{{ formatBytesToHex(contact.publicKey.slice(0, 4)) }}...{{ formatBytesToHex(contact.publicKey.slice(-4)) }}&gt;</div>
            <div class="flex space-x-1 text-sm text-gray-500">

               <span class="my-auto">
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4">
                       <path d="M9 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
                       <path fill-rule="evenodd" d="M9.68 5.26a.75.75 0 0 1 1.06 0 3.875 3.875 0 0 1 0 5.48.75.75 0 1 1-1.06-1.06 2.375 2.375 0 0 0 0-3.36.75.75 0 0 1 0-1.06Zm-3.36 0a.75.75 0 0 1 0 1.06 2.375 2.375 0 0 0 0 3.36.75.75 0 1 1-1.06 1.06 3.875 3.875 0 0 1 0-5.48.75.75 0 0 1 1.06 0Z" clip-rule="evenodd" />
                       <path fill-rule="evenodd" d="M11.89 3.05a.75.75 0 0 1 1.06 0 7 7 0 0 1 0 9.9.75.75 0 1 1-1.06-1.06 5.5 5.5 0 0 0 0-7.78.75.75 0 0 1 0-1.06Zm-7.78 0a.75.75 0 0 1 0 1.06 5.5 5.5 0 0 0 0 7.78.75.75 0 1 1-1.06 1.06 7 7 0 0 1 0-9.9.75.75 0 0 1 1.06 0Z" clip-rule="evenodd" />
                   </svg>
               </span>

                <!-- last heard -->
                <span class="flex my-auto text-sm text-gray-500 space-x-1">
                    {{ formatUnixSecondsAgo(contact.lastAdvert) }}
                </span>

                <!-- hops away -->
                <span class="flex my-auto text-sm text-gray-500 space-x-1">
                    <span v-if="contact.outPathLen === -1">• No Path (Flood)</span>
                    <span v-else-if="contact.outPathLen === 0">• Direct</span>
                    <span v-else-if="contact.outPathLen === 1">• 1 Hop</span>
                    <span v-else>• {{ contact.outPathLen }} Hops</span>
                </span>

            </div>
        </div>

        <!-- unread messages count -->
        <div v-if="unreadMessagesCount > 0" class="my-auto">
            <div class="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full shadow">
                <span v-if="unreadMessagesCount >= 100">99</span>
                <span>{{ unreadMessagesCount }}</span>
            </div>
        </div>

        <!-- contact dropdown menu -->
        <div class="my-auto">
            <ContactDropDownMenu :contact="contact"/>
        </div>

    </div>
</template>

<script>
import GlobalState from "../../js/GlobalState.js";
import IconButton from "../IconButton.vue";
import TimeUtils from "../../js/TimeUtils.js";
import ContactDropDownMenu from "./ContactDropDownMenu.vue";
import Database from "../../js/Database.js";
import ContactIcon from "./ContactIcon.vue";

export default {
    name: 'ContactListItem',
    components: {
        ContactIcon,
        ContactDropDownMenu,
        IconButton,
    },
    props: {
        contact: Object,
    },
    data() {
        return {
            unreadMessagesCount: 0,
            contactMessagesSubscription: null,
            contactMessagesReadStateSubscription: null,
        };
    },
    mounted() {

        // listen for new messages so we can update read state
        this.contactMessagesSubscription = Database.Message.getAllMessages().$.subscribe(async () => {
            await this.onMessagesUpdated();
        });

        // listen for read state changes
        this.contactMessagesReadStateSubscription = Database.ContactMessagesReadState.get(this.contact.publicKey).$.subscribe(async (contactMessagesReadState) => {
            await this.onContactMessagesReadStateChange(contactMessagesReadState);
        });

    },
    unmounted() {
        this.contactMessagesSubscription?.unsubscribe();
        this.contactMessagesReadStateSubscription?.unsubscribe();
    },
    methods: {
        async onMessagesUpdated() {
            const contactMessagesReadState = await Database.ContactMessagesReadState.get(this.contact.publicKey).exec();
            await this.onContactMessagesReadStateChange(contactMessagesReadState);
        },
        async updateUnreadMessagesCount(lastReadTimestamp) {
            this.unreadMessagesCount = await Database.Message.getContactMessagesUnreadCount(this.contact.publicKey, lastReadTimestamp).exec();
        },
        async onContactMessagesReadStateChange(contactMessagesReadState) {
            const messagesLastReadTimestamp = contactMessagesReadState?.timestamp ?? 0;
            await this.updateUnreadMessagesCount(messagesLastReadTimestamp);
        },
        formatUnixSecondsAgo(unixSeconds) {
            return TimeUtils.formatUnixSecondsAgo(unixSeconds);
        },
        formatBytesToHex(uint8Array) {
            return Array.from(uint8Array).map(byte => byte.toString(16).padStart(2, '0')).join('');
        },
    },
    computed: {
        GlobalState() {
            return GlobalState;
        },
    },
}
</script>
