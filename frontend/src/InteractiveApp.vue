<template>
    <div id="nav">
        <router-link to="/">Home</router-link>
        <router-link to="/login" v-show="!loggedIn">Login</router-link>
        <a @click="logout" v-show="loggedIn">Logout</a>
    </div>
    <router-view />
    <footer class="footer">
        <label>Created by universumgames</label><br />
        <a href="https://universegame.de">Website</a>
        <a href="https://github.com/universumgames">Github</a>
        <a
            :href="'https://universegame.de/bug?app=server_monitor&v=' + bugreportVersion"
            target="_blank"
            >Bugreport</a
        >
        <router-link to="/privacy">Privacy</router-link>
        <router-link to="/siteNotice">Impressum</router-link>
        <a href="https://mt32.net" target="_blank">Blog</a>
        <br />
        <a href="https://git.mt32.net/universum/server_monitor" target="_blank">Source</a>

        <br />
        <a href="https://www.buymeacoffee.com/universum" target="_blank"
            ><img
                src="https://cdn.buymeacoffee.com/buttons/default-orange.png"
                alt="Buy Me A Coffee"
                height="41"
                width="174"
                loading="lazy"
        /></a>
        <br />
        <p>Frontend-Version {{ frontendVersion }}</p>
        <p>Backend-Version {{ backendVersion }}</p>
    </footer>
</template>

<script lang="ts">
    import { Options, Vue } from "vue-class-component"
    import { isLoggedIn } from "./helper/requests"
    import { getServerInfo } from "./helper/requests"

    @Options({})
    export default class InteractiveApp extends Vue {
        loggedIn: boolean = false

        frontendVersion = "0.1.0"
        backendVersion = "unknown"

        async created() {
            this.loggedIn = await isLoggedIn()
            this.backendVersion = (await getServerInfo()).version
        }

        async logout() {
            // TODO implement logout
        }

        get bugreportVersion() {
            return encodeURIComponent(
                "Frontend " + this.frontendVersion + ", Backend " + this.backendVersion
            )
        }
    }
</script>
