<template>
    <div v-show="deviceID == ''">No device selected</div>
    <DeviceOverview :deviceId="deviceID" />
</template>

<script lang="ts">
    import { Options, Vue } from "vue-class-component"
    import DeviceOverview from "../components/DeviceOverview.vue"
    import LoadingScreen from "../components/LoadingScreen.vue"

    @Options({
        components: {
            DeviceOverview,
            LoadingScreen
        }
    })
    export default class DeviceOverviewStandalone extends Vue {
        deviceID: string = ""

        async created() {
            this.deviceID = this.$route.params.id as string
        }
    }
</script>

<style>
    #deviceOverviewContainer {
        display: flex;
    }
</style>
