<template>
    <DropDownMenu>
        <template v-slot:button>
            <IconButton v-if="contact" class="bg-transparent text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                </svg>
            </IconButton>
        </template>
        <template v-slot:items>

            <!-- contact details -->
            <div class="p-2 border-b">
                <div class="text-sm text-gray-500 font-semibold">
                    <span>{{ contact.advName }}</span>
                </div>
                <div class="text-sm text-gray-500">
                    <!-- hops away -->
                    <span class="flex my-auto text-sm text-gray-500">
                        <span v-if="contact.outPathLen === -1">No Path (Flood)</span>
                        <span v-else-if="contact.outPathLen === 0">Direct</span>
                        <span v-else-if="contact.outPathLen === 1">1 Hop</span>
                        <span v-else>• {{ contact.outPathLen }} Hops</span>
                    </span>
                </div>
            </div>

            <!-- copy public key button -->
            <DropDownMenuItem @click="copyPublicKey(contact)">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
                    <path fill-rule="evenodd" d="M15.75 1.5a6.75 6.75 0 0 0-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 0 0-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 0 0 .75-.75v-1.5h1.5A.75.75 0 0 0 9 19.5V18h1.5a.75.75 0 0 0 .53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1 0 15.75 1.5Zm0 3a.75.75 0 0 0 0 1.5A2.25 2.25 0 0 1 18 8.25a.75.75 0 0 0 1.5 0 3.75 3.75 0 0 0-3.75-3.75Z" clip-rule="evenodd" />
                </svg>
                <span>Copy Public Key</span>
            </DropDownMenuItem>

            <!-- share contact button -->
            <DropDownMenuItem @click="shareContact(contact)">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
                    <path fill-rule="evenodd" d="M5.636 4.575a.75.75 0 0 1 0 1.061 9 9 0 0 0 0 12.728.75.75 0 1 1-1.06 1.06c-4.101-4.1-4.101-10.748 0-14.849a.75.75 0 0 1 1.06 0Zm12.728 0a.75.75 0 0 1 1.06 0c4.101 4.1 4.101 10.75 0 14.85a.75.75 0 1 1-1.06-1.061 9 9 0 0 0 0-12.728.75.75 0 0 1 0-1.06ZM7.757 6.697a.75.75 0 0 1 0 1.06 6 6 0 0 0 0 8.486.75.75 0 0 1-1.06 1.06 7.5 7.5 0 0 1 0-10.606.75.75 0 0 1 1.06 0Zm8.486 0a.75.75 0 0 1 1.06 0 7.5 7.5 0 0 1 0 10.606.75.75 0 0 1-1.06-1.06 6 6 0 0 0 0-8.486.75.75 0 0 1 0-1.06ZM9.879 8.818a.75.75 0 0 1 0 1.06 3 3 0 0 0 0 4.243.75.75 0 1 1-1.061 1.061 4.5 4.5 0 0 1 0-6.364.75.75 0 0 1 1.06 0Zm4.242 0a.75.75 0 0 1 1.061 0 4.5 4.5 0 0 1 0 6.364.75.75 0 0 1-1.06-1.06 3 3 0 0 0 0-4.243.75.75 0 0 1 0-1.061ZM10.875 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clip-rule="evenodd" />
                </svg>
                <span>Share (Zero Hop Advert)</span>
            </DropDownMenuItem>

            <!-- export contact button -->
            <DropDownMenuItem @click="exportContact(contact)">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
                    <path fill-rule="evenodd" d="M15.75 4.5a3 3 0 1 1 .825 2.066l-8.421 4.679a3.002 3.002 0 0 1 0 1.51l8.421 4.679a3 3 0 1 1-.729 1.31l-8.421-4.678a3 3 0 1 1 0-4.132l8.421-4.679a3 3 0 0 1-.096-.755Z" clip-rule="evenodd" />
                </svg>
                <span>Export to Clipboard</span>
            </DropDownMenuItem>

            <!-- reset path button -->
            <DropDownMenuItem @click="onResetPath(contact)">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
                <span>Reset Path</span>
            </DropDownMenuItem>

            <!-- delete message history button -->
            <DropDownMenuItem v-if="showDeleteMessageHistoryButton" @click="onDeleteMessageHistory">
                <svg class="size-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clip-rule="evenodd" />
                </svg>
                <span class="text-red-500">Delete Message History</span>
            </DropDownMenuItem>

            <!-- delete contact button -->
            <DropDownMenuItem @click="onDeleteContact(contact)">
                <svg class="size-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clip-rule="evenodd" />
                </svg>
                <span class="text-red-500">Forget Contact</span>
            </DropDownMenuItem>

        </template>
    </DropDownMenu>
</template>

<script>
import IconButton from "../IconButton.vue";
import DropDownMenu from "../DropDownMenu.vue";
import DropDownMenuItem from "../DropDownMenuItem.vue";
import Connection from "../../js/Connection.js";
import Database from "../../js/Database.js";
import Utils from "../../js/Utils.js";

export default {
    name: 'ContactDropDownMenu',
    components: {
        DropDownMenuItem,
        DropDownMenu,
        IconButton,
    },
    props: {
        contact: Object,
        showDeleteMessageHistoryButton: Boolean,
    },
    emits: [
        "contact-deleted",
    ],
    methods: {
        copyPublicKey(contact) {
            Utils.copyToClipboard(Utils.bytesToHex(contact.publicKey));
        },
        async shareContact(contact) {
            try {
                await Connection.shareContact(contact.publicKey);
                alert("Contact has been adverted!");
            } catch(e) {
                console.log(e);
                alert("Failed to share this contact!");
            }
        },
        async exportContact(contact) {
            try {
                const exportedContact = await Connection.exportContact(contact.publicKey);
                const advertPacketAsHex = Utils.bytesToHex(exportedContact.advertPacketBytes);
                const meshCoreContactUrl = `meshcore://${advertPacketAsHex}`;
                await Utils.copyToClipboard(meshCoreContactUrl);
            } catch(e) {
                console.log(e);
                alert("Failed to export this contact!");
            }
        },
        async onResetPath(contact) {

            // confirm user wants to reset path
            if(!confirm("Are you sure you want to reset the path to this contact?")){
                return;
            }

            // reset path
            await Connection.resetContactPath(contact.publicKey);
            await Connection.loadContacts();

        },
        async onDeleteMessageHistory() {

            // confirm user wants to delete message history
            if(!confirm("Are you sure you want to delete all message history with this contact?")){
                return;
            }

            // delete message history
            await Database.Message.deleteContactMessages(this.contact.publicKey);

        },
        async onDeleteContact(contact) {

            // confirm user wants to remove this contact
            if(!confirm("Are you sure you want to forget this contact?")){
                return;
            }

            // remove contact
            await Connection.removeContact(contact.publicKey);
            await Connection.loadContacts();

        },
    },
}
</script>
