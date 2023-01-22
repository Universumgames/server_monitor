/* eslint-disable new-cap */
import { IUser } from "server_mgt-lib/types"
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity,
    OneToMany,
    OneToOne,
    JoinColumn,
    ManyToMany
} from "typeorm"
import { Group } from "./Group"

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
}
