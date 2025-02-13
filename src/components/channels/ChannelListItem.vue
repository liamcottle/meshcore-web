<template>
    <div class="flex cursor-pointer p-2 bg-white hover:bg-gray-50">

        <!-- name and info -->
        <div class="mr-auto">
            <div>{{ channel.name }}</div>
            <div class="text-sm text-gray-500">{{ channel.description }}</div>
        </div>

        <!-- channel dropdown menu -->
        <div class="my-auto">
            <ChannelDropDownMenu :channel="channel"/>
        </div>

    </div>
</template>

<script>
import ContactDropDownMenu from "../contacts/ContactDropDownMenu.vue";
import ChannelDropDownMenu from "./ChannelDropDownMenu.vue";

export default {
    name: 'ChannelListItem',
    components: {ChannelDropDownMenu, ContactDropDownMenu},
    props: {
        channel: Object,
    },
}
</script>
