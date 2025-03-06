<template>
    <h1>Groups <button @click="createGroup">+</button></h1>
    <div>
        <div v-for="group of groups" :key="group.id" class="highlightContainer groupRow">
            <label>{{ group.name }}</label>
            <label>UUID: {{ group.id }}</label>
            <button :class="isEditable(group) ? '' : 'btn-disabled'" @click="editGroup(group)">
                Edit
            </button>
            <button :class="(isEditable(group) ? '' : 'btn-disabled') + ' delete'" @click="deleteGroup(group)">
                Delete
            </button>
        </div>

        <popup v-if="$route.name != 'Groups'">
            <router-view :user="user" />
        </popup>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { type IGroup, type IUser } from "server_mgt-lib/types"
import * as requests from "../helper/requests"
import * as responses from "server_mgt-lib/responses"
import Popup from "../components/Popup.vue"

onMounted(async () => {
    await getData()
})

const props = defineProps<{ user: IUser }>()

const user = ref<IUser | undefined>(props.user)
const groups = ref<responses.BasicGroupResponse[]>([])
const userGroup = ref<IGroup | undefined>(undefined)

const router = useRouter()
const route = useRoute()

const getData = async () => {
    userGroup.value = await requests.getUserGroup()
    groups.value = (await requests.getAvailableGroups())?.groups ?? []
}

const isEditable = (group: responses.BasicGroupResponse): boolean => {
    return (
        group.id !== userGroup.value?.id &&
        ((user.value?.admin ?? false) || group.ownerId === user.value?.id)
    )
}

const deleteGroup = async (group: responses.BasicGroupResponse) => {
    if (isEditable(group) && confirm("Do you really want to delete this group?")) {
        const response = await requests.deleteGroup(group.id)
        if (!response) alert("Could not delete group, maybe you are not the owner?")
        await getData()
    }
}

const editGroup = (group: responses.BasicGroupResponse) => {
    if (isEditable(group)) {
        router.push({ name: "GroupDetails", params: { id: group.id } })
    }
}

const createGroup = async () => {
    const name = prompt("Please enter a name for the new group")
    if (name == null) return
    await requests.createGroup(name)
    await getData()
}
</script>

<style>
.groupRow {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: 1ch;
}

.groupRow>label {
    margin: auto;
}
</style>
