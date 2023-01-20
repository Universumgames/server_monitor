export interface IDevice {
    id: string
    name: string
    auth_key: string
    lastSeen: Date
    state: DeviceState
    status: ISystemStatus
    software: IDeviceSoftware[]
}

export enum DeviceState {
    RUNNING = "RUNNING",
    STOPPED = "STOPPED",
    UNKNOWN = "UNKNOWN"
}

export interface IDeviceSoftware {
    id?: string
    name: string
    currentVersion: string
    newVersion: string
    isSystemUpdate: boolean
}

export interface ISystemUpdatePost {
    updates: IDeviceSoftware[]
}

export enum IPTypes {
    IPV4 = "ipv4",
    IPV6 = "ipv6"
}

export interface ISystemStatus {
    id: string
    uptimeSeconds: number
    cpuUsage: { avg1m: number; avg5m: number; avg15m: number }
    ipAddresses: ISystemIP[]
}

export interface ISystemIP {
    ip: string
    type?: IPTypes
    interface?: string
}
