<template>
    <div>
        <h1>Edit Group {{ group?.group.name }}</h1>

        <h2>Users in this group ({{ group?.users.length }})</h2>
        <div class="smallGroupEntryContainer">
            <div v-for="user of group?.users" :key="user.id" class="slimHighlightContainer">
                {{ user.username }}
                <button :class="'delete' + (isButtonDisabled(user) ? ' btn-disabled' : '')" @click="removeUser(user)">
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

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import * as requests from "../helper/requests"
import { type IUser } from "server_mgt-lib/types"
import * as responses from "server_mgt-lib/responses"

const props = defineProps<{ user: IUser }>()

const user = ref<IUser | undefined>(props.user)
const group = ref<responses.DetailedGroupResponse | undefined>(undefined)
const groupId = ref<string>("")

const addingUser = ref<boolean>(false)
const addingDevice = ref<boolean>(false)
const userAddMail = ref<string>("")
const userAddError = ref<string>("")

const route = useRoute()

onMounted(async () => {
    groupId.value = (route.params.id as string) ?? ""
    await getData()
})

const getData = async () => {
    group.value = await requests.getGroupDetails(groupId.value)
}

const isButtonDisabled = (user: IUser) => {
    return group.value?.owner.id === user?.id
}

const addUser = async () => {
    addingUser.value = false
    if (userAddMail.value === "") return
    const result = await requests.addUserToGroup(groupId.value, userAddMail.value)

    if (result) {
        userAddError.value = ""
        await getData()
    } else {
        userAddError.value = "User not found"
    }
}

const removeUser = async (user: IUser) => {
    if (isButtonDisabled(user)) return
    await requests.removeUserFromGroup(groupId.value, user.id)
    await getData()
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
