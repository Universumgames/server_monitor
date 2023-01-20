<template>
    <div id="nav">
        <router-link to="/">Home</router-link> | <router-link to="/about">About</router-link> |
        <router-link to="/devices">Devices</router-link>
    </div>
    <router-view />
</template>

<script lang="ts">
    import { Options, Vue } from "vue-class-component"
    import { isDarkMode } from "./helper/helper"

    @Options({})
    export default class App extends Vue {
        isDark: boolean = false

        created() {
            this.manageDarkMode()
        }

        manageDarkMode() {
            this.isDark = isDarkMode()
            // watch for darkmode changes
            window.matchMedia("(prefers-color-scheme: dark)").addListener(() => {
                this.isDark = isDarkMode()
                document.body.classList.remove(!this.isDark ? "darkVars" : "lightVars")
                document.body.classList.add(this.isDark ? "darkVars" : "lightVars")
            })
            document.body.classList.add(this.isDark ? "darkVars" : "lightVars")
        }
    }
</script>
