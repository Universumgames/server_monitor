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
    OneToOne
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

    @Column()
    username: string

    @Column()
    email: string

    @ManyToMany((type) => Group)
    @JoinColumn()
    groups: Group[]

    @Column()
    admin: boolean

    @OneToMany((type) => Device, (device) => device.owner)
    @JoinColumn()
    owns: Device[]

    @OneToOne((type) => Device, (device) => device.owner, { cascade: true })
    @JoinColumn()
    userGroup: Group

    @OneToMany((type) => UserSession, (session) => session.user)
    @JoinColumn()
    sessions: UserSession[]
}
