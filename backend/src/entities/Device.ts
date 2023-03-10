/* eslint-disable new-cap */
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity,
    OneToMany,
    OneToOne,
    JoinColumn,
    ManyToOne
} from "typeorm"
import { DeviceState, IDevice } from "server_mgt-lib/types"
import { DeviceSoftware } from "./DeviceSoftware"
import { v4 as uuidv4 } from "uuid"
import { SystemStatus } from "./SystemStatus"
import { Group } from "./Group"
import { User } from "./User"

@Entity()
/**
 * Device object storing all device data
 */
export class Device extends BaseEntity implements IDevice {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    name: string

    @Column({ unique: true })
    auth_key: string

    @Column({ type: "timestamp" })
    lastSeen: Date

    @Column({ type: "enum", enum: DeviceState, default: DeviceState.UNKNOWN })
    state: DeviceState = DeviceState.UNKNOWN

    @OneToOne((type) => SystemStatus, (status) => status.device, { nullable: true })
    @JoinColumn()
    status: SystemStatus

    @OneToMany((type) => DeviceSoftware, (software) => software.device)
    software: DeviceSoftware[]

    @ManyToOne((type) => Group)
    group: Group

    @ManyToOne((type) => User, (user) => user.owns)
    owner: User

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
