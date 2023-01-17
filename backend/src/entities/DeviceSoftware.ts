/* eslint-disable new-cap */
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToMany, OneToMany, JoinTable } from "typeorm"
import { DeviceStatus, IDevice, IDeviceSoftware } from "server_mgt-lib/types"
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
    installedVersion: string

    @Column()
    newestVersion: string

    @ManyToMany((type) => Device, (device) => device.software)
    device: Device
}
