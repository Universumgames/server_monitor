export interface IDevice {
    id: number
    name: string
    auth_key: string
    lastSeen: Date
    status: DeviceStatus
    software: IDeviceSoftware[]
    ipAddresses: string[]
}

export enum DeviceStatus {
    RUNNING = "RUNNING",
    STOPPED = "STOPPED",
    UNKNOWN = "UNKNOWN"
}

export interface IDeviceSoftware {
    id?: number
    name: string
    currentVersion: string
    newVersion: string
}

export interface ISystemUpdatePost {
    updates: IDeviceSoftware[]
}
