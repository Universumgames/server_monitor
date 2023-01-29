<template>
    <select v-model="selectedGroupId" :disabled="!enabled" @change="onChange">
        <option :value="device?.group.id">{{ device?.group.name }}</option>
        <option v-for="group in groups" :value="group.id" :key="group.id">
            {{ group.name }}
        </option>
    </select>
</template>

<script lang="ts">
    import { IDevice, IGroup } from "server_mgt-lib/types"
    import { Options, Vue } from "vue-class-component"
    import * as requests from "@/helper/requests"

    @Options({
        props: {
            device: Object,
            enabled: Boolean
        }
    })
    export default class GroupChange extends Vue {
        device?: IDevice = undefined
        groups: IGroup[] = []
        allGroups: IGroup[] = []
        enabled = false

        selectedGroupId: string = ""
        selectedGroup: IGroup | undefined = undefined

        async mounted() {
            this.allGroups = (await requests.getAvailableGroups()) ?? []
            this.groups = this.allGroups.filter((group) => group.id != this.device?.group.id)
            this.selectedGroupId = this.device?.group.id ?? ""
            this.selectedGroup = this.device?.group
        }

        async onChange() {
            await requests.editDevice(this.device?.id ?? "", {
                deviceId: this.device?.id ?? "",
                newGroupId: this.selectedGroupId
            })
        }
    }
</script>
