<template>
    <div class="flex bg-white py-2 border-b h-16">

        <!-- back button -->
        <div class="my-auto px-1">
            <IconButton @click="$router.back()" class="bg-transparent">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
            </IconButton>
        </div>

        <!-- optional: leading -->
        <div class="my-auto">
            <slot name="leading"/>
        </div>

        <!-- title and subtitle -->
        <div class="my-auto mr-auto overflow-hidden">
            <div class="font-bold">{{ title }}</div>
            <div v-if="subtitle != null" class="text-sm truncate">{{ subtitle }}</div>
        </div>

        <!-- optional: trailing -->
        <div class="flex my-auto mx-2">
            <slot name="trailing"/>
        </div>

    </div>
</template>

<script>
import IconButton from "./IconButton.vue";

export default {
    name: 'AppBar',
    components: {IconButton},
    props: {
        title: String,
        subtitle: String | null,
    },
}
</script>
