/* eslint-disable new-cap */
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, JoinColumn, ManyToOne } from "typeorm"
import { User } from "./User"

@Entity()
/**
 * Registration object storing all device registration tokens
 */
export class DeviceRegistrationToken extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    token: string

    @Column({ type: "timestamp" })
    expires: Date

    @ManyToOne((type) => User)
    @JoinColumn()
    user: User
}
