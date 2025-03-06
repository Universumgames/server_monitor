<template>
    <h1>Usermanagement</h1>
    <div class="highlightContainer">
        <button v-show="!creatingUser" @click="creatingUser = true">Create a new User</button>
        <CreateUser v-show="creatingUser" @createUser="createUser" @cancel="creatingUser = false" />
    </div>

    <div>
        <h2>Userlist</h2>
        <UserRow v-for="user in users" :key="user.id" :user="user" @deleteUser="getData()" style="margin-top: 1ch" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { type IUser } from "server_mgt-lib/types"
import CreateUser from "../../components/admin/CreateUser.vue"
import UserRow from "../../components/admin/UserRow.vue"
import * as adminRequests from "../../helper/adminRequests"

const props = defineProps<{ user: IUser }>()

const user = ref<IUser | undefined>(props.user)
const creatingUser = ref<boolean>(false)
const users = ref<IUser[]>([])

const router = useRouter()

onMounted(async () => {
    await getData()
    /*if (!user.value?.admin) {
        router.replace({ name: "Devices" })
    }*/
})

const getData = async () => {
    users.value = (await adminRequests.getUsers()) ?? []
}

const createUser = async (newUser: IUser) => {
    await adminRequests.createUser({
        username: newUser.username,
        email: newUser.email
    })
    creatingUser.value = false
    await getData()
}
</script>
