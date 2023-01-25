<template>
    <router-view />
</template>

<script lang="ts">
    import { Options, Vue } from "vue-class-component"
    import { isDarkMode, getQueryParam } from "./helper/helper"

    @Options({})
    export default class App extends Vue {
        isDark: boolean = false

        mounted() {
            this.manageDarkMode()
            // @ts-ignore
            this.$router.beforeEach(async (to) => {
                document.title =
                    to.meta.title != undefined ? (to.meta.title as string) : "404 Page not found"
            })
        }

        manageDarkMode() {
            if (this.styleOverwrites()) return
            this.isDark = isDarkMode()
            // watch for darkmode changes
            window.matchMedia("(prefers-color-scheme: dark)").addListener(() => {
                if (this.styleOverwrites()) return

                this.isDark = isDarkMode()
                document.body.classList.remove(!this.isDark ? "darkVars" : "lightVars")
                document.body.classList.add(this.isDark ? "darkVars" : "lightVars")
            })
            document.body.classList.add(this.isDark ? "darkVars" : "lightVars")
        }

        styleOverwrites(): boolean {
            const darkMode = getQueryParam("darkmode")

            if (darkMode != undefined) this.isDark = darkMode == "1" ? true : false
            document.body.classList.remove(!this.isDark ? "darkVars" : "lightVars")
            document.body.classList.add(this.isDark ? "darkVars" : "lightVars")

            const bgColor = getQueryParam("bgColor")
            if (bgColor != undefined) {
                document.body.style.setProperty("--bg-color", bgColor)
            }
            const textColor = getQueryParam("textColor")
            if (textColor != undefined) {
                document.body.style.setProperty("--text-color", textColor)
            }
            const secondaryColor = getQueryParam("secondaryColor")
            if (secondaryColor != undefined) {
                document.body.style.setProperty("--secondary-color", secondaryColor)
            }
            const primaryColor = getQueryParam("primaryColor")
            if (primaryColor != undefined) {
                document.body.style.setProperty("--primary-color", primaryColor)
            }

            if (darkMode != undefined) return true
            return false
        }
    }
</script>

<style>
    body {
        background: var(--bg-color);
        margin: 0;
        padding: 0;
    }

    p {
        white-space: pre-wrap;
    }

    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: var(--text-color);
        position: relative;
        margin: 2ch;
    }

    button {
        background: #42b983;
        border: none;
        padding: 0.5rem;
        border-radius: 1ch;
        color: var(--text-color);
        font-weight: bold;
        font-size: 1rem;
        cursor: pointer;
        width: fit-content;
        transition-duration: 0.4s;
        margin: 1ch;
    }

    button:hover {
        filter: invert(100%);
    }

    input,
    textarea {
        color: var(--text-color);
        padding: 1ch;
        background: var(--secondary-color);
        border: none;
        margin: 1ch;
        border-radius: 1ch;
    }

    select {
        border: none;
        background: var(--secondary-color);
        color: var(--text-color);
        margin: 1ch;
        padding: 1ch;
        border-radius: 1ch;
    }

    a {
        font-weight: bold;
        color: var(--text-color);
        text-decoration: none;
        margin-left: 1ch;
        display: inline-block;
        cursor: pointer;
    }

    a.router-link-exact-active {
        color: #42b983;
    }

    .lightVars {
        --text-color: #2c3e50;
        --bg-color: #f5f5f5;
        --secondary-color: #dddddd;
        --primary-color: #42b983;
        --blank-text-color: var(--bg-color);
        --alert-color: #ba4b4a;
        --error-color: var(--alert-color);
        --success-color: var(--primary-color);
        --disabled-color: gray;
    }

    .darkVars {
        --text-color: whitesmoke;
        --bg-color: #2c3e50;
        --secondary-color: #314961;
        --primary-color: #42b983;
        --blank-text-color: var(--bg-color);
        --alert-color: #ba4b4a;
        --error-color: var(--alert-color);
        --success-color: var(--primary-color);
        --disabled-color: darkgray;
    }

    header {
        background: var(--secondary-color);
        border-radius: 1ch;
        margin-bottom: 2rem;
    }

    #nav {
        padding: 3ch;
        margin: 2ch;
    }

    .errorInfo {
        color: var(--alert-color);
    }

    .normalIcon {
        width: 1rem;
        height: 1rem;
    }

    td,
    th {
        padding: 0.5rem;
        background: var(--secondary-color);
    }

    .footer {
        background: var(--secondary-color);
        padding: 1rem;
        border-radius: 1ch;
        margin: 1ch auto 1ch auto;
    }

    .footer > * {
        margin: 1ch;
    }

    .grecaptcha-badge {
        visibility: hidden;
    }

    .footer-center {
        display: flex;
        justify-content: center;
    }

    .btn-disabled {
        background-color: var(--disabled-color) !important;
    }

    .delete {
        background-color: var(--alert-color);
    }

    pre {
        white-space: pre-wrap; /* Since CSS 2.1 */
        white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
        white-space: -pre-wrap; /* Opera 4-6 */
        white-space: -o-pre-wrap; /* Opera 7 */
        word-wrap: break-word; /* Internet Explorer 5.5+ */
    }

    .error {
        color: var(--error-color);
    }

    .success {
        color: var(--success-color);
    }

    .highlightContainer {
        background: var(--secondary-color);
        padding: 1rem;
        border-radius: 1ch;
    }

    .slimHighlightContainer {
        background: var(--secondary-color);
        padding: 0.5rem;
        border-radius: 1ch;
    }
</style>
