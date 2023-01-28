import * as types from "server_mgt-lib/types"
import * as responses from "server_mgt-lib/responses"
import * as requests from "server_mgt-lib/requests"

export async function getServerInfo(): Promise<any> {
    try {
        const response = await fetch("/api/serverInfo")
        return await response.json()
    } catch (e) {
        console.error(e)
        return undefined
    }
}

export async function getBasicUser(): Promise<types.IUser | undefined> {
    try {
        const response = await fetch("/api/user/basicUserData")
        return await response.json()
    } catch (e) {
        console.error(e)
        return undefined
    }
}

export async function loginOrRequestMail(data: {
    token?: string
    requestMailData?: string
}): Promise<boolean> {
    try {
        const response = await fetch("/api/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                requestMailData: data.requestMailData,
                token: data.token
            })
        })
        return response.ok
    } catch (e) {
        console.error(e)
        return false
    }
}

export async function logout(): Promise<boolean> {
    try {
        const response = await fetch("/api/user/logout", {
            method: "POST"
        })
        return response.ok
    } catch (e) {
        console.error(e)
        return false
    }
}

export async function getDevices(): Promise<types.IDevice[] | undefined> {
    try {
        const response = await fetch("/api/device/list")
        return await response.json()
    } catch (e) {
        console.error(e)
        return undefined
    }
}

export async function getDeviceIDs(): Promise<string[] | undefined> {
    try {
        const response = await fetch("/api/device/listIDs")
        return await response.json()
    } catch (e) {
        console.error(e)
        return undefined
    }
}

export async function getBasicDevice(deviceId: string): Promise<types.IDevice | undefined> {
    try {
        const response = await fetch(`/api/device/${deviceId}/basic`)
        return await response.json()
    } catch (e) {
        console.error(e)
        return undefined
    }
}

export async function getSystemStatus(deviceId: string): Promise<types.ISystemStatus | undefined> {
    try {
        const response = await fetch(`/api/device/${deviceId}/state`)
        return await response.json()
    } catch (e) {
        console.warn(e)
        return undefined
    }
}

export async function getSoftware(deviceId: string): Promise<types.IDeviceSoftware[] | undefined> {
    try {
        const response = await fetch(`/api/device/${deviceId}/software`)
        return await response.json()
    } catch (e) {
        console.warn(e)
        return undefined
    }
}

export async function login(username: string, password: string): Promise<boolean> {
    try {
        const response = await fetch("/api/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        })
        return response.ok
    } catch (e) {
        console.error(e)
        return false
    }
}

export async function isLoggedIn(): Promise<boolean> {
    try {
        const response = await fetch("/api/user/isLoggedIn")
        return response.ok
    } catch (e) {
        console.error(e)
        return false
    }
}

export async function createDeviceRegistrationToken(): Promise<
    responses.CreateDeviceRegistrationResponse | undefined
> {
    try {
        const response = await fetch("/api/device/createDeviceRegistrationToken", {
            method: "POST"
        })
        return await response.json()
    } catch (e) {
        console.error(e)
        return undefined
    }
}

export async function checkDeviceRegistrationToken(
    token: string
): Promise<responses.CheckDeviceRegistrationResponse | undefined> {
    try {
        const response = await fetch(`/api/device/checkDeviceRegistrationToken?token=${token}`)
        return await response.json()
    } catch (e) {
        console.error(e)
        return undefined
    }
}

export async function getDeviceDetails(deviceId: string): Promise<types.IDevice | undefined> {
    try {
        const response = await fetch(`/api/device/${deviceId}/details`)
        return await response.json()
    } catch (e) {
        console.error(e)
        return undefined
    }
}

export async function editDevice(
    deviceId: string,
    edits: requests.DeviceEditRequest
): Promise<boolean> {
    try {
        const response = await fetch(`/api/device/${deviceId}/edit`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(edits)
        })
        return response.ok
        return true
    } catch (e) {
        console.error(e)
        return false
    }
}

export async function getAvailableGroups(): Promise<types.IGroup[] | undefined> {
    try {
        const response = await fetch("/api/group/list")
        return await response.json()
    } catch (e) {
        console.error(e)
        return undefined
    }
}

export async function getUserGroup(): Promise<types.IGroup | undefined> {
    try {
        const response = await fetch("/api/group/userGroup")
        return await response.json()
    } catch (e) {
        console.error(e)
        return undefined
    }
}

export async function getGroupDetails(
    groupId: string
): Promise<responses.DetailedGroupResponse | undefined> {
    try {
        const response = await fetch(`/api/group/details?groupId=${groupId}`)
        return await response.json()
    } catch (e) {
        console.error(e)
        return undefined
    }
}

export async function addUserToGroup(groupId: string, userMail: string): Promise<boolean> {
    try {
        const body: requests.GroupEditRequest = {
            groupId,
            newUserMails: [userMail]
        }
        const response = await fetch(`/api/group/edit`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
        return response.ok
    } catch (e) {
        console.error(e)
        return false
    }
}

export async function removeUserFromGroup(groupId: string, userMail: string): Promise<boolean> {
    try {
        const body: requests.GroupEditRequest = {
            groupId,
            deleteUserIds: [userMail]
        }
        const response = await fetch(`/api/group/edit`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
        return response.ok
    } catch (e) {
        console.error(e)
        return false
    }
}
