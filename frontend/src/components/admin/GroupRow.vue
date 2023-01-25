<template>
    <div class="highlightContainer" style="margin-top: 1ch">
        <div>{{ group?.name }}</div>
    </div>
</template>

<script lang="ts">
    import { IGroup } from "server_mgt-lib/types"
    import { Options, Vue } from "vue-class-component"

    @Options({
        props: {
            group: Object
        }
    })
    export default class GroupRow extends Vue {
        group?: IGroup = undefined

        created() {}
    }
</script>
