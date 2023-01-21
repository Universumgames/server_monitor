<template>
    <div>
        <h1>Devices</h1>
        <div>
            <LoadingScreen v-show="loading" />
            <div v-show="devices.length == 0 && !loading && !error">No devices found</div>
            <h2 v-show="error">An error ocurred retrieving devices</h2>
        </div>

        <div id="deviceOverviewContainer">
            <BlankDeviceOverview v-show="(loading && !error) || true" v-for="i in 10" :key="i" />
            <DeviceOverview v-for="deviceID in devices" :key="deviceID" :deviceId="deviceID" />
        </div>
    </div>
</template>

<script lang="ts">
    import { Options, Vue } from "vue-class-component"
    import { getDeviceIDs } from "@/helper/requests"
    import DeviceOverview from "../components/DeviceOverview.vue"
    import LoadingScreen from "../components/LoadingScreen.vue"
    import BlankDeviceOverview from "@/components/Blanks/BlankDeviceOverview.vue"

    @Options({
        components: {
            DeviceOverview,
            LoadingScreen,
            BlankDeviceOverview
        }
    })
    export default class DeviceList extends Vue {
        devices: string[] = []
        loading: boolean = true
        error: boolean = false

        async created() {
            this.loadData()
        }

        async loadData() {
            const startTime = Date.now()
            const devices = await getDeviceIDs()
            const diff = Date.now() - startTime
            if (diff < 1000) {
                await new Promise((resolve) => setTimeout(resolve, 1000 - diff))
            }
            this.loading = false
            this.error = devices == undefined
            this.devices = devices ?? []

            if (this.error) {
                setTimeout(() => {
                    this.loadData()
                }, 1000 * 10)
            }
        }
    }
</script>

<style>
    #deviceOverviewContainer {
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        gap: 1ch;
    }

    #deviceOverviewContainer > * {
        flex: 1 1 26ch;
        width: fit-content;
    }
</style>
