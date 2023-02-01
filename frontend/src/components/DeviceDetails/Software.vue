<template>
    <tr class="updateContainer">
        <td>{{ software?.name ?? "" }}</td>
        <td>{{ software?.currentVersion ?? "" }}</td>
        <td>{{ software?.newVersion }}</td>
        <td><button @click="promote"><img src="@/assets/star-svgrepo-com.svg" style="width:2ch; display: block;"/></button></td>
    </tr>
</template>

<script lang="ts">
    import { Options, Vue } from "vue-class-component"
    import { IDeviceSoftware } from "server_mgt-lib/types"

    @Options({
        props: {
            software: Object
        },
        components: {},
        emits: ["promote"]
    })
    export default class Software extends Vue {
        software: IDeviceSoftware | undefined = undefined

        promote(){
            this.$emit("promote", this.software)
        }
    }
</script>

<style></style>
