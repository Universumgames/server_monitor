<template>
    <div v-show="deviceID == ''">No device selected</div>
    <DeviceOverview :deviceId="deviceID" />
</template>

<script lang="ts" setup>
import { loginOrRequestMail } from "../helper/requests"
import DeviceOverview from "../components/DeviceOverview.vue"
import { ref } from "vue";
import { useRoute } from "vue-router";
import { onMounted } from "vue";

const deviceID = ref<string>("")
const loginToken = ref<string>("")

const route = useRoute()

onMounted(async () => {
    deviceID.value = route.params.id as string
    loginToken.value = route.params.token as string

    if (loginToken.value !== "" && loginToken.value !== undefined) {
        await loginOrRequestMail({
            token: loginToken.value
        })
        window.location.reload()
    }
})
</script>

<style>
#deviceOverviewContainer {
    display: flex;
}
</style>
