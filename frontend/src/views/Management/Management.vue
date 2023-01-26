<template>
    <div id="managementNav">
        <router-link to="/management/user">User</router-link>
        <router-link to="/management/group">Group</router-link>
        <router-link to="/management/device">Device</router-link>
    </div>
    <router-view />
</template>

<script lang="ts">
    import { IUser } from "server_mgt-lib/types"
    import { Options, Vue } from "vue-class-component"

    @Options({
        props: {
            user: Object
        }
    })
    export default class Management extends Vue {
        user?: IUser = undefined

        created() {}
    }
</script>

<style>
    .managementNav {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
</style>
