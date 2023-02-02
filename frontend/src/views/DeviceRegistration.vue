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

<script lang="ts">
    import { Options, Vue } from "vue-class-component"
    import * as requests from "@/helper/requests"
    import {
        CheckDeviceRegistrationResponse,
        CreateDeviceRegistrationResponse
    } from "server_mgt-lib/responses"

    @Options({})
    export default class DeviceRegistration extends Vue {
        existingDeviceToken: string = ""
        newDeviceToken?: CreateDeviceRegistrationResponse
        checkDeviceToken?: CheckDeviceRegistrationResponse

        async created() {
            this.existingDeviceToken = (this.$route.params.token as string) ?? ""

            if (this.existingDeviceToken == "") {
                this.newDeviceToken = await requests.createDeviceRegistrationToken()
                this.existingDeviceToken = this.newDeviceToken?.token ?? ""
                this.$router.replace({ params: { token: this.existingDeviceToken } })
            }
            await this.checkToken()
        }

        async checkToken() {
            this.checkDeviceToken = await requests.checkDeviceRegistrationToken(
                this.existingDeviceToken
            )
            console.log(this.checkDeviceToken)

            this.$forceUpdate()

            if (
                this.checkDeviceToken?.deviceId != undefined &&
                this.checkDeviceToken.deviceId != ""
            )
                return

            setTimeout(() => {
                this.checkToken()
            }, 1000 * 10)
        }
    }
</script>
