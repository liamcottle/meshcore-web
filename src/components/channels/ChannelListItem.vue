<template>
    <div class="flex cursor-pointer p-2 bg-white hover:bg-gray-50">

        <!-- name and info -->
        <div class="mr-auto">
            <div>{{ channel.name }}</div>
            <div class="text-sm text-gray-500">{{ channel.description }}</div>
        </div>

        <!-- unread messages count -->
        <div v-if="unreadMessagesCount > 0" class="my-auto">
            <div class="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full shadow">
                <span v-if="unreadMessagesCount >= 100">99</span>
                <span>{{ unreadMessagesCount }}</span>
            </div>
        </div>

        <!-- channel dropdown menu -->
        <div class="my-auto">
            <ChannelDropDownMenu :channel="channel"/>
        </div>

    </div>
</template>

<script>
import ChannelDropDownMenu from "./ChannelDropDownMenu.vue";
import Database from "../../js/Database.js";

export default {
    name: 'ChannelListItem',
    components: {ChannelDropDownMenu},
    props: {
        channel: Object,
    },
    data() {
        return {
            unreadMessagesCount: 0,
            channelMessagesSubscription: null,
            channelMessagesReadStateSubscription: null,
        };
    },
    mounted() {

        // listen for new messages so we can update read state
        this.channelMessagesSubscription = Database.ChannelMessage.getChannelMessages(this.channel.idx).$.subscribe(async () => {
            await this.onMessagesUpdated();
        });

        // listen for read state changes
        this.channelMessagesReadStateSubscription = Database.ChannelMessagesReadState.get(this.channel.idx).$.subscribe(async (channelMessagesReadState) => {
            await this.onChannelMessagesReadStateChange(channelMessagesReadState);
        });

    },
    unmounted() {
        this.channelMessagesSubscription?.unsubscribe();
        this.channelMessagesReadStateSubscription?.unsubscribe();
    },
    methods: {
        async onMessagesUpdated() {
            const channelMessagesReadState = await Database.ChannelMessagesReadState.get(this.channel.idx).exec();
            await this.onChannelMessagesReadStateChange(channelMessagesReadState);
        },
        async updateUnreadMessagesCount(lastReadTimestamp) {
            this.unreadMessagesCount = await Database.ChannelMessage.getChannelMessagesUnreadCount(this.channel.idx, lastReadTimestamp).exec();
        },
        async onChannelMessagesReadStateChange(channelMessagesReadState) {
            const messagesLastReadTimestamp = channelMessagesReadState?.timestamp ?? 0;
            await this.updateUnreadMessagesCount(messagesLastReadTimestamp);
        },
    },
}
</script>
