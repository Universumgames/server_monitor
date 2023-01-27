<template>
    <h1>Groups</h1>
    <div>
        <div v-for="group of groups" :key="group.id" class="highlightContainer groupRow">
            <label>{{ group.name }}</label>
            <label>UUID: {{ group.id }}</label>
            <button :class="isEditable(group) ? '' : 'btn-disabled'" @click="editGroup(group)">
                Edit
            </button>
            <button
                :class="(isEditable(group) ? '' : 'btn-disabled') + ' delete'"
                @click="deleteGroup(group)">
                Delete
            </button>
        </div>

        <popup v-if="$route.name != 'Groups'">
            <router-view :user="user" />
        </popup>
    </div>
</template>

<script lang="ts">
    import { IGroup, IUser } from "server_mgt-lib/types"
    import { Options, Vue } from "vue-class-component"
    import * as requests from "@/helper/requests"
    import Popup from "@/components/Popup.vue"

    @Options({
        props: {
            user: Object
        },
        components: {
            Popup
        }
    })
    export default class Grouplist extends Vue {
        user?: IUser = undefined

        groups: IGroup[] = []
        userGroup: IGroup | undefined = undefined

        async created() {
            await this.getData()
        }

        async getData() {
            this.userGroup = await requests.getUserGroup()

            this.groups = (await requests.getAvailableGroups()) ?? []
            this.$forceUpdate()
        }

        isEditable(group: IGroup): boolean {
            return group.id != this.userGroup?.id
        }

        async deleteGroup(group: IGroup) {
            if (this.isEditable(group) && confirm("Do you really want to delete this group?")) {
                // TODO implement group deletion
                await this.getData()
            }
        }

        editGroup(group: IGroup) {
            if (this.isEditable(group) || true == true) {
                this.$router.push({ name: "GroupDetails", params: { id: group.id } })
            }
        }
    }
</script>

<style>
    .groupRow {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    .groupRow > label {
        margin: auto;
    }
</style>
