<template>
    <div class="loader"></div>
</template>

<script lang="ts">
    import { Options, Vue } from "vue-class-component"

    @Options({
        props: {}
    })
    export default class LoadingScreen extends Vue {
        created() {}

        mounted() {}
    }
</script>

<style scoped>
    .loader {
        border: 16px solid #f3f3f300; /* Light grey */
        border-top: 16px solid var(--primary-color); /* Blue */
        border-radius: 50%;
        width: 20vw;
        height: 20vw;
        animation: spin 2s linear infinite;
        margin: 0 auto 0 auto;
        position: absolute;
        top: 50vh;
        left: 50vw;
        transform: translate(50%, 50%);
        z-index: 100;
    }

    @keyframes spin {
        0% {
            transform: translate(-50%, -50%) rotate(0deg);
        }
        100% {
            transform: translate(-50%, -50%) rotate(360deg);
        }
    }
</style>
