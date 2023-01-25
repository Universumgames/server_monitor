<template>
    <div class="slimHighlightContainer">
        <div class="userRow">
            <div class="userRowUsername">{{ user?.username }}</div>
            <div class="userRowEmail">{{ user?.email }}</div>
            <div class="userRowAdmin">{{ user?.admin ? "Admin" : "User" }}</div>
            <div>
                <label @click="showGroups = !showGroups" style="cursor: pointer"
                    >Groups: {{ user?.groups.length }}</label
                >
                <div v-show="showGroups">
                    <div v-for="group in user?.groups" :key="group.id">{{ group.name }}</div>
                </div>
            </div>

            <div class="userRowDelete">
                <button class="delete">Delete</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Options, Vue } from "vue-class-component"
    import { IUser } from "server_mgt-lib/types"
    import * as adminRequests from "@/helper/adminRequests"

    @Options({
        props: {
            user: Object
        }
    })
    export default class UserRow extends Vue {
        user?: IUser = undefined

        detailedUser?: IUser = undefined

        showGroups = false

        async mounted() {
            this.detailedUser = await adminRequests.getUser(this.user?.id ?? "")
            console.log(this.detailedUser)
        }
    }
</script>

<style>
    .userRow {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem;
    }
</style>
