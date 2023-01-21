<template>
    <span class="dot" :title="tooltip"></span>
</template>

<script lang="ts">
    import { Options, Vue } from "vue-class-component"

    @Options({
        props: {
            tooltip: String
        }
    })
    export default class StatusIndicator extends Vue {
        tooltip?: string = ""
    }
</script>

<style>
    .dot {
        height: 1.5rem;
        width: 1.5rem;
        background-color: #bbb;
        border-radius: 50%;
        display: inline-block;
        position: absolute;
        top: 0.75ch;
        right: 0.75ch;
    }
</style>
