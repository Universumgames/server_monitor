/* eslint-disable new-cap */
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity,
    JoinColumn,
    ManyToOne,
    OneToOne
} from "typeorm"
import { Device } from "./Device"
import { User } from "./User"

@Entity()
/**
 * Registration object storing all device registration tokens
 */
export class DeviceRegistrationToken extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    token: string

    @Column({ type: "timestamp" })
    expires: Date

    @ManyToOne((type) => User)
    @JoinColumn()
    user: User

    @OneToOne((type) => Device, { nullable: true })
    @JoinColumn()
    device: Device | undefined
}
