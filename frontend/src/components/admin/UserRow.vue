<template>
    <div class="slimHighlightContainer">
        <div class="userRow">
            <div class="userRowUsername">{{ user?.username }}</div>
            <div class="userRowEmail">{{ user?.email }}</div>
            <div class="userRowAdmin">{{ user?.admin ? "Admin" : "User" }}</div>
            <div>
                <label @click="showGroups = !showGroups" style="cursor: pointer">Groups: {{ user?.groups.length
                    }}</label>
                <div v-show="showGroups">
                    <div v-for="group in user?.groups" :key="group.id">{{ group.name }}</div>
                </div>
            </div>

            <div class="userRowDelete">
                <button class="delete" @click="deleteUser()">Delete</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { defineEmits } from 'vue'
import { type IUser } from "server_mgt-lib/types"
import * as adminRequests from "../../helper/adminRequests"

const props = defineProps<{ user: IUser }>()
const emit = defineEmits(['deleteUser'])

const detailedUser = ref<IUser | undefined>(undefined)
const showGroups = ref<boolean>(false)

onMounted(async () => {
    detailedUser.value = await adminRequests.getUser(props.user.id)
    console.log(detailedUser.value)
})

const deleteUser = async () => {
    if (!confirm("Are you sure you want to delete this user?")) return
    const response = await adminRequests.editUser({
        userId: props.user.id,
        delete: true
    })
    if (response != undefined) {
        emit("deleteUser", props.user)
    }
}
</script>

<style>
.userRow {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
}
</style>
