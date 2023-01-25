<template>
    <h1>Groupmanagement</h1>
    <div class="highlightContainer">
        <label>Show usergroups</label>
        <Toggle
            style="margin: 1ch"
            @toggleChange="onShowUserGroupsChange"
            :initialValue="showAllGroups" />
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

<script lang="ts">
    import { Options, Vue } from "vue-class-component"
    import * as adminRequests from "@/helper/adminRequests"
    import * as management from "server_mgt-lib/management/responses"
    import Toggle from "@/components/Toggle.vue"
    import GroupRow from "@/components/admin/GroupRow.vue"
    import { IUser } from "server_mgt-lib/types"

    @Options({
        props: {
            user: Object
        },
        components: {
            Toggle,
            GroupRow
        }
    })
    export default class GroupManagement extends Vue {
        groups: management.AllDeviceResponse = {
            groups: [],
            notUserGroupGroups: []
        }

        showAllGroups = false
        user?: IUser = undefined

        async created() {
            this.groups = (await adminRequests.getAllGroups()) ?? {
                groups: [],
                notUserGroupGroups: []
            }

            this.$forceUpdate()
        }

        onShowUserGroupsChange(newValue: boolean) {
            this.showAllGroups = newValue
        }
    }
</script>
