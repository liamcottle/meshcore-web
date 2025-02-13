<template>
    <div class="flex cursor-pointer p-2 bg-white hover:bg-gray-50">

        <!-- name and info -->
        <div class="mr-auto">
            <div>{{ channel.name }}</div>
            <div class="text-sm text-gray-500">{{ channel.description }}</div>
        </div>

    </div>
</template>

<script>
export default {
    name: 'ChannelListItem',
    props: {
        channel: Object,
    },
}
</script>
