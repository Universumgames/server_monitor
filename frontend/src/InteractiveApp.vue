<template>
    <div id="nav">
        <router-link to="/">Home</router-link>
        <router-link to="/login" v-show="!loggedIn">Login</router-link>
        <a @click="logout" v-show="loggedIn">Logout</a>
    </div>
    <router-view />
</template>

<script lang="ts">
    import { Options, Vue } from "vue-class-component"
    import { isLoggedIn } from "./helper/requests"

    @Options({})
    export default class InteractiveApp extends Vue {
        loggedIn: boolean = false

        async created() {
            this.loggedIn = await isLoggedIn()
        }

        async logout() {
            // TODO implement logout
        }
    }
</script>
