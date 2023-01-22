import { Device } from "./entities/Device"

/**
 * This class is responsible for managing the devices.
 */
export default class DeviceManagement {
    /**
     * Get a device by id.
     * @param {{string, string}} data device data to find device
     * @return {Device | undefined} the device or undefined
     */
    static async getDevice(data: { id?: string; auth_key?: string }): Promise<Device | undefined> {
        return await Device.findOne({
            where: { id: data.id, auth_key: data.auth_key },
            relations: ["status", "status.ipAddresses", "groups"]
        })
    }
}
