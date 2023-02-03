<template>
    <div class="deviceOverviewContainer" @click="routeToDetails">
        <div v-if="loading || error" class="emptyContainer">
            <BlankDeviceOverview />
        </div>
        <div v-else>
            <h3>
                {{ basicDevice?.name ?? deviceName }}
                <StatusIndicator
                    :style="'background-color:' + statusColor"
                    :tooltip="getStatusTooltip()" />
            </h3>
            <small>{{ basicDevice?.id ?? deviceId }}</small
            ><br />
            <small>Powerstate: {{ basicDevice?.state ?? "" }}</small
            ><br />
            <small>Last contact ~{{ lastSeenDiff }} ago</small><br />
            <small>Uptime: ~{{ uptime }}</small
            ><br />
            <small>Software updates: {{ updateCount }}</small>
        </div>
    </div>
</template>

<script lang="ts">
    import { IDevice, IDeviceSoftware, ISystemStatus } from "server_mgt-lib/types"
    import { Options, Vue } from "vue-class-component"
    import { getSystemStatus, getBasicDevice, getSoftware } from "@/helper/requests"
    import StatusIndicator from "@/components/StatusIndicator.vue"
    import { getStatusIndicatorColor } from "@/helper/statusIndicator"
    import BlankDeviceOverview from "./Blanks/BlankDeviceOverview.vue"

    @Options({
        props: {
            deviceName: String,
            deviceId: String
        },
        components: {
            StatusIndicator,
            BlankDeviceOverview
        }
    })
    export default class DeviceOverview extends Vue {
        deviceName?: string
        deviceId!: string
        basicDevice?: IDevice
        systemStatus?: ISystemStatus
        softwareUpdates?: IDeviceSoftware[]

        loading: boolean = true
        error: boolean = false

        uptime = ""
        lastSeenDiff = ""
        statusColor = "var(--secondary-color)"
        updateCount = 0

        currentIntervalId?: number

        async mounted() {
            this.getData()

            this.currentIntervalId = setInterval(() => {
                this.getData()
                this.$forceUpdate()
            }, 1000 * 10)

            this.loading = false

            this.$forceUpdate()
        }

        unmounted() {
            if (this.currentIntervalId != undefined) {
                clearInterval(this.currentIntervalId)
            }
        }

        async getData() {
            this.basicDevice = await getBasicDevice(this.deviceId)
            this.systemStatus = await getSystemStatus(this.deviceId)
            this.softwareUpdates = await getSoftware(this.deviceId)
            this.uptime = this.getUptimeString()
            this.lastSeenDiff = this.getLastSeenDiff()
            this.statusColor =
                this.basicDevice == undefined ? "gray" : getStatusIndicatorColor(this.basicDevice)
            this.updateCount =
                this.softwareUpdates == undefined
                    ? 0
                    : this.softwareUpdates.filter(
                          (update) => update.currentVersion != update.newVersion
                      ).length

            if (this.basicDevice == undefined) {
                this.error = true
            }else {
                this.error = false
            }
        }

        getLastSeenDiff() {
            const diffSec =
                (new Date().getTime() - new Date(this.basicDevice?.lastSeen ?? 0).getTime()) / 1000

            if (diffSec < 200) return diffSec.toFixed(0) + " seconds"
            const diffMin = diffSec / 60
            if (diffMin < 120) return diffMin.toFixed(0) + " minutes"
            const diffHour = diffMin / 60
            if (diffHour < 48) return diffHour.toFixed(0) + " hours"
            const diffDay = diffHour / 24
            return diffDay.toFixed(0) + " days"
        }

        getUptimeString(): string {
            const uptimeSec = this.systemStatus?.uptimeSeconds ?? 0
            if (uptimeSec < 200) return uptimeSec.toFixed(0) + " seconds"
            const uptimeMin = uptimeSec / 60
            if (uptimeMin < 120) return uptimeMin.toFixed(0) + " minutes"
            const uptimeHour = uptimeMin / 60
            if (uptimeHour < 48) return uptimeHour.toFixed(0) + " hours"
            const uptimeDay = uptimeHour / 24
            return uptimeDay.toFixed(0) + " days"
        }

        getStatusTooltip() {
            return (
                (this.basicDevice?.state ?? "Unknown state") +
                " \n" +
                this.uptime +
                " up \n" +
                this.updateCount +
                " Updates available"
            )
        }

        routeToDetails() {
            this.$router.push({ name: "DeviceDetails", params: { id: this.deviceId } })
        }
    }
</script>

<style>
    .deviceOverviewContainer {
        background-color: var(--secondary-color);
        border-radius: 1ch;
        padding: 1ch;
        text-align: left;
        cursor: pointer;
    }

    .deviceOverviewContainer h3 {
        margin: 0;
    }

    .deviceOverviewContainer small {
        color: var(--primary-color);
    }
</style>
