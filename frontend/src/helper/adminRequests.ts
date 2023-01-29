import * as types from "server_mgt-lib/types"
import * as management from "server_mgt-lib/management/responses"
import * as managementRequests from "server_mgt-lib/management/requests"
import * as requests from "server_mgt-lib/requests"

export async function getUsers(): Promise<types.IUser[] | undefined> {
    try {
        const response = await fetch("/api/admin/user")
        return await response.json()
    } catch (e) {
        console.error(e)
        return undefined
    }
}

export async function getUser(userID: string): Promise<types.IUser | undefined> {
    try {
        const response = await fetch(`/api/admin/user?userId=${userID}`)
        return await response.json()
    } catch (e) {
        console.error(e)
        return undefined
    }
}

export async function createUser(data: {
    username: string
    email: string
}): Promise<types.IUser | undefined> {
    try {
        const response = await fetch("/api/admin/user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        return await response.json()
    } catch (e) {
        console.error(e)
        return undefined
    }
}

export async function getAllGroups(): Promise<management.AllGroupsResponse | undefined> {
    try {
        const response = await fetch("/api/admin/group")
        return await response.json()
    } catch (e) {
        console.error(e)
        return undefined
    }
}

export async function getGroup(data: { groupId: string }): Promise<types.IGroup | undefined> {
    try {
        const response = await fetch(`/api/admin/group?groupId=${data.groupId}`)
        return await response.json()
    } catch (e) {
        console.error(e)
        return undefined
    }
}

export async function editDevice(data: {
    deviceId: string
    edits: requests.DeviceEditRequest
}): Promise<boolean> {
    try {
        const response = await fetch(`/api/admin/device?deviceId=${data.deviceId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data.edits)
        })
        return response.ok
    } catch (e) {
        console.error(e)
        return false
    }
}

export async function editUser(data: managementRequests.UserEditRequest): Promise<boolean> {
    try {
        const response = await fetch(`/api/admin/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        return response.ok
    } catch (e) {
        console.error(e)
        return false
    }
}
