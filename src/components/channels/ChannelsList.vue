<template>
    <div class="flex flex-col h-full w-full overflow-hidden">

        <!-- channels -->
        <div class="h-full overflow-y-auto">
            <ChannelListItem :key="channel.idx" v-for="channel of channels" :channel="channel" @click="onChannelClick(channel)"/>
        </div>

    </div>
</template>

<script>
import ChannelListItem from "./ChannelListItem.vue";

export default {
    name: 'ChannelsList',
    components: {
        ChannelListItem,
    },
    emits: [
        "channel-click",
    ],
    props: {
        channels: Array,
    },
    methods: {
        onChannelClick(channel) {
            this.$emit("channel-click", channel);
        },
    },
}
</script>
