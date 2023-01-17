/* eslint-disable new-cap */
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity,
    ManyToMany,
    OneToMany,
    JoinTable,
    UpdateDateColumn
} from "typeorm"
import { DeviceStatus, IDevice, IDeviceSoftware, ISystemUpdatePost } from "server_mgt-lib/types"
import { DeviceSoftware } from "./DeviceSoftware"
import { v4 as uuidv4 } from "uuid"

@Entity()
/**
 * Device object storing all device data
 */
export class Device extends BaseEntity implements IDevice {
    @PrimaryGeneratedColumn("uuid")
    id: number

    @Column()
    name: string

    @Column({ unique: true })
    auth_key: string

    @Column({ type: "timestamp without time zone" })
    lastSeen: Date

    @Column({ type: "enum", enum: DeviceStatus, default: DeviceStatus.UNKNOWN })
    status: DeviceStatus = DeviceStatus.UNKNOWN

    @OneToMany((type) => DeviceSoftware, (software) => software.device)
    @JoinTable()
    software: DeviceSoftware[]

    @Column("simple-array")
    ipAddresses: string[] = []

    /**
     * generate a new deice token for the device
     * @return {string} a random uuid
     */
    static generateDeviceToken(): string {
        return uuidv4()
    }

    /**
     * update the last seen date of the device, not saved automatically
     */
    updateLastSeen(): void {
        this.lastSeen = new Date()
    }
}
