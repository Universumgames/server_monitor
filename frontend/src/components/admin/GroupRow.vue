<template>
    <div class="highlightContainer groupRowContainer" style="margin-top: 1ch">
        <div>Name: {{ group?.name }}</div>
        <div>UUID: {{ group?.id }}</div>
        <div>Member Count {{ group?.memberCount }}</div>
        <div>Owner: {{ group?.ownerId }}</div>
    </div>
</template>

<script setup lang="ts">
import * as responses from "server_mgt-lib/responses"

const props = defineProps<{ group: responses.BasicGroupResponse }>()
</script>

<style>
.groupRowContainer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}
</style>
