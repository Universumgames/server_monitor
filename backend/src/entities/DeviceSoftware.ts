/* eslint-disable new-cap */
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity,
    ManyToOne,
    ChildEntity,
    TableInheritance
} from "typeorm"
import { IDeviceSoftware } from "server_mgt-lib/types"
import { Device } from "./Device"

@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
/**
 * User object storing all user data
 */
export class DeviceSoftware extends BaseEntity implements IDeviceSoftware {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    name: string

    @Column()
    currentVersion: string

    @Column()
    newVersion: string

    @ManyToOne((type) => Device, (device) => device.software)
    device: Device

    @Column()
    isSystemUpdate: boolean = false
}

@ChildEntity()
/**
 * Monitored device software
 */
export class MonitoredDeviceSoftware extends DeviceSoftware {
    @Column({ default: "", type: "longtext" })
    imageURL: string
}
