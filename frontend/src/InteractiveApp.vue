<template>
    <div id="nav">
        <router-link to="/" v-show="loggedIn">Devices</router-link>
        <router-link to="/groups" v-show="loggedIn">Groups</router-link>
        <router-link to="/login" v-show="!loggedIn">Login</router-link>
        <router-link to="/management" v-show="admin">Management</router-link>
        <a @click="logout" v-show="loggedIn">Logout</a>
    </div>
    <router-view @login="onLogin" :user="user" />
    <Footer :frontendVersion="frontendVersion" :backendVersion="backendVersion" />
</template>

<script lang="ts">
    import { IUser } from "server_mgt-lib/types"
    import { Options, Vue } from "vue-class-component"
    import { isLoggedIn, logout } from "./helper/requests"
    import { getServerInfo, getBasicUser } from "./helper/requests"
    import Footer from "./components/Footer.vue"

    @Options({
        components: {
            Footer
        }
    })
    export default class InteractiveApp extends Vue {
        loggedIn: boolean = false
        admin: boolean = false

        frontendVersion = "0.7.0"
        backendVersion = "unknown"

        user?: IUser = undefined

        async created() {
            this.getData()
        }

        async getData() {
            this.loggedIn = await isLoggedIn()
            this.backendVersion = (await getServerInfo()).version
            if (!this.loggedIn) {
                this.$router.push({ name: "Login" })
            }
            this.user = await getBasicUser()

            this.admin = this.user?.admin ?? false
        }

        async logout() {
            await logout()
        }

        async onLogin(data: any) {
            if (data != true) return
            this.loggedIn = true
            this.getData()
            this.$router.push({ name: "Devices" })
        }
    }
</script>
