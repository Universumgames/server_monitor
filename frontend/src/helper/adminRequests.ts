import * as types from "server_mgt-lib/types"
import * as management from "server_mgt-lib/management/responses"

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

export async function getAllGroups(): Promise<management.AllDeviceResponse | undefined> {
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
