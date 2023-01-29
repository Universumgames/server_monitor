<template>
    <h1>Usermanagement</h1>
    <div class="highlightContainer">
        <button v-show="!creatingUser" @click="creatingUser = true">Create a new User</button>
        <CreateUser v-show="creatingUser" @createUser="createUser" @cancel="creatingUser = false" />
    </div>

    <div>
        <h2>Userlist</h2>
        <UserRow
            v-for="user in users"
            :key="user.id"
            :user="user"
            @deleteUser="getData()"
            style="margin-top: 1ch" />
    </div>
</template>

<script lang="ts">
    import { IUser } from "server_mgt-lib/types"
    import { Options, Vue } from "vue-class-component"
    import CreateUser from "@/components/admin/CreateUser.vue"
    import UserRow from "@/components/admin/UserRow.vue"

    import * as adminRequests from "@/helper/adminRequests"

    @Options({
        components: {
            CreateUser,
            UserRow
        },
        props: {
            user: Object
        }
    })
    export default class UserManagement extends Vue {
        user?: IUser = undefined
        creatingUser = false
        users: IUser[] = []

        async created() {
            await this.getData()
        }

        async getData() {
            this.users = (await adminRequests.getUsers()) ?? []
            this.$forceUpdate()
        }

        mounted(): void {
            /*if (!this.user?.admin) {
                this.$router.replace({ name: "Devices" })
            }*/
        }

        async createUser(user: IUser) {
            await adminRequests.createUser({
                username: user.username,
                email: user.email
            })
            this.creatingUser = false
            await this.getData()
        }
    }
</script>
