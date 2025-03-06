<template>
    <div id="nav">
        <router-link to="/" v-show="loggedIn">Devices</router-link>
        <router-link to="/groups" v-show="loggedIn">Groups</router-link>
        <router-link to="/login" v-show="!loggedIn">Login</router-link>
        <router-link to="/management" v-show="admin">Management</router-link>
        <a @click="handleLogout" v-show="loggedIn">Logout</a>
    </div>
    <router-view @login="onLogin" :user="user" />
    <Footer :frontendVersion="frontendVersion" :backendVersion="backendVersion" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { type IUser } from "server_mgt-lib/types"
import { isLoggedIn, logout, getServerInfo, getBasicUser } from "./helper/requests"
import Footer from "./components/FooterView.vue"

const loggedIn = ref<boolean>(false)
const admin = ref<boolean>(false)

const frontendVersion = import.meta.env.VITE_APP_VERSION
const backendVersion = ref<string>("unknown")

const user = ref<IUser | undefined>(undefined)

const router = useRouter()
const route = useRoute()

onMounted(async () => {
    await getData()
})

const getData = async () => {
    loggedIn.value = await isLoggedIn()
    backendVersion.value = (await getServerInfo()).version
    if (!loggedIn.value) {
        router.push({ name: "Login", query: { token: route.query.token as string } })
    }
    user.value = await getBasicUser()
    admin.value = user.value?.admin ?? false
}

const handleLogout = async () => {
    await logout()
    loggedIn.value = false
    user.value = undefined
    admin.value = false
    router.push({ name: "Login" })
}

const onLogin = async (data: any) => {
    if (data != true) return
    loggedIn.value = true
    await getData()
    router.push({ name: "Devices" })
}
</script>
