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
import { DeviceStatus, IDevice, IDeviceSoftware } from "server_mgt-lib/types"
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
    @UpdateDateColumn()
    lastSeen: Date

    @Column({ type: "enum", enum: DeviceStatus, default: DeviceStatus.UNKNOWN })
    status: DeviceStatus

    @OneToMany((type) => DeviceSoftware, (software) => software.device)
    software: IDeviceSoftware[]

    @Column("simple-array")
    ipAddresses: string[]

    /**
     * generate a new deice token for the device
     * @return {string} a random uuid
     */
    static generateDeviceToken(): string {
        return uuidv4()
    }
}
