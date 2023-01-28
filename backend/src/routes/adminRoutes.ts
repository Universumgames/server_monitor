import express, { NextFunction, Request, Response } from "express"
import { ReturnCode } from "server_mgt-lib/ReturnCode"
import UserManagement from "../UserManagement"
import { getDataFromAny } from "../helper"
import DeviceManagement from "../DeviceManagement"
import GroupManagement from "../GroupManagement"
import * as managementResponses from "server_mgt-lib/management/responses"
import { User } from "../entities/User"
import * as requests from "server_mgt-lib/requests"
import * as managementRequests from "server_mgt-lib/management/requests"

// eslint-disable-next-line new-cap
const adminRoutes = express.Router()

/* const test = async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({
        message: "Test successful"
    })
} */

const userOperations = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const edit = req.body as managementRequests.UserEditRequest

        const existingUser = await UserManagement.getUser({ id: edit.userId })

        if (edit.userId == undefined || existingUser == undefined) {
            // create user
            const username = getDataFromAny(req, "username")
            const email = getDataFromAny(req, "email")
            if (username == undefined || email == undefined)
                return res.status(ReturnCode.MISSING_PARAMS).end()

            const newUser = await UserManagement.createUser({ username: username, email: email })
            const body = JSON.stringify(newUser, () => {
                const seen = new WeakSet()
                return (key: any, value: any) => {
                    if (typeof value === "object" && value !== null) {
                        if (seen.has(value)) {
                            return
                        }
                        seen.add(value)
                    }
                    return value
                }
            })
            return res.status(ReturnCode.OK).type("application/json").send(body)
        }
        // edit user
        if (edit.delete != undefined && edit.delete) {
            await UserManagement.deleteUser({ userId: edit.userId })
            return res.status(ReturnCode.OK).end()
        }
        const username = edit.newUsername
        if (username != undefined) existingUser.username = username
        const mail = edit.newEmail
        if (mail != undefined) existingUser.email = mail
        await existingUser.save()
        return res.status(ReturnCode.OK).json(existingUser)
    } catch (error) {
        console.error(error)
        return res.status(ReturnCode.INTERNAL_SERVER_ERROR).end()
    }
}

const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = getDataFromAny(req, "userId")
        if (userId == undefined) {
            const users = await UserManagement.getUsers()

            return res.status(ReturnCode.OK).json(users)
        }
        const user = await UserManagement.getUser({ id: userId }, ["groups"])
        if (user == undefined) return res.status(ReturnCode.BAD_REQUEST).end()
        const ownsDevices = await DeviceManagement.getDevicesOwnedByUser({ userId: user.id })
        const accessToDevices = await DeviceManagement.getDevicesAccessibleByUser({
            userId: user.id
        })
        const responseUser = {
            id: user.id,
            username: user.username,
            email: user.email,
            admin: user.admin,
            groups: user.groups,
            userGroup: user.userGroup,
            ownsDevices: ownsDevices,
            accessToDevices: accessToDevices
        }
        return res.status(ReturnCode.OK).json(responseUser)
    } catch (error) {
        console.error(error)
        return res.status(ReturnCode.INTERNAL_SERVER_ERROR).end()
    }
}

const getGroup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const groupId = getDataFromAny(req, "groupId")
        if (groupId == undefined) {
            const groups = await GroupManagement.getGroups()
            const notUserGroupGroups = await GroupManagement.getGroupsNotUserGroup()
            return res.status(ReturnCode.OK).json({
                groups: groups,
                notUserGroupGroups: notUserGroupGroups
            } as managementResponses.AllDeviceResponse)
        }
        const group = await GroupManagement.getGroup({ id: groupId })
        if (group == undefined) return res.status(ReturnCode.BAD_REQUEST).end()
        return res.status(ReturnCode.OK).json(group)
    } catch (error) {
        console.error(error)
        return res.status(ReturnCode.INTERNAL_SERVER_ERROR).end()
    }
}

const getDevice = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deviceId = getDataFromAny(req, "deviceId")
        if (deviceId != undefined) {
            const device = await DeviceManagement.getDevice({ id: deviceId })
            if (device == undefined) return res.status(ReturnCode.BAD_REQUEST).end()
            return res.status(ReturnCode.OK).json(device)
        }
        const devices = await DeviceManagement.getAllDevices(["owner", "group"])
        const query = getDataFromAny(req, "query") as any
        if (query != undefined && query.filter != undefined) {
            const filteredDevices = await DeviceManagement.getAllDevicesWithFilter({
                filter: query.filter
            })
            return res.status(ReturnCode.OK).json(filteredDevices)
        }
        return res.status(ReturnCode.OK).json(devices)
    } catch (error) {
        console.error(error)
        return res.status(ReturnCode.INTERNAL_SERVER_ERROR).end()
    }
}

const deviceOperations = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // @ts-ignore
        const user = req.user as User
        const deviceId = getDataFromAny(req, "deviceId")
        if (deviceId == undefined) return res.status(ReturnCode.MISSING_PARAMS).end()

        const device = await DeviceManagement.getDevice({ id: deviceId })
        if (device == undefined) return res.status(ReturnCode.BAD_REQUEST).end()

        const edits = req.body as requests.DeviceEditRequest
        if (edits.delete != undefined && edits.delete) {
            await DeviceManagement.deleteDevice({
                deviceId: deviceId,
                userId: user.id,
                considerAdmin: true
            })
            return res.status(ReturnCode.OK).end()
        }

        return res.status(ReturnCode.UNPROCESSABLE_ENTITY).json(device)
    } catch (error) {
        console.error(error)
        return res.status(ReturnCode.INTERNAL_SERVER_ERROR).end()
    }
}

adminRoutes.post("/user", userOperations)
adminRoutes.get("/user", getUser)
adminRoutes.get("/group", getGroup)
adminRoutes.get("/device", getDevice)
adminRoutes.post("/device", deviceOperations)

export default adminRoutes
