import express, { NextFunction, Request, Response } from "express"
import { ReturnCode } from "server_mgt-lib/ReturnCode"
import UserManagement from "../UserManagement"
import { getDataFromAny } from "../helper"
import DeviceManagement from "../DeviceManagement"

// eslint-disable-next-line new-cap
const adminRoutes = express.Router()

/* const test = async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({
        message: "Test successful"
    })
} */

const userOperations = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = getDataFromAny(req, "userId")
        if (userId == undefined) return res.status(ReturnCode.MISSING_PARAMS).end()
        const existingUser = await UserManagement.getUser({ id: userId })

        if (existingUser == undefined) {
            // create user
            const username = getDataFromAny(req, "username")
            const email = getDataFromAny(req, "email")
            if (username == undefined || email == undefined)
                return res.status(ReturnCode.MISSING_PARAMS).end()

            const newUser = await UserManagement.createUser({ username: username, email: email })
            return res.status(ReturnCode.OK).json(newUser)
        }
        // edit user
        const username = getDataFromAny(req, "username")
        if (username != undefined) existingUser.username = username
        const mail = getDataFromAny(req, "mail")
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

adminRoutes.post("/user", userOperations)
adminRoutes.get("/user", getUser)

export default adminRoutes
