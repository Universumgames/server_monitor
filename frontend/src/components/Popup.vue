<template>
    <div class="popupContainer">
        <button @click="goBack">Close</button>
        <div class="popupContent">
            <div class="slotStyle">
                <slot />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Options, Vue } from "vue-class-component"

    @Options({
        components: {}
    })
    export default class Popup extends Vue {
        goBack() {
            this.$router.go(-1)
        }

        keyup(event: KeyboardEvent) {
            if (event.key == "Escape") {
                this.goBack()
            }
        }

        mounted(): void {
            document.addEventListener("keyup", this.keyup)
        }

        beforeUnmount(): void {
            document.removeEventListener("keyup", this.keyup)
        }
    }
</script>

<style>
    .popupContainer {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 100;
    }

    .popupContent {
        width: min(max(80vw, 50ch), 95vw);
        height: 90vh;
        margin: auto;
        position: relative;
        overflow: auto;
        top: 5vh;
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
        border-radius: 1rem;
    }

    .popupContent::-webkit-scrollbar {
        display: none;
    }

    .popupContainer > button {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 101;
    }

    .slotStyle {
        background-color: var(--bg-color);
        padding: min(2rem, 4vw);
        border-radius: 1rem;
    }
</style>
