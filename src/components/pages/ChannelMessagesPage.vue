<template>
    <Page>

        <!-- app bar -->
        <AppBar title="Channel Messages" :subtitle="subtitle"/>

        <!-- list -->
        <div class="flex h-full w-full overflow-hidden">
            <MessageViewer v-if="channel != null" :type="'channel'" :channel="channel"/>
        </div>

    </Page>
</template>

<script>
import Page from "./Page.vue";
import AppBar from "../AppBar.vue";
import MessageViewer from "../messages/MessageViewer.vue";
import GlobalState from "../../js/GlobalState.js";

export default {
    name: 'ChannelMessagesPage',
    components: {
        MessageViewer,
        AppBar,
        Page,
    },
    props: {
        channelIdx: String,
    },
    mounted() {

        // redirect to main page if channel not found
        if(!this.channel){
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
        channel() {
            return GlobalState.channels.find((channel) => channel.idx.toString() === this.channelIdx.toString());
        },
        subtitle() {
            return this.channel ? this.channel.name : "Unknown Channel";
        },
    },
}
</script>
