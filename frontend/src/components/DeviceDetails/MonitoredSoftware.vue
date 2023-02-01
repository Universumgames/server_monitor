<template>
    <div class="highlight2Container monitoredSoftwareContainer">
        <img :src="software?.imageURL" class="monitoredSoftwareIcon" @click="editImage"/>
        <h2>{{ software?.name }}</h2> <label :style="'color:' + versionDifferenceColor">{{ versionDifference }}</label>
        <button @click="demote"><img src="@/assets/star-off-svgrepo-com.svg" style="width:2ch; display: block;"/></button>
    </div>
</template>

<script lang="ts">
    import { IMonitoredSoftware } from "server_mgt-lib/types"
    import { Options, Vue } from "vue-class-component"

    @Options({
        components: {
            // Software,
            // MonitoredSoftware,
        },
        props: {
            software: Object
        },
        emits: ["demote", "editImage"]
    })
    export default class MonitoredSoftware extends Vue {
        software?: IMonitoredSoftware

        get versionDifferenceColor() {
            if(this.software?.currentVersion === this.software?.newVersion) {
                return "green"
            }else
                return "red"
        }

        get versionDifference(){
            if(this.software?.currentVersion === this.software?.newVersion) 
                return this.software?.currentVersion
            else 
                return `${this.software?.currentVersion} -> ${this.software?.newVersion}`
        }

        demote(){
            if(!confirm("Are you sure you want to demote this software?")) return
            this.$emit("demote", this.software)
        }
        editImage(){
            this.$emit("editImage", this.software)
        }
    }
</script>

<style>
    .monitoredSoftwareContainer {
        
    }

    .monitoredSoftwareContainer > h2 {
        margin: 0;
    
    }

    .monitoredSoftwareContainer > button {
        display:block
    }

    .monitoredSoftwareIcon{
        width: 10ch;
        height: auto;
        display: block;
        margin: 0 auto;
    }
</style>