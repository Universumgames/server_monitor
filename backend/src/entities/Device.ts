/* eslint-disable new-cap */
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToMany, OneToMany, JoinTable } from "typeorm"
import { DeviceStatus, IDevice, IDeviceSoftware } from "server_mgt-lib/types"
import { DeviceSoftware } from "./DeviceSoftware"

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

    @Column({ type: "enum", enum: DeviceStatus, default: DeviceStatus.UNKNOWN })
    status: DeviceStatus

    @OneToMany((type) => DeviceSoftware, (software) => software.device)
    software: IDeviceSoftware[]

    @Column("simple-array")
    ipAddresses: string[]
}
