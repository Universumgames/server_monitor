<template>
    <footer class="footer">
        <label>Created by universumgames</label><br />
        <a href="https://universegame.de">Website</a>
        <a href="https://github.com/universumgames">Github</a>
        <a :href="'https://universegame.de/bug?app=server_monitor&v=' + bugreportVersion" target="_blank">Bugreport</a>
        <router-link to="/privacy">Privacy</router-link>
        <router-link to="/siteNotice">Impressum</router-link>
        <a href="https://mt32.net" target="_blank">Blog</a>
        <br />
        <a href="https://git.mt32.net/universum/server_monitor" target="_blank">Source</a>

        <br />
        <a href="https://www.buymeacoffee.com/universum" target="_blank"><img
                src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41"
                width="174" loading="lazy" /></a>
        <br />
        <p>Frontend-Version {{ frontendVersion }}</p>
        <p>Backend-Version {{ backendVersion }}</p>
    </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    frontendVersion: string,
    backendVersion: string
}>()

const bugreportVersion = computed(() => {
    return encodeURIComponent(
        "Frontend " + props.frontendVersion + ", Backend " + props.backendVersion
    )
})
</script>
