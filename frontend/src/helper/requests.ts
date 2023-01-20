import * as types from "server_mgt-lib/types"

export async function getDevices(): Promise<types.IDevice[]> {
    const response = await fetch("/api/device/list")
    return await response.json()
}

export async function getBasicDevice(deviceId: string): Promise<types.IDevice> {
    const response = await fetch(`/api/device/${deviceId}/basic`)
    return await response.json()
}


export async function getSystemStatus(deviceId: string): Promise<types.ISystemStatus> {
    const response = await fetch(`/api/device/${deviceId}/state`)
    return await response.json()
}

export async function getSoftware(deviceId: string): Promise<types.IDeviceSoftware[]> {
    const response = await fetch(`/api/device/${deviceId}/software`)
    return await response.json()
}