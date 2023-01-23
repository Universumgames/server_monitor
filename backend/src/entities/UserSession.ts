/* eslint-disable new-cap */
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne } from "typeorm"

import { User } from "./User"

@Entity()
/**
 * UserSession object storing all user session data
 */
export class UserSession extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    token: string

    @Column({ type: "timestamp" })
    expires: Date

    @ManyToOne((type) => User, (user) => user.sessions)
    user: User
}
