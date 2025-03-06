<template>
    <h1>Groupmanagement</h1>
    <div class="highlightContainer">
        <label>Show usergroups</label>
        <Toggle style="margin: 1ch" @toggleChange="onShowUserGroupsChange" :initialValue="showAllGroups" />
    </div>
    <div>
        <div v-show="showAllGroups">
            <h2 v-show="groups.groups.length == 0">Something's wrong</h2>
            <GroupRow v-for="group in groups.groups" :key="group.id" :group="group" />
        </div>
        <div v-show="!showAllGroups">
            <h2 v-show="groups.notUserGroupGroups.length == 0">No other groups available</h2>
            <GroupRow v-for="group in groups.notUserGroupGroups" :key="group.id" :group="group" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as adminRequests from "../../helper/adminRequests"
import * as management from "server_mgt-lib/management/responses"
import Toggle from "../../components/Toggle.vue"
import GroupRow from "../../components/admin/GroupRow.vue"
import { type IUser } from "server_mgt-lib/types"

const props = defineProps<{ user: IUser }>()

const groups = ref<management.AllGroupsResponse>({
    groups: [],
    notUserGroupGroups: []
})

const showAllGroups = ref<boolean>(false)
const user = ref<IUser | undefined>(props.user)

const getAllGroups = async () => {
    groups.value = (await adminRequests.getAllGroups()) ?? {
        groups: [],
        notUserGroupGroups: []
    }
}

const onShowUserGroupsChange = (newValue: boolean) => {
    showAllGroups.value = newValue
}

onMounted(async () => {
    await getAllGroups()
})
</script>
