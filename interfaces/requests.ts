export interface DeviceEditRequest {
    deviceId: string
    delete?: boolean
    newGroupId?: string
}

export interface GroupEditRequest {
    groupId: string
    delete?: boolean
    newGroupName?: string
    newUserMails?: string[]
    deleteUserIds?: string[]
}
