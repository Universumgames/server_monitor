import DeviceManagement from "DeviceManagement"
import { Device } from "./entities/Device"
import UserManagement from "./UserManagement"
import { Group } from "./entities/Group"
import { userIsAdmin } from "./helper"
import { User } from "./entities/User"

/**
 * Group management class
 */
export default class GroupManagement {
    /**
     * get group by id
     * @param {{string, string}} data group data to find group
     * @return {Group | undefined} the group or undefined
     */
    static async getGroup(data: { id?: string; name?: string }): Promise<Group | undefined> {
        return await Group.findOne({ where: { id: data.id, name: data.name } })
    }

    /**
     * Create a new group
     * @param {{string, user}} data group data
     * @return {Group} the created group
     */
    static async createGroup(data: { name: string; owner: User }): Promise<Group> {
        const group = new Group()
        group.name = data.name
        group.owner = data.owner
        await group.save()
        await this.addUserToGroup({ userId: data.owner.id, groupId: group.id })
        return group
    }

    /**
     * Add user to group
     * @param {{string, string}} data user and group data
     * @return {Group | undefined} the group the user was added to or undefined
     */
    static async addUserToGroup(data: {
        userId: string
        groupId: string
    }): Promise<Group | undefined> {
        const user = await UserManagement.getUser({ id: data.userId })
        const group = await GroupManagement.getGroup({ id: data.groupId })
        if (user == undefined || group == undefined) return undefined
        if (user.groups == undefined) user.groups = []
        user.groups.push(group)
        await user.save()
        return await group.save()
    }

    /**
     * Remove user from group
     * @param {{string, string}} data  user and group data
     * @return {Group | undefined} the group the user was removed from or undefined
     */
    static async removeUserFromGroup(data: {
        userId: string
        groupId: string
    }): Promise<Group | undefined> {
        const user = await UserManagement.getUser({ id: data.userId })
        const group = await GroupManagement.getGroup({ id: data.groupId })
        if (user == undefined || group == undefined) return undefined
        if (group.owner == user) return undefined
        if (user.groups == undefined) user.groups = []
        user.groups = user.groups.filter((g) => g.id != group.id)
        await user.save()
        return await group.save()
    }

    /**
     * Add device to group
     * @param {{string, string}} data device and group data
     * @return {Group | undefined} the group the device was added to or undefined
     */
    static async addDeviceToGroup(data: {
        deviceId: string
        groupId: string
    }): Promise<Group | undefined> {
        const device = await DeviceManagement.getDevice({ id: data.deviceId })
        const group = await GroupManagement.getGroup({ id: data.groupId })
        if (device == undefined || group == undefined) return undefined
        if (device.groups == undefined) device.groups = []
        device.groups.push(group)
        await device.save()
        return await group.save()
    }

    /**
     * Remove device from group
     * @param {{string, string}} data device and group data
     * @return {Group | undefined} the group the device was removed from or undefined
     */
    static async removeDeviceFromGroup(data: {
        deviceId: string
        groupId: string
    }): Promise<Group | undefined> {
        const device = await DeviceManagement.getDevice({ id: data.deviceId })
        const group = await GroupManagement.getGroup({ id: data.groupId })
        if (device == undefined || group == undefined) return undefined
        if (device.groups == undefined) device.groups = []
        device.groups = device.groups.filter((g) => g.id != group.id)
        await device.save()
        return await group.save()
    }

    /**
     * Get all devices in a group
     * @param {{string}} data group data
     * @return {Device[]} the devices in the group
     */
    static async getGroupDevices(data: { groupId: string }): Promise<Device[]> {
        const group = await GroupManagement.getGroup({ id: data.groupId })
        if (group == undefined) return []
        return await Device.find({ where: { groups: group } })
    }

    /**
     * Get all devices accessible by a user
     * @param {{string}} data user data
     * @return {Device[]} the devices accessible by the user
     */
    static async getDevicesAccessibleByUser(data: { userId: string }): Promise<Device[]> {
        const user = await UserManagement.getUser({ id: data.userId })
        if (user == undefined) return []
        if (userIsAdmin(user)) return await Device.find()
        if (user.groups == undefined) return []
        const devices: Device[] = []
        for (const group of user.groups) {
            const groupDevices = await GroupManagement.getGroupDevices({
                groupId: group.id
            })
            devices.push(...groupDevices)
        }
        return devices
    }

    /**
     * Check if a user has access to a device
     * @param {{string, string}} data user and device data
     * @return {boolean} true if the user has access to the device, false otherwise
     */
    static async userHasAccessToDevice(data: {
        userId: string
        deviceId: string
    }): Promise<boolean> {
        const devices = await GroupManagement.getDevicesAccessibleByUser({
            userId: data.userId
        })
        return devices.some((d) => d.id == data.deviceId)
    }
}
