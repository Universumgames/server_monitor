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

    @ManyToMany((type) => Group, { cascade: false })
    @JoinTable()
    groups: Group[]

    @OneToMany((type) => Group, (group) => group.owner, { cascade: true, onDelete: "CASCADE" })
    ownsGroups: Group[]

    @Column({ default: false })
    admin: boolean

    @OneToMany((type) => Device, (device) => device.owner, { cascade: true, onDelete: "CASCADE" })
    owns: Device[]

    @OneToOne((type) => Group, { cascade: true, onDelete: "CASCADE", nullable: true, eager: true })
    @JoinColumn()
    userGroup: Group

    @OneToMany((type) => UserSession, (session) => session.user, {
        cascade: true,
        onDelete: "CASCADE"
    })
    sessions: UserSession[]
}
