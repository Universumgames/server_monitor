<template>
    <vue-markdown :source="markdown" class="text" />
</template>

<script setup lang="ts">
import VueMarkdown from "vue-markdown-render"
import { onMounted, ref } from "vue"

const markdown = ref("")

onMounted(async () => {
    const filename = "/en_site_notice.md"
    markdown.value = await (await fetch(filename)).text()
})
</script>

<style scoped>
.text {
    text-align: left;
}
</style>
