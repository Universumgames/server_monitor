/* eslint-disable new-cap */
import { IGroup } from "server_mgt-lib/types"
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, JoinColumn, ManyToMany } from "typeorm"
import { User } from "./User"

@Entity()
/**
 * Group object storing all group data
 */
export class Group extends BaseEntity implements IGroup {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    name: string

    @ManyToMany((type) => User)
    owner: User
}
