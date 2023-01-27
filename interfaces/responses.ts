import { IDevice, IGroup, IUser } from "./types"

export interface CreateDeviceRegistrationResponse {
    token: string
    expires: Date
}

export interface CheckDeviceRegistrationResponse extends CreateDeviceRegistrationResponse {
    deviceId: string
}

export interface DetailedGroupResponse {
    owner: IUser
    group: IGroup
    users: IUser[]
    devices: IDevice[]
}
