/* eslint-disable new-cap */
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne } from "typeorm"
import { IDeviceSoftware } from "server_mgt-lib/types"
import { Device } from "./Device"

@Entity()
/**
 * User object storing all user data
 */
export class DeviceSoftware extends BaseEntity implements IDeviceSoftware {
    @PrimaryGeneratedColumn("uuid")
    id: number

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
