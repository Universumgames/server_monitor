<template>
    <div class="deviceOverviewContainer emptyContainer">
        <h3>
            <StatusIndicator style="background-color: var(--bg-color)" />
        </h3>
        <small class="uuid"></small><br />
        <small class="pwstate"></small><br />
        <small class="contact"></small><br />
        <small class="uptime"></small><br />
        <small class="updates"></small>
    </div>
</template>

<script lang="ts">
    import { Options, Vue } from "vue-class-component"
    import StatusIndicator from "../StatusIndicator.vue"

    @Options({
        components: {
            StatusIndicator
        }
    })
    export default class BlankDeviceOverview extends Vue {
        async created() {}
    }
</script>

<style>
    .deviceOverviewContainer,
    .emptyContainer {
        position: relative;
    }
    .emptyContainer {
        width: 20ch;
    }

    .emptyContainer > *,
    .blank {
        content: "";
        background-color: var(--blank-text-color);
        height: 1em;
        border-radius: 0.5ch;
        display: inline-block;
    }

    .emptyContainer > h3 {
        width: 20ch;
        margin-right: 1ch;
    }

    .emptyContainer > small.uuid {
        width: 36ch;
    }
    .emptyContainer > small.pwstate {
        width: 25ch;
    }
    .emptyContainer > small.contact {
        width: 28ch;
    }
    .emptyContainer > small.uptime {
        width: 20ch;
    }
    .emptyContainer > small.updates {
        width: 22ch;
    }
</style>
