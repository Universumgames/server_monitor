<template>
    <h1>Groups <button @click="createGroup">+</button></h1>
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
    import * as responses from "server_mgt-lib/responses"
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

        groups: responses.BasicGroupResponse[] = []
        userGroup: IGroup | undefined = undefined

        async created() {
            await this.getData()
        }

        async getData() {
            this.userGroup = await requests.getUserGroup()

            this.groups = (await requests.getAvailableGroups())?.groups ?? []
            this.$forceUpdate()
        }

        isEditable(group: responses.BasicGroupResponse): boolean {
            return (
                group.id != this.userGroup?.id &&
                ((this.user?.admin ?? false) || group.ownerId == this.user?.id)
            )
        }

        async deleteGroup(group: responses.BasicGroupResponse) {
            if (this.isEditable(group) && confirm("Do you really want to delete this group?")) {
                const response = await requests.deleteGroup(group.id)
                if (!response) alert("Could not delete group, maybe you are not the owner?")
                await this.getData()
            }
        }

        editGroup(group: responses.BasicGroupResponse) {
            if (this.isEditable(group)) {
                this.$router.push({ name: "GroupDetails", params: { id: group.id } })
            }
        }

        async createGroup() {
            const name = prompt("Please enter a name for the new group")
            if (name == null) return
            await requests.createGroup(name)
            await this.getData()
        }
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

    .groupRow > label {
        margin: auto;
    }
</style>
