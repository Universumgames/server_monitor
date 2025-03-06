<template>
    <div id="managementNav">
        <router-link to="/management/user">User</router-link>
        <router-link to="/management/group">Group</router-link>
        <router-link to="/management/device">Device</router-link>
    </div>
    <router-view />
</template>

<script setup lang="ts">
import { type IUser } from "server_mgt-lib/types"

const props = defineProps<{ user: IUser }>()

</script>

<style>
.managementNav {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
</style>
