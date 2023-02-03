export interface DeviceEditRequest {
    deviceId: string
    delete?: boolean
    newGroupId?: string
    newDeviceName?: string
}

export interface GroupEditRequest {
    groupId: string
    delete?: boolean
    newGroupName?: string
    newUserMails?: string[]
    deleteUserIds?: string[]
}

export interface MonitoredDeviceSoftwareRequest {
    deviceId: string
    name?: string
    id?: string
    imageURL?: string
    promote: boolean
}
