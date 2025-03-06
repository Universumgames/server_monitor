<template>
    <h1>Register new Device</h1>
    <div>
        <div v-show="existingDeviceToken == '' || checkDeviceToken == undefined">
            <p>Creating new Device Registration Token...</p>
        </div>
        <div v-show="checkDeviceToken?.deviceId == undefined || checkDeviceToken.deviceId == ''">
            <p>Waiting for Device Registration...</p>
            <p>Token: {{ existingDeviceToken }}</p>
            <p>Expires: {{ checkDeviceToken?.expires }}</p>
        </div>
        <div v-show="checkDeviceToken?.deviceId != undefined && checkDeviceToken.deviceId != ''">
            <p>Device Registered!</p>
            <p>Device ID: {{ checkDeviceToken?.deviceId }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as requests from "../helper/requests"
import {
    type CheckDeviceRegistrationResponse,
    type CreateDeviceRegistrationResponse
} from "server_mgt-lib/responses"

const existingDeviceToken = ref<string>("")
const newDeviceToken = ref<CreateDeviceRegistrationResponse | undefined>()
const checkDeviceToken = ref<CheckDeviceRegistrationResponse | undefined>()

const route = useRoute()
const router = useRouter()

onMounted(async () => {
    existingDeviceToken.value = (route.params.token as string) ?? ""

    if (existingDeviceToken.value === "") {
        newDeviceToken.value = await requests.createDeviceRegistrationToken()
        existingDeviceToken.value = newDeviceToken.value?.token ?? ""
        router.replace({ params: { token: existingDeviceToken.value } })
    }
    await checkToken()
})

const checkToken = async () => {
    checkDeviceToken.value = await requests.checkDeviceRegistrationToken(existingDeviceToken.value)
    console.log(checkDeviceToken.value)

    if (checkDeviceToken.value?.deviceId === undefined || checkDeviceToken.value.deviceId === '') {
        setTimeout(checkToken, 1000 * 10)
    }
}
</script>
