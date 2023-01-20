/* eslint-disable new-cap */
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity,
    OneToMany,
    OneToOne,
    JoinTable
} from "typeorm"
import { ISystemStatus } from "server_mgt-lib/types"
import { Device } from "./Device"
import { SystemIP } from "./SystemIP"

@Entity()
/**
 * System object storing all devices system data
 */
export class SystemStatus extends BaseEntity implements ISystemStatus {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @OneToOne((type) => Device, (device) => device.status)
    device: Device

    @Column()
    uptimeSeconds: number

    @Column({ type: "json" })
    cpuUsage: { avg1m: number; avg5m: number; avg15m: number }

    @OneToMany((type) => SystemIP, (ip) => ip.status, { cascade: true })
    @JoinTable()
    ipAddresses: SystemIP[]

    /**
     * copy from json
     * @param {ISystemStatus} json  object to copy from
     * @param {Device} device device object to link to
     * @return {SystemStatus} new SystemStatus object
     */
    static copyFromJSON(json: ISystemStatus, device: Device): SystemStatus {
        const status = new SystemStatus()
        status.uptimeSeconds = json.uptimeSeconds || 0
        status.cpuUsage = json.cpuUsage || { avg1m: -1, avg5m: -1, avg15m: -1 }
        status.ipAddresses = []
        if (Array.isArray(json.ipAddresses))
            status.ipAddresses = json.ipAddresses.map((ip) => SystemIP.copyFromJSON(ip, status))
        status.device = device
        return status
    }
}
