import { ReturnCode } from "server_mgt-lib/ReturnCode"
import express, { NextFunction, Request, Response } from "express"
import { User } from "../entities/entities"
import { getDataFromAny } from "../helper"
import { checkLoggedIn } from "./routehelper"
import * as responses from "server_mgt-lib/responses"
import * as requests from "server_mgt-lib/requests"
import GroupManagement from "../GroupManagement"
import UserManagement from "../UserManagement"

// eslint-disable-next-line new-cap
const groupRoutes = express.Router()

/* const test = async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({
        message: "Test successful"
    })
} */

const getGroups = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // @ts-ignore
        const user = req.user as User
        const groups = await GroupManagement.getGroupsAccessibleByUser({ userId: user.id })
        return res.status(ReturnCode.OK).json(groups)
    } catch (error) {
        console.error(error)
        return res.status(ReturnCode.INTERNAL_SERVER_ERROR).end()
    }
}

const userGroup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // @ts-ignore
        const user = req.user as User

        const userGroup = await GroupManagement.getUserGroup({ userId: user.id })

        return res.status(ReturnCode.OK).json(userGroup)
    } catch (error) {
        console.error(error)
        return res.status(ReturnCode.INTERNAL_SERVER_ERROR).end()
    }
}

const createGroup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // @ts-ignore
        const user = req.user as User
        const name = getDataFromAny(req, "name")
        if (name == undefined) return res.status(ReturnCode.MISSING_PARAMS).end()
        const group = await GroupManagement.createGroup({ name: name, owner: user })
        return res.status(ReturnCode.OK).json(group)
    } catch (error) {
        console.error(error)
        return res.status(ReturnCode.INTERNAL_SERVER_ERROR).end()
    }
}

const editUserList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // @ts-ignore
        const user = req.user as User
        const edits = req.body as requests.GroupEditRequest
        if (edits == undefined || edits.groupId == undefined)
            return res.status(ReturnCode.MISSING_PARAMS).end()
        const group = await GroupManagement.getGroup({ id: edits.groupId })
        if (group == undefined) return res.status(ReturnCode.BAD_REQUEST).end()
        if (group.owner.id != user.id) return res.status(ReturnCode.FORBIDDEN).end()

        if (edits.newUserMails != undefined) {
            for (const userMail of edits.newUserMails) {
                const user = await UserManagement.getUser({ mail: userMail })
                if (user == undefined) return res.status(ReturnCode.UNPROCESSABLE_ENTITY).end()
                await GroupManagement.addUserToGroup({ userId: user.id, groupId: group.id })
            }
        }
        if (edits.deleteUserIds != undefined) {
            for (const userId of edits.deleteUserIds) {
                await GroupManagement.removeUserFromGroup({ userId: userId, groupId: group.id })
            }
        }
        // TODO delete group

        return res.status(ReturnCode.OK).end()
    } catch (error) {
        console.error(error)
        return res.status(ReturnCode.INTERNAL_SERVER_ERROR).end()
    }
}

const groupDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // @ts-ignore
        const user = req.user as User
        const groupId = getDataFromAny(req, "groupId")
        if (groupId == undefined) return res.status(ReturnCode.MISSING_PARAMS).end()
        const group = await GroupManagement.getGroup({ id: groupId })
        if (group == undefined) return res.status(ReturnCode.BAD_REQUEST).end()
        if (group.owner.id != user.id) return res.status(ReturnCode.FORBIDDEN).end()

        const devices = await GroupManagement.getGroupDevices({ groupId: group.id })
        const users = await GroupManagement.getUsersInGroup({ groupId: group.id })

        const response: responses.DetailedGroupResponse = {
            owner: group.owner,
            group: group,
            devices: devices,
            users: users
        }
        return res.status(ReturnCode.OK).json(response)
    } catch (error) {
        console.error(error)
        return res.status(ReturnCode.INTERNAL_SERVER_ERROR).end()
    }
}

groupRoutes.get("/list", checkLoggedIn, getGroups)
groupRoutes.get("/userGroup", checkLoggedIn, userGroup)
groupRoutes.post("/create", checkLoggedIn, createGroup)
groupRoutes.post("/edit", checkLoggedIn, editUserList)
groupRoutes.get("/details", checkLoggedIn, groupDetails)

export default groupRoutes
