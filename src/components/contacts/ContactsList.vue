<template>
    <div class="flex flex-col h-full w-full overflow-hidden">

        <!-- search -->
        <div v-if="contacts.length > 0" class="flex bg-white border-b border-gray-300 divide-x">
            <div class="flex p-1 w-full">
                <input v-model="contactsSearchTerm" type="text" :placeholder="`Search ${contacts.length} Contacts...`" class="h-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
            </div>
            <div class="flex text-gray-500">
                <DropDownMenu class="mx-auto my-auto">
                    <template v-slot:button>
                        <IconButton class="mx-1">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                                <path d="M18.75 12.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM12 6a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 6ZM12 18a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 18ZM3.75 6.75h1.5a.75.75 0 1 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM5.25 18.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 0 1.5ZM3 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 3 12ZM9 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM12.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM9 15.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
                            </svg>
                        </IconButton>
                    </template>
                    <template v-slot:items>
                        <div class="p-2 border-b text-sm font-bold">Order</div>
                        <DropDownMenuItem @click="order = 'a-z'">
                            <input type="radio" :checked="order === 'a-z'"/>
                            <div class="my-auto" :class="{ 'font-bold': order === 'a-z' }">A-Z</div>
                        </DropDownMenuItem>
                        <DropDownMenuItem @click="order = 'heard-recently'">
                            <input type="radio" :checked="order === 'heard-recently'"/>
                            <div class="my-auto" :class="[ order === 'heard-recently' ? 'font-bold' : '' ]">Heard Recently</div>
                        </DropDownMenuItem>
                        <div class="p-2 border-b text-sm font-bold">Filter</div>
                        <DropDownMenuItem @click="filter = 'all'">
                            <input type="radio" :checked="filter === 'all'"/>
                            <div class="my-auto" :class="[ filter === 'all' ? 'font-bold' : '' ]">All</div>
                        </DropDownMenuItem>
                    </template>
                </DropDownMenu>
            </div>
        </div>

        <!-- contacts -->
        <div class="h-full overflow-y-auto">
            <ContactListItem :key="contact.publicKey" v-for="contact of searchedContacts" :contact="contact" @click="onContactClick(contact)"/>
        </div>

    </div>
</template>

<script>
import GlobalState from "../../js/GlobalState.js";
import IconButton from "../IconButton.vue";
import DropDownMenu from "../DropDownMenu.vue";
import DropDownMenuItem from "../DropDownMenuItem.vue";
import ContactListItem from "./ContactListItem.vue";

export default {
    name: 'ContactsList',
    components: {
        ContactListItem,
        DropDownMenuItem,
        DropDownMenu,
        IconButton,
    },
    emits: [
        "contact-click",
    ],
    props: {
        contacts: Array,
    },
    data() {
        return {
            filter: window.localStorage.getItem("contacts_list_filter") ?? "all",
            order: window.localStorage.getItem("contacts_list_order") ?? "heard-recently",
            contactsSearchTerm: "",
        };
    },
    methods: {
        onContactClick(contact) {
            this.$emit("contact-click", contact);
        },
        getContactsOrderedByName(contacts) {
            // sort contacts by name asc (using a shallow copy to ensure it updates automatically)
            return contacts.sort((contactA, contactB) => {
                const contactAName = contactA.advName;
                const contactBName = contactB.advName;
                return contactAName.localeCompare(contactBName);
            });
        },
        getContactsOrderedByRecentlyHeard(contacts) {
            // sort contacts by latest advert desc (using a shallow copy to ensure it updates automatically)
            return contacts.sort((contactA, contactB) => {
                const contactALastHeard = contactA.lastAdvert;
                const contactBLastHeard = contactB.lastAdvert;
                return contactBLastHeard - contactALastHeard;
            });
        },
        getOrderedContacts(contacts) {

            // get ordered contacts
            var orderedContacts = [];
            switch(this.order){
                case "a-z": {
                    orderedContacts = this.getContactsOrderedByName(contacts);
                    break;
                }
                case "heard-recently": {
                    orderedContacts = this.getContactsOrderedByRecentlyHeard(contacts);
                    break;
                }
            }

            return orderedContacts;

        },
        getFilteredContacts(contacts) {

            // todo filter by chat, repeater, room etc

            // fallback to returning all contacts
            return contacts;

        },
    },
    computed: {
        GlobalState() {
            return GlobalState;
        },
        searchedContacts() {

            // filter and sort contacts
            var contacts = [...this.contacts];
            contacts = this.getFilteredContacts(contacts);
            contacts = this.getOrderedContacts(contacts);
            contacts = contacts.filter((contact) => contact != null);

            // search contacts
            contacts = contacts.filter((contact) => {
                const search = this.contactsSearchTerm.toLowerCase();
                const matchesName = contact.advName.toLowerCase().includes(search);
                return matchesName;
            });

            return contacts;

        },
    },
    watch: {
        filter() {
            window.localStorage.setItem("contacts_list_filter", this.filter);
        },
        order() {
            window.localStorage.setItem("contacts_list_order", this.order);
        },
    }
}
</script>
