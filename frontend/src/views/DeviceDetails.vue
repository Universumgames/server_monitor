<template>
    <div class="deviceDetailContainer">
        <h1>
            <label @click="editName">Details of {{ device?.name ?? "loading" }}</label>
            <StatusIndicator
                :style="'background-color:' + statusColor"
                :tooltip="getStatusTooltip()" />
        </h1>
        <div class="deviceDetailContent">
            <div class="simpleData">
                <small>UUID: {{ device?.id ?? "" }}</small>

                <label>Uptime: ~{{ uptime }}</label>
                <label>Last seen: ~{{ lastSeenDiff }} ago</label>
                <label>Updates: {{ updateCount }}</label>
                <label
                    >Group: <GroupChange :device="device" :enabled="user?.id == device?.owner.id"
                /></label>
                <label>Owner: {{ device?.owner.username }}</label>
            </div>
            <div class="systemloadContainer">
                <h2>Load average</h2>
                <div>
                    <label>1 min: {{ device?.status.cpuUsage.avg1m ?? "" }}</label>
                    <label>5 min: {{ device?.status.cpuUsage.avg5m ?? "" }}</label>
                    <label>15 min: {{ device?.status.cpuUsage.avg15m ?? "" }}</label>
                </div>
            </div>
            <div class="softwareListContainer">
                <h2>Software</h2>

                <div class="monitoredUpdateContainer">
                    <MonitoredSoftware
                        v-for="software of watchSoftware"
                        :key="software.id"
                        :software="software"
                        @demote="demoteSoftware"
                        @editImage="editImage" />
                </div>
                <h2>Systemupdates</h2>
                <table class="updateTable">
                    <tr>
                        <th>Name</th>
                        <th>Version</th>
                        <th>Update</th>
                        <th></th>
                    </tr>
                    <Software
                        v-for="software of systemUpdates"
                        :key="software.id"
                        :software="software"
                        @promote="promoteSoftware"/>
                </table>
            </div>
            <div class="ipContainer">
                <h2>IP Addresses</h2>
                <table class="ipTable">
                    <tr>
                        <th>IP</th>
                        <th>Interface</th>
                    </tr>
                    <tr v-for="ip of device?.status.ipAddresses" :key="ip.ip">
                        <td>{{ ip.ip }}</td>
                        <td>{{ ip.interface != "" ? ip.interface : "-" }}</td>
                    </tr>
                </table>
            </div>
            <div class="deleteContainer">
                <button
                    :class="device?.owner.id == user?.id ? 'delete' : 'btn-disabled'"
                    @click="deleteDevice()">
                    Delete device
                </button>
                <button v-show="user?.admin" class="delete" @click="deleteDeviceAdmin()">
                    Delete device admin
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Options, Vue } from "vue-class-component"
    import { getDeviceDetails } from "@/helper/requests"
    import { IDevice, IDeviceSoftware, ISystemIP, IUser } from "server_mgt-lib/types"
    import { getStatusIndicatorColor } from "@/helper/statusIndicator"
    import StatusIndicator from "@/components/StatusIndicator.vue"
    import Software from "@/components/DeviceDetails/Software.vue"
    import MonitoredSoftware from "@/components/DeviceDetails/MonitoredSoftware.vue"
    import * as requests from "@/helper/requests"
    import * as adminRequests from "@/helper/adminRequests"
    import GroupChange from "@/components/DeviceDetails/GroupChange.vue"

    @Options({
        props: {
            user: Object
        },
        components: {
            StatusIndicator,
            Software,
            MonitoredSoftware,
            GroupChange
        }
    })
    export default class DeviceDetails extends Vue {
        device: IDevice | undefined = undefined
        user?: IUser

        systemUpdates: IDeviceSoftware[] = []
        watchSoftware: IDeviceSoftware[] = []
        ipAddresses: ISystemIP[] = []

        uptime = ""
        lastSeenDiff = ""
        statusColor = "var(--secondary-color)"
        updateCount = 0

        async created() {
            await this.getData()
        }

        async getData() {
            try{
                this.device = await getDeviceDetails(this.$route.params.id as string)

                this.systemUpdates =
                    this.device?.software.filter((update) => update.isSystemUpdate) ?? []
                // sort updates by name
                this.systemUpdates = this.systemUpdates.sort((a, b) => {
                    if (a.name < b.name) return -1
                    if (a.name > b.name) return 1
                    return 0
                })

                this.watchSoftware =
                    this.device?.software.filter((update) => !update.isSystemUpdate) ?? []
                // sort updates by name
                this.watchSoftware = this.watchSoftware.sort((a, b) => {
                    if (a.name < b.name) return -1
                    if (a.name > b.name) return 1
                    return 0
                })

                this.ipAddresses = this.device?.status?.ipAddresses ?? []
                // sort ips by type, ipv4 first
                this.ipAddresses = this.ipAddresses.sort((a, b) => {
                    if (a.ip.includes(":") && !b.ip.includes(":")) return 1
                    if (!a.ip.includes(":") && b.ip.includes(":")) return -1
                    return 0
                })

                this.uptime = this.getUptimeString()
                this.lastSeenDiff = this.getLastSeenDiff()
                this.statusColor = this.device != undefined ? getStatusIndicatorColor(this.device) : "var(--secondary-color)"
                this.updateCount =
                    this.device?.software.filter((update) => update.currentVersion != update.newVersion)
                        .length ?? 0

                this.$forceUpdate()
            }catch(e){
                console.warn(e)
            }

            if(this.$route.params.id == undefined) return
            setTimeout(() => {
                this.getData()
            }, 1000 * 10)
        }

        getLastSeenDiff() {
            const diffSec =
                (new Date().getTime() - new Date(this.device?.lastSeen ?? 0).getTime()) / 1000

            if (diffSec < 200) return diffSec.toFixed(0) + " seconds"
            const diffMin = diffSec / 60
            if (diffMin < 120) return diffMin.toFixed(0) + " minutes"
            const diffHour = diffMin / 60
            if (diffHour < 48) return diffHour.toFixed(0) + " hours"
            const diffDay = diffHour / 24
            return diffDay.toFixed(0) + " days"
        }

        getUptimeString(): string {
            const uptimeSec = this.device?.status?.uptimeSeconds ?? 0
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
                (this.device?.state ?? "Unknown state") +
                " \n" +
                this.uptime +
                " up \n" +
                this.updateCount +
                " Updates available"
            )
        }

        async deleteDevice() {
            if (this.device?.owner.id != this.user?.id)
                return alert("You are not the owner of this device")
            if (confirm("Are you sure you want to delete this device?")) {
                await requests.editDevice(this.device?.id ?? "", {
                    deviceId: this.device?.id ?? "",
                    delete: true
                })
            }
        }

        async deleteDeviceAdmin() {
            if (confirm("Are you sure you want to delete this device?")) {
                await adminRequests.editDevice({
                    deviceId: this.device?.id ?? "",
                    edits: {
                        deviceId: this.device?.id ?? "",
                        delete: true
                    }
                })
            }
        }

        async promoteSoftware(software: IDeviceSoftware){
            const imageURL = prompt("Please enter the image URL")
            await requests.promoteSoftware({
                deviceId: this.device?.id ?? "",
                id: software.id,
                imageURL: imageURL ?? undefined,
                promote: true,
            })
            await this.getData()
        }

        async demoteSoftware(s: IDeviceSoftware){
            await requests.promoteSoftware({
                deviceId: this.device?.id ?? "",
                id: s.id,
                promote: false,
            })
            await this.getData()
        }

        async editImage(s: IDeviceSoftware){
            const imageURL = prompt("Please enter the image URL")
            await requests.promoteSoftware({
                deviceId: this.device?.id ?? "",
                id: s.id,
                imageURL: imageURL ?? undefined,
                promote: true,
            })
            await this.getData()
        }


        async editName(){
            const name = prompt("Please enter the new name")
            if(name == null) return
            await requests.editDevice(this.device?.id ?? "", {
                deviceId: this.device?.id ?? "",
                newDeviceName: name
            })
            await this.getData()
        }
    }
</script>

<style>
    .deviceDetailContainer {
    }

    .deviceDetailContainer > h1 {
        position: sticky;
        top: 0;
        background-color: var(--bg-color);
        padding: 0.5rem;
        margin: 0.3rem;
        z-index: 200;
    }

    .deviceDetailContent > * {
        background: var(--secondary-color);
        padding: 0.5rem;
        border-radius: 1ch;
        margin: 0.5rem;
        display: block;
    }

    .deviceDetailContent {
        border-radius: 1rem;
    }

    .deviceDetailContent > .simpleData {
    }
    .deviceDetailContent > .simpleData > * {
        display: block;
        margin: 0.5rem;

        text-align: left;
    }

    .softwareListContainer {
        overflow-x: hidden;
    }

    .monitoredUpdateContainer {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        gap: 1ch;
    }

    .monitoredUpdateContainer > * {
        flex: 1 1 26ch;
        width: fit-content;
    }

    .updateTable {
        width: 100%;
        border-collapse: collapse;
        overflow-x: scroll;
        display: table;
    }

    .updateTable table,
    .updateTable th,
    .updateTable td {
        border: 1px solid var(--bg-color);
    }

    .systemloadContainer > div {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
    }

    .ipContainer > * {
        display: block;
    }

    .ipTable {
        width: 100%;
        border-collapse: collapse;
        overflow-x: scroll;
        display: table;
    }

    .ipTable table,
    .ipTable th,
    .ipTable td {
        border: 1px solid var(--bg-color);
    }
</style>
