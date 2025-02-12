<template>
    <button :disabled="isSaving" type="button" class="text-white font-semibold px-2 py-1 rounded shadow" :class="[ isSaving ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-400' ]">
        <span v-if="isSaving">Saving...</span>
        <span v-else>Save</span>
    </button>
</template>

<script>
export default {
    name: 'SaveButton',
    props: {
        isSaving: Boolean,
    },
}
</script>
