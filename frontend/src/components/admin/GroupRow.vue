<template>
    <div class="highlightContainer groupRowContainer" style="margin-top: 1ch">
        <div>Name: {{ group?.name }}</div>
        <div>UUID: {{ group?.id }}</div>
        <div>Member Count {{ group?.memberCount }}</div>
        <div>Owner: {{ group?.ownerId }}</div>
    </div>
</template>

<script lang="ts">
    import { Options, Vue } from "vue-class-component"
    import * as responses from "server_mgt-lib/responses"

    @Options({
        props: {
            group: Object
        }
    })
    export default class GroupRow extends Vue {
        group?: responses.BasicGroupResponse = undefined

        created() {}
    }
</script>

<style>
    .groupRowContainer {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
</style>
