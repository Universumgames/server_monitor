import { IGroup } from "../types"

export interface AllDeviceResponse {
    groups: IGroup[]
    notUserGroupGroups: IGroup[]
}
