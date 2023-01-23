import { User, Device } from "./entities/entities"
import { DeviceState } from "server_mgt-lib/types"

/**
 * This class is responsible for managing the devices.
 */
export default class DeviceManagement {
    /**
     * Get a device by id.
     * @param {{string, string}} data device data to find device
     * @param {string[]} additionalRelations additional relations to load
     * @return {Device | undefined} the device or undefined
     */
    static async getDevice(
        data: { id?: string; auth_key?: string },
        additionalRelations: string[] = []
    ): Promise<Device | undefined> {
        return await Device.findOne({
            where: { id: data.id, auth_key: data.auth_key },
            relations: [
                ...["status", "status.ipAddresses", "groups", "owner"],
                ...additionalRelations
            ]
        })
    }

    /**
     * Create a new device.
     * @param {{string, User}} data device data to create device
     * @return {Device} the created device
     */
    static async createDevice(data: { name: string; owner: User }): Promise<Device> {
        const device = new Device()
        device.name = data.name
        device.owner = data.owner
        device.state = DeviceState.RUNNING
        device.auth_key = Device.generateDeviceToken()
        return await device.save()
    }
}
