<template>
    <div class="footer">
        <div class="footer_links">
            <div class="server_monitor_about_links">
                <small>Server Monitor</small>
                <a :href="'https://universegame.de/bug?app=server+monitor&v=' +
                    bugreportVersion
                    " target="_blank" tabindex="0">Bugreport</a>
                <RouterLink to="/siteNotice" tabindex="0">
                    Site Notice
                </RouterLink>
            </div>
            <div class="server_monitor_source_links">
                <small>Source Code</small>
                <a href="https://github.com/Universumgames/server_monitor" target="_blank" tabindex="0">Project
                    Source</a>
                <a href="https://github.com/Universumgames/server_monitor/tree/main/backend" target="_blank"
                    tabindex="0">Server Source</a>
                <a href="https://github.com/Universumgames/server_monitor/tree/main/frontend" target="_blank"
                    tabindex="0">Frontend Source</a>
                <a href="https://github.com/Universumgames/server_monitor/tree/main/client" target="_blank"
                    tabindex="0">Client Scripts</a>
            </div>
            <div class="personal_links">
                <small>Other Projects</small>
                <a href="https://universegame.de" tabindex="0">Website</a>
                <a href="https://expoll.mt32.net" target="_blank" tabindex="0">Expoll</a>
                <a href="https://github.com/universumgames" tabindex="0">Github</a>
                <a href="https://mt32.net" target="_blank" tabindex="0">Blog</a>
            </div>
        </div>
        <div class="bmc">
            <small>Sponsor me</small>
            <a href="https://www.buymeacoffee.com/universum" target="_blank" tabindex="0"
                aria-label="Buy me a coffee link">
                <img alt="Buy Me A Coffee" height="41" loading="lazy"
                    src="https://cdn.buymeacoffee.com/buttons/default-orange.png"
                    style="border-radius: var(--default-border-radius);" width="174"></a>
        </div>
        <div class="belowFooter">
            <div class="versionInfo">
                <small>Frontend-Version {{ frontendVersion }}</small>
                <small>Backend-Version {{ backendVersion }}</small>
            </div>
            <div>
                <small>Created by universumgames</small>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import LanguageSelect from "./LanguageSelect.vue"
import { computed } from "vue"
import { RouterLink } from 'vue-router'

interface Props {
    frontendVersion: string
    backendVersion: string
}

const props = defineProps<Props>()
const emit = defineEmits(["onLangChange", "colorChange"])

const bugreportVersion = computed(() =>
    encodeURIComponent(
        "Frontend " + props.frontendVersion + " " + "server_monitor" + ", Backend " + props.backendVersion)
)

</script>

<style>
.footer {
    background: var(--secondary-color);
    padding: 1rem;
    border-radius: var(--default-border-radius);
    margin: 1ch auto 1ch auto;
    text-align: left;
}

.footer_links {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
}

.footer_links>div {
    display: flex;
    flex-direction: column;
}

.footer * {
    margin: 1ch;
}

.versionInfo {}

.belowFooter {
    font-size: small;
    display: flex;
    justify-content: space-between;
}

.belowFooter * {}

.quickSettings {
    display: flex;
    flex-direction: column;
    align-items: end;
}

.quickSettings>* {
    margin: 0.5ch;
}

.footer small {
    color: var(--text-color-dimmed);
    display: block;
}

.bmc {
    display: flex;
    align-items: center;
    flex-direction: column;
}

.bmc * {
    margin: 0.5ch;
}

.bmc img {
    width: min(30ch, 80vw);
    height: auto;
}
</style>