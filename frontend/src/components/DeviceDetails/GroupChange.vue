<template>
    <select v-model="selectedGroupId" :disabled="!enabled" @change="onChange">
        <option :value="device?.group.id">{{ device?.group.name }}</option>
        <option v-for="group in groups" :value="group.id" :key="group.id">
            {{ group.name }}
        </option>
    </select>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { type IDevice, type IGroup } from "server_mgt-lib/types"
import * as requests from "../../helper/requests"
import * as responses from "server_mgt-lib/responses"

const props = defineProps<{
    device: IDevice,
    enabled: boolean
}>()

const groups = ref<responses.BasicGroupResponse[]>([])
const allGroups = ref<responses.BasicGroupResponse[]>([])
const selectedGroupId = ref<string>("")
const selectedGroup = ref<IGroup | undefined>(undefined)

onMounted(async () => {
    allGroups.value = (await requests.getAvailableGroups())?.groups ?? []
    groups.value = allGroups.value.filter((group) => group.id != props.device.group.id)
    selectedGroupId.value = props.device.group.id ?? ""
    selectedGroup.value = props.device.group
})

watch(selectedGroupId, async (newGroupId) => {
    if (newGroupId !== props.device.group.id) {
        await requests.editDevice(props.device.id, {
            deviceId: props.device.id,
            newGroupId: newGroupId
        })
    }
})
</script>
