/* eslint-disable new-cap */
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne } from "typeorm"
import { IPTypes, ISystemIP } from "server_mgt-lib/types"
import { SystemStatus } from "./SystemStatus"

@Entity()
/**
 * storing ip data
 */
export class SystemIP extends BaseEntity implements ISystemIP {
    @PrimaryGeneratedColumn("uuid")
    id: number

    @Column()
    ip: string

    @Column()
    type: IPTypes

    @Column({ default: "" })
    interface: string

    @ManyToOne((type) => SystemStatus, (status) => status.ipAddresses)
    status: SystemStatus

    /**
     * copy from json
     * @param {ISystemIP} json object to copy from
     * @param {SystemStatus} status status object to link to
     * @return {SystemIP} new SystemIP object
     */
    static copyFromJSON(json: ISystemIP, status: SystemStatus): SystemIP {
        if (json.ip == undefined) throw new Error("ip is required")
        if (status == undefined) throw new Error("status is required")
        const ip = new SystemIP()
        ip.ip = json.ip
        ip.status = status
        ip.type = json.type || SystemIP.ipTypeFromIp(json.ip)
        if (json.interface != undefined) ip.interface = json.interface
        return ip
    }

    /**
     *  get the ip type from an ip
     * @param {string} ip the ip to check
     * @return {IPTypes} the ip type
     */
    static ipTypeFromIp(ip: string): IPTypes {
        if (ip == undefined) throw new Error("ip is required")
        if (ip.includes(":")) return IPTypes.IPV6
        return IPTypes.IPV4
    }
}
