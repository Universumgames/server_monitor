<template>
    <div class="deviceOverviewContainer" @click="routeToDetails">
        <div v-if="loading || error" class="emptyContainer">
            <BlankDeviceOverview />
        </div>
        <div v-else>
            <h3>
                {{ basicDevice?.name ?? "Unknown device" }}
                <StatusIndicator :style="'background-color:' + statusColor" :tooltip="tooltip" />
            </h3>
            <small>{{ basicDevice?.id ?? deviceId }}</small><br />
            <small>Powerstate: {{ basicDevice?.state ?? "" }}</small><br />
            <small>Last contact ~{{ lastSeenDiff }} ago</small><br />
            <small>Uptime: ~{{ uptime }}</small><br />
            <small>Software updates: {{ updateCount }}</small>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { type IDevice, type IDeviceSoftware, type ISystemStatus } from "server_mgt-lib/types"
import { getSystemStatus, getBasicDevice, getSoftware } from "../helper/requests"
import { getStatusIndicatorColor } from "../helper/statusIndicator"
import StatusIndicator from "./StatusIndicator.vue"
import BlankDeviceOverview from "./Blanks/BlankDeviceOverview.vue"

const props = defineProps<{
    deviceId: string
}>()

const router = useRouter()

const basicDevice = ref<IDevice | undefined>(undefined)
const systemStatus = ref<ISystemStatus | undefined>(undefined)
const softwareUpdates = ref<IDeviceSoftware[] | undefined>(undefined)

const loading = ref<boolean>(true)
const error = ref<boolean>(false)

const uptime = ref<string>("")
const lastSeenDiff = ref<string>("")
const statusColor = ref<string>("var(--secondary-color)")
const updateCount = ref<number>(0)
const tooltip = ref<string>("")

let currentIntervalId: number | undefined

const getData = async () => {
    basicDevice.value = await getBasicDevice(props.deviceId)
    systemStatus.value = await getSystemStatus(props.deviceId)
    softwareUpdates.value = await getSoftware(props.deviceId)
    uptime.value = getUptimeString()
    lastSeenDiff.value = getLastSeenDiff()
    statusColor.value = basicDevice.value == undefined ? "gray" : getStatusIndicatorColor(basicDevice.value)
    updateCount.value = softwareUpdates.value == undefined ? 0 : softwareUpdates.value.filter((update: IDeviceSoftware) => update.currentVersion != update.newVersion).length
    tooltip.value = getStatusTooltip()

    error.value = basicDevice.value == undefined
}

const getLastSeenDiff = () => {
    const diffSec = (new Date().getTime() - new Date(basicDevice.value?.lastSeen ?? 0).getTime()) / 1000

    if (diffSec < 200) return diffSec.toFixed(0) + " seconds"
    const diffMin = diffSec / 60
    if (diffMin < 120) return diffMin.toFixed(0) + " minutes"
    const diffHour = diffMin / 60
    if (diffHour < 48) return diffHour.toFixed(0) + " hours"
    const diffDay = diffHour / 24
    return diffDay.toFixed(0) + " days"
}

const getUptimeString = (): string => {
    const uptimeSec = systemStatus.value?.uptimeSeconds ?? 0
    if (uptimeSec < 200) return uptimeSec.toFixed(0) + " seconds"
    const uptimeMin = uptimeSec / 60
    if (uptimeMin < 120) return uptimeMin.toFixed(0) + " minutes"
    const uptimeHour = uptimeMin / 60
    if (uptimeHour < 48) return uptimeHour.toFixed(0) + " hours"
    const uptimeDay = uptimeHour / 24
    return uptimeDay.toFixed(0) + " days"
}

const getStatusTooltip = () => {
    return (
        (basicDevice.value?.state ?? "Unknown state") +
        " \n" +
        uptime.value +
        " up \n" +
        updateCount.value +
        " Updates available"
    )
}

const routeToDetails = () => {
    router.push({ name: "DeviceDetails", params: { id: props.deviceId } })
}

onMounted(async () => {
    await getData()

    currentIntervalId = setInterval(async () => {
        await getData()
    }, 1000 * 10)

    loading.value = false
})

onUnmounted(() => {
    if (currentIntervalId != undefined) {
        clearInterval(currentIntervalId)
    }
})
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
