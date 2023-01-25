<template>
    <vue-markdown class="text" :source="markdown" />
</template>

<script lang="ts">
    import { Options, Vue } from "vue-class-component"
    import VueMarkdown from "vue-markdown-render"

    @Options({
        components: {
            VueMarkdown
        },
        props: {
            language: Object
        }
    })
    export default class SiteNotice extends Vue {
        markdown: string = ""

        async created() {
            this.loadMarkdown()
        }

        mounted() {}

        async loadMarkdown() {
            const filename = "/en_site_notice.md"
            this.markdown = await (await fetch(filename)).text()
        }
    }
</script>

<style scoped>
    .text {
        text-align: left;
    }
</style>
