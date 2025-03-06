<template>
    <div>
        <h2>User creation container</h2>
        <input v-model="username" placeholder="Username" />
        <input v-model="email" placeholder="E-Mail" />
        <button @click="cancel" class="delete">Cancel</button>
        <button @click="createUser" class="create">Create</button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { type IUser } from "server_mgt-lib/types"
import { defineEmits } from 'vue'

const emit = defineEmits(['createUser', 'cancel'])

const username = ref<string>("")
const email = ref<string>("")

const createUser = () => {
    emit('createUser', {
        username: username.value,
        email: email.value
    } as IUser)
}

const cancel = () => {
    emit('cancel')
}
</script>
