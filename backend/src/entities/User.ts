/* eslint-disable new-cap */
import { IUser } from "server_mgt-lib/types"
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity,
    OneToMany,
    JoinColumn,
    ManyToMany,
    OneToOne,
    JoinTable
} from "typeorm"
import { Device } from "./Device"
import { Group } from "./Group"
import { UserSession } from "./UserSession"

@Entity()
/**
 * User object storing all user data
 */
export class User extends BaseEntity implements IUser {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ unique: true })
    username: string

    @Column({ unique: true })
    email: string

    @ManyToMany((type) => Group)
    @JoinTable()
    groups: Group[]

    @Column({ default: false })
    admin: boolean

    @OneToMany((type) => Device, (device) => device.owner)
    owns: Device[]

    @OneToOne((type) => Group)
    @JoinColumn()
    userGroup: Group

    @OneToMany((type) => UserSession, (session) => session.user)
    sessions: UserSession[]
}
