<template>
    <tr class="updateContainer">
        <td>{{ software?.name ?? "" }}</td>
        <td>{{ software?.currentVersion ?? "" }}</td>
        <td>{{ software?.newVersion }}</td>
        <td><button @click="promote"><img src="../../assets/star-svgrepo-com.svg"
                    style="width:2ch; display: block;" /></button></td>
    </tr>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue'
import { type IDeviceSoftware } from "server_mgt-lib/types"

const props = defineProps<{ software: IDeviceSoftware }>()
const emit = defineEmits(['promote'])

const promote = () => {
    emit('promote', props.software)
}
</script>

<style></style>
