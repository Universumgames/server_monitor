import { Device, DeviceRegistrationToken } from "./entities/entities"
import { DeviceState } from "server_mgt-lib/types"
import UserManagement from "./UserManagement"
import { userIsAdmin } from "./helper"

/**
 * This class is responsible for managing the devices.
 */
export default class DeviceManagement {
    /**
     * Get a device by id.
     * @param {{string, string}} data device data to find device
     * @param {string[]} additionalRelations additional relations to load
     * @return {Device | null} the device or undefined
     */
    static async getDevice(
        data: { id?: string; auth_key?: string },
        additionalRelations: string[] = []
    ): Promise<Device | null> {
        let whereClause: any = {}
        if (data.id != undefined) whereClause = { ...whereClause, id: data.id }
        if (data.auth_key != undefined) whereClause = { ...whereClause, auth_key: data.auth_key }
        return await Device.findOne({
            where: whereClause,
            relations: Array.from(
                new Set([
                    ...["status", "status.ipAddresses", "group", "owner"],
                    ...additionalRelations
                ])
            )
        })
    }

    /**
     * Get all devices of a group.
     * @param {{string}} data group data to find devices
     * @param {string[]} additionalRelations additional relations to load
     * @return {Device[]} the devices
     */
    static async getDevices(
        data: { groupId: string },
        additionalRelations: string[] = []
    ): Promise<Device[]> {
        const devices = await Device.find({
            where: { group: { id: data.groupId } },
            relations: Array.from(
                new Set([
                    ...["status", "status.ipAddresses", "group", "owner"],
                    ...additionalRelations
                ])
            )
        })
        return devices
    }

    /**
     * Get all devices.
     * @param {string[]} additionalRelations additional relations to load
     * @return {Device[]} the devices
     */
    static async getAllDevices(additionalRelations: string[] = []): Promise<Device[]> {
        return await Device.find({
            relations: Array.from(
                new Set([
                    ...["status", "status.ipAddresses", "group", "owner"],
                    ...additionalRelations
                ])
            )
        })
    }

    /**
     * Create a new device.
     * @param {{string, User}} data device data to create device
     * @return {Device} the created device
     */
    static async createDevice(data: { name: string; ownerId: string }): Promise<Device> {
        const user = await UserManagement.getUser({ id: data.ownerId })
        const device = new Device()
        device.name = data.name
        device.owner = user!
        device.state = DeviceState.RUNNING
        device.auth_key = Device.generateDeviceToken()
        device.group = user!.userGroup!

        return await device.save()
    }

    /**
     * Get all devices accessible by a user.
     * @param {{string}} data user data to find devices
     * @param {string[]} additionalRelations additional relations to load
     * @return {Device} the devices
     */
    static async getDeviceAccessibleByUser(
        data: { userId: string; deviceId: string; considerAdmin?: boolean },
        additionalRelations: string[] = []
    ): Promise<Device | null> {
        const user = await UserManagement.getUser({ id: data.userId }, ["groups"])
        if (user == undefined) return null
        const device = await this.getDevice({ id: data.deviceId }, additionalRelations)
        if (userIsAdmin(user) && data.considerAdmin) return device
        if (!this.isAccessibleByUser({ userId: user.id, deviceId: data.deviceId })) return null
        return device
    }

    /**
     * Get all devices accessible by a user.
     * @param {{string}} data user data to find devices
     * @param {string[]} additionalRelations additional relations to load
     * @return {Device[]} the devices
     */
    static async getDevicesAccessibleByUser(
        data: { userId: string; considerAdmin?: boolean },
        additionalRelations: string[] = []
    ): Promise<Device[]> {
        const user = await UserManagement.getUser({ id: data.userId }, ["groups"])
        if (user == undefined) return []
        if (userIsAdmin(user) && data.considerAdmin)
            return await this.getAllDevices(additionalRelations)
        const allDevices = []
        for (const group of user.groups) {
            allDevices.push(...(await this.getDevices({ groupId: group.id }, additionalRelations)))
        }
        return allDevices
    }

    /**
     * Get all devices owned by a user.
     * @param {{string}} data user data to find devices
     * @return {Device[]} the devices
     */
    static async getDevicesOwnedByUser(data: { userId: string }) {
        return (await this.getDevicesAccessibleByUser(data, ["owner"])).filter((device) => {
            if (device.owner == undefined) return false
            return device.owner.id == data.userId
        })
    }

    /**
     * Create a new device registration token.
     * @param {{string}} data user data to create device registration token
     * @return {DeviceRegistrationToken | null} the created device registration token or undefined
     */
    static async createDeviceRegistrationToken(data: {
        userId: string
    }): Promise<DeviceRegistrationToken | null> {
        const user = await UserManagement.getUser({ id: data.userId })
        if (user == null) return null
        const registrationToken = new DeviceRegistrationToken()
        registrationToken.user = user
        const expiration = new Date()
        expiration.setHours(expiration.getHours() + 1)
        registrationToken.expires = expiration
        registrationToken.device = null
        return await registrationToken.save()
    }

    /**
     * Check all registration tokens if they are still valid.
     * @return {void}
     */
    static async checkAllRegistrationTokensForValidity() {
        const tokens = await DeviceRegistrationToken.find()
        for (const token of tokens) {
            if (token.expires < new Date()) {
                await token.remove()
            }
        }
    }

    /**
     * Get all devices with a filter.
     * @param {{string}} query filter query
     * @return {Device[]} the devices
     */
    static async getAllDevicesWithFilter(query: { filter: string }): Promise<Device[]> {
        const devices = await DeviceManagement.getAllDevices(["owner", "group"])
        const filteredDevices = devices.filter((device) => {
            const filterStr = query.filter.toLowerCase()
            return (
                device.name.toLowerCase().includes(filterStr) ||
                device.id.toLowerCase().includes(filterStr) ||
                device.owner.email.toLowerCase().includes(filterStr) ||
                device.owner.username.toLowerCase().includes(filterStr) ||
                device.group.name.toLowerCase().includes(filterStr) ||
                device.group.id.toLowerCase().includes(filterStr)
            )
        })
        return filteredDevices
    }

    /**
     * Check if a device is accessible by a user.
     * @param {{string, string}} data device and user data to check if device is accessible
     * @return {boolean} true if device is accessible, false otherwise
     */
    static async isAccessibleByUser(data: {
        userId: string
        deviceId: string
        considerAdmin?: boolean
    }): Promise<boolean> {
        const device = await DeviceManagement.getDevice({ id: data.deviceId }, ["owner"])
        if (device == undefined) return false
        if (device.owner.id == data.userId) return true
        const user = await UserManagement.getUser({ id: data.userId }, ["groups"])
        if (user == undefined) return false
        if (userIsAdmin(user) && data.considerAdmin) return true
        for (const group of user.groups) {
            if (group.id == device.group.id) return true
        }
        return false
    }

    /**
     * Delete a device.
     * @param {{string}} data device data to delete device
     * @return {boolean} true if device was deleted, false otherwise
     */
    static async deleteDevice(data: {
        userId: string
        deviceId: string
        considerAdmin?: boolean
    }): Promise<boolean> {
        const device = data.considerAdmin
            ? await DeviceManagement.getDevice({ id: data.deviceId })
            : await DeviceManagement.getDeviceAccessibleByUser({
                  userId: data.userId,
                  deviceId: data.deviceId
              })
        if (device == undefined) return false
        await device.remove()
        return true
    }
}
