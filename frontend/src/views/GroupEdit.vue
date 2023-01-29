<template>
    <div>
        <h1>Edit Group {{ group?.group.name }}</h1>

        <h2>Users in this group ({{ group?.users.length }})</h2>
        <div class="smallGroupEntryContainer">
            <div v-for="user of group?.users" :key="user.id" class="slimHighlightContainer">
                {{ user.username }}
                <button
                    :class="'delete' + (isButtonDisabled(user) ? ' btn-disabled' : '')"
                    @click="removeUser(user)">
                    x
                </button>
            </div>
            <div>
                <div v-show="addingUser">
                    <input v-model="userAddMail" placeholder="e-mail" />

                    <button @click="addUser">Confirm</button>
                </div>

                <button v-show="!addingUser" @click="addingUser = true">+</button>
                <label class="error">{{ userAddError }}</label>
            </div>
        </div>

        <h2>Devices in this group ({{ group?.devices.length }})</h2>
        <div class="smallGroupEntryContainer">
            <div v-for="device of group?.devices" :key="device.id" class="slimHighlightContainer">
                {{ device.name }}
                <button class="delete btn-disabled">x</button>
            </div>
            <button class="btn-disabled">+</button>
        </div>
    </div>
</template>

<script lang="ts">
    import { IUser } from "server_mgt-lib/types"
    import { Options, Vue } from "vue-class-component"
    import * as requests from "@/helper/requests"
    import * as responses from "server_mgt-lib/responses"

    @Options({
        props: {
            user: Object
        }
    })
    export default class GroupEdit extends Vue {
        user?: IUser = undefined

        group: responses.DetailedGroupResponse | undefined = undefined
        groupId: string = ""

        addingUser: boolean = false
        addingDevice: boolean = false
        userAddMail: string = ""
        userAddError: string = ""

        async created() {
            this.groupId = (this.$route.params.id as string) ?? ""
            await this.getData()
        }

        async getData() {
            this.group = await requests.getGroupDetails(this.groupId)
            this.$forceUpdate()
        }

        isButtonDisabled(user: IUser) {
            return this.group?.owner.id == user?.id
        }

        async addUser() {
            this.addingUser = false
            if (this.userAddMail == "") return
            const result = await requests.addUserToGroup(this.groupId, this.userAddMail)

            if (result) {
                this.userAddError = ""
                await this.getData()
            } else {
                this.userAddError = "User not found"
            }

            this.$forceUpdate()
        }

        async removeUser(user: IUser) {
            if (this.isButtonDisabled(user)) return
            await requests.removeUserFromGroup(this.groupId, user.id)
            await this.getData()
        }
    }
</script>

<style>
    .smallGroupEntryContainer {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 5px;
        border-radius: 5px;
        margin: 5px;
    }
</style>
