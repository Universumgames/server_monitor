import { BasicGroupResponse } from "../responses"
import { IGroup } from "../types"

export interface AllGroupsResponse {
    groups: BasicGroupResponse[]
    notUserGroupGroups: BasicGroupResponse[]
}
