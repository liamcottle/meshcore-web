<template>
    <Page>

        <!-- app bar -->
        <AppBar title="Connect" subtitle="Select a Connection Method"/>

        <!-- list -->
        <div class="mx-auto my-auto">
            <ConnectButtons/>
        </div>

    </Page>
</template>

<script>
import AppBar from "../AppBar.vue";
import Page from "./Page.vue";
import ConnectButtons from "../connect/ConnectButtons.vue";

export default {
    name: 'ConnectPage',
    components: {
        ConnectButtons,
        Page,
        AppBar,
    },
}
</script>
