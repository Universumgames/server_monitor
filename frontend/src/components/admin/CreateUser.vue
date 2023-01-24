<template>
    <div>
        <h2>User creation container</h2>
        <button @click="cancel" class="delete">Cancel</button>
        <button @click="createUser" class="create">Create</button>
    </div>
</template>

<script lang="ts">
    import { IUser } from "server_mgt-lib/types"
    import { Options, Vue } from "vue-class-component"

    @Options({
        emits: ["createUser", "cancel"]
    })
    export default class CreateUser extends Vue {
        username: string = ""
        email: string = ""

        created() {}

        createUser() {
            this.$emit("createUser", {
                username: this.username,
                email: this.email
            } as IUser)
        }

        cancel() {
            this.$emit("cancel")
        }
    }
</script>
