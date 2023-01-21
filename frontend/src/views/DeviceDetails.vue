<template>
    <div>
        <h1>Details</h1>
    </div>
</template>

<script lang="ts">
    import { Options, Vue } from "vue-class-component"
    import { getDevices } from "@/helper/requests"
    import { IDevice } from "server_mgt-lib/types"

    @Options({
        components: {}
    })
    export default class DeviceDetails extends Vue {
        devices: IDevice[] = []

        async created() {
            this.devices = (await getDevices()) ?? []
        }
    }
</script>

<style>
    #deviceOverviewContainer {
        display: flex;
    }
</style>
