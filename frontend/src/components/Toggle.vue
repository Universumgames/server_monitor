<template>
    <label class="switch">
        <input type="checkbox" @change="onValueChange" v-model="toggle" />
        <span class="slider round"></span>
    </label>
</template>

<script lang="ts">
    import { Options, Vue } from "vue-class-component"

    @Options({
        emits: ["toggleChange"],
        props: {
            initialValue: Boolean
        }
    })
    export default class Toggle extends Vue {
        toggle = false

        initialValue? = false

        created() {
            this.toggle = this.initialValue ?? false
        }

        onValueChange(e: Event) {
            this.$emit("toggleChange", this.toggle)
            e.preventDefault()
        }
    }
</script>

<style>
    /* The switch - the box around the slider */
    .switch {
        position: relative;
        display: inline-block;
        width: 3rem;
        height: 1.5rem;
    }

    /* Hide default HTML checkbox */
    .switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    /* The slider */
    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: var(--disabled-color);
        -webkit-transition: 0.4s;
        transition: 0.4s;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 1.3rem;
        width: 1.3rem;
        left: 0.1rem;
        bottom: 0.1rem;
        background-color: white;
        -webkit-transition: 0.4s;
        transition: 0.4s;
    }

    input:checked + .slider {
        background-color: var(--success-color);
    }

    input:focus + .slider {
        box-shadow: 0 0 1px var(--success-color);
    }

    input:checked + .slider:before {
        -webkit-transform: translateX(1.5rem);
        -ms-transform: translateX(1.5rem);
        transform: translateX(1.5rem);
    }

    /* Rounded sliders */
    .slider.round {
        border-radius: 1rem;
    }

    .slider.round:before {
        border-radius: 50%;
    }
</style>
