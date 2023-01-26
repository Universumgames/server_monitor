<template>
    <tr class="updateContainer">
        <td>{{ software?.name ?? "" }}</td>
        <td>{{ software?.currentVersion ?? "" }}</td>
        <td>{{ software?.newVersion }}</td>
    </tr>
</template>

<script lang="ts">
    import { Options, Vue } from "vue-class-component"
    import { IDeviceSoftware } from "server_mgt-lib/types"

    @Options({
        props: {
            software: Object
        },
        components: {}
    })
    export default class Software extends Vue {
        software: IDeviceSoftware | undefined = undefined
    }
</script>

<style></style>
