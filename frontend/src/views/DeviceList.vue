<template>
    <div>
        <h1>Devices</h1>
        <LoadingScreen v-show="loading" />
        <div id="deviceOverviewContainer" v-for="device in devices" :key="device.id">
            <DeviceOverview :deviceName="device.name" :deviceId="device.id" />
        </div>
    </div>
</template>

<script lang="ts">
    import { Options, Vue } from "vue-class-component"
    import { getDevices } from "@/helper/requests"
    import { IDevice } from "server_mgt-lib/types"
    import DeviceOverview from "../components/DeviceOverview.vue"
    import LoadingScreen from "../components/LoadingScreen.vue"

    @Options({
        components: {
            DeviceOverview,
            LoadingScreen
        }
    })
    export default class DeviceList extends Vue {
        devices: IDevice[] = []
        loading: boolean = true

        async created() {
            this.devices = await getDevices()
            if (this.devices.length > 0) {
                this.loading = false
            }
        }
    }
</script>

<style>
    #deviceOverviewContainer {
        display: flex;
    }
</style>
