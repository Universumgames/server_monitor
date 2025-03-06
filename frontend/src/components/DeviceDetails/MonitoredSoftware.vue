<template>
    <div class="highlight2Container monitoredSoftwareContainer">
        <img :src="software?.imageURL" class="monitoredSoftwareIcon" @click="editImage" />
        <h2>{{ software?.name }}</h2> <label :style="'color:' + versionDifferenceColor">{{ versionDifference }}</label>
        <button @click="demote"><img src="../../assets/star-off-svgrepo-com.svg"
                style="width:2ch; display: block;" /></button>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { type IMonitoredSoftware } from "server_mgt-lib/types"

const props = defineProps<{ software: IMonitoredSoftware }>()
const emit = defineEmits(['demote', 'editImage'])

const versionDifferenceColor = computed(() => {
    return props.software.currentVersion === props.software.newVersion ? "green" : "red"
})

const versionDifference = computed(() => {
    if (props.software.currentVersion === props.software.newVersion) {
        return props.software.currentVersion
    } else {
        return `${props.software.currentVersion} -> ${props.software.newVersion}`
    }
})

const demote = () => {
    if (!confirm("Are you sure you want to demote this software?")) return
    emit("demote", props.software)
}

const editImage = () => {
    emit("editImage", props.software)
}
</script>

<style>
.monitoredSoftwareContainer {}

.monitoredSoftwareContainer>h2 {
    margin: 0;

}

.monitoredSoftwareContainer>button {
    display: block
}

.monitoredSoftwareIcon {
    width: 10ch;
    height: auto;
    display: block;
    margin: 0 auto;
}
</style>