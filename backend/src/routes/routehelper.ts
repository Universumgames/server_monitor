import { NextFunction, Request, Response } from "express"
import { getDataFromAny, getDeviceToken } from "../helper"
import { ReturnCode } from "server_mgt-lib/ReturnCode"
import { Device, DeviceRegistrationToken, User, UserSession } from "../entities/entities"
import UserManagement from "../UserManagement"

export const checkDeviceToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deviceToken = getDeviceToken(req)
        const device = await Device.findOne({
            where: { auth_key: deviceToken },
            relations: ["software", "status", "status.ipAddresses"]
        })
        // @ts-ignore
        req.device = device
        if (device == undefined) {
            return res.status(ReturnCode.UNAUTHORIZED).json({
                message: "Device not found"
            })
        }
        next()
    } catch (e) {
        console.error(e)
        return res.status(ReturnCode.INTERNAL_SERVER_ERROR).end()
    }
}

export const checkLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sessionTokenString = getDeviceToken(req)
        if (sessionTokenString == undefined) return res.status(ReturnCode.UNAUTHORIZED).end()
        const user = await UserManagement.getUser({ sessionToken: sessionTokenString })

        // check if session is valid
        const session = await UserSession.findOne({ token: sessionTokenString })
        if (session == undefined) return res.status(ReturnCode.UNAUTHORIZED).end()

        if (session.expires > new Date()) {
            await session.remove()
            return res.status(ReturnCode.UNAUTHORIZED).end()
        }

        // TODO unauthorized if user is not found
        // if (user == undefined) return res.status(ReturnCode.UNAUTHORIZED).end()

        // @ts-ignore
        req.user = user
        next()
    } catch (e) {
        console.error(e)
        return res.status(ReturnCode.INTERNAL_SERVER_ERROR).end()
    }
}

export const checkAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // @ts-ignore
        const user = req.user as User
        if (user == undefined) return res.status(ReturnCode.UNAUTHORIZED).end()
        if (!user.admin) return res.status(ReturnCode.UNAUTHORIZED).end()
        next()
    } catch (e) {
        console.error(e)
        return res.status(ReturnCode.INTERNAL_SERVER_ERROR).end()
    }
}

export const checkRegistrationToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const registerToken = getDataFromAny(req, "registerToken")

        if (registerToken == undefined) return res.status(ReturnCode.MISSING_PARAMS).end()

        const registrationToken = await DeviceRegistrationToken.findOne({
            where: { token: registerToken },
            relations: ["owner"]
        })
        // @ts-ignore
        req.owner = registerToken.owner
        // @ts-ignore
        req.registrationToken = registrationToken
        // check register validity
        if (registerToken != undefined) next()
    } catch (e) {
        console.error(e)
        return res.status(ReturnCode.INTERNAL_SERVER_ERROR).end()
    }
}
