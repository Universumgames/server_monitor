<template>
    <div v-show="deviceID == ''">No device selected</div>
    <DeviceOverview :deviceId="deviceID" />
</template>

<script lang="ts">
    import { loginOrRequestMail } from "@/helper/requests"
    import { IUser } from "server_mgt-lib/types"
    import { Options, Vue } from "vue-class-component"
    import DeviceOverview from "../components/DeviceOverview.vue"
    import LoadingScreen from "../components/LoadingScreen.vue"

    @Options({
        components: {
            DeviceOverview,
            LoadingScreen
        },
        props: {
            user: Object
        }
    })
    export default class DeviceOverviewStandalone extends Vue {
        deviceID: string = ""
        loginToken: string = ""
        user?: IUser = undefined

        async created() {
            this.deviceID = this.$route.params.id as string
            this.loginToken = this.$route.params.token as string

            if (this.loginToken != "" && this.loginToken != undefined && this.user == undefined) {
                await loginOrRequestMail({
                    token: this.loginToken
                })
                window.location.reload()
            }
        }
    }
</script>

<style>
    #deviceOverviewContainer {
        display: flex;
    }
</style>
