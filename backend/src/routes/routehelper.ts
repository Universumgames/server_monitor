import { NextFunction, Request, Response } from "express"
import { cookieName, getDataFromAny, getDeviceToken, getSessionToken, userIsAdmin } from "../helper"
import { ReturnCode } from "server_mgt-lib/ReturnCode"
import { Device, DeviceRegistrationToken, User, UserSession } from "../entities/entities"
import UserManagement from "../UserManagement"
import DeviceManagement from "../DeviceManagement"

export const checkDeviceToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deviceToken = getDeviceToken(req) ?? ""
        if (deviceToken == "") return res.status(ReturnCode.MISSING_PARAMS).end()
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
        const sessionTokenString = getSessionToken(req)
        if (sessionTokenString == undefined) return res.status(ReturnCode.MISSING_PARAMS).end()

        const user = await UserManagement.getUser({ sessionToken: sessionTokenString })

        // check if session is valid
        const session = await UserSession.findOne({ where: { token: sessionTokenString } })
        if (session == undefined) return res.status(ReturnCode.UNAUTHORIZED).end()

        if (session.expires < new Date()) {
            await session.remove()
            return res.status(ReturnCode.UNAUTHORIZED).clearCookie(cookieName).end()
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
        if (!userIsAdmin(user)) return res.status(ReturnCode.UNAUTHORIZED).end()
        next()
    } catch (e) {
        console.error(e)
        return res.status(ReturnCode.INTERNAL_SERVER_ERROR).end()
    }
}

export const checkRegistrationToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const registerTokenParam = getDataFromAny(req, "registerToken")

        if (registerTokenParam == undefined) return res.status(ReturnCode.MISSING_PARAMS).end()

        const registrationToken = await DeviceRegistrationToken.findOne({
            where: { token: registerTokenParam },
            relations: ["user"]
        })

        if (registrationToken == undefined) return res.status(ReturnCode.UNAUTHORIZED).end()
        if (registrationToken.expires < new Date()) {
            await registrationToken.remove()
            return res.status(ReturnCode.UNAUTHORIZED).end()
        }
        // @ts-ignore
        req.user = registrationToken.user
        // @ts-ignore
        req.registrationToken = registrationToken

        await DeviceManagement.checkAllRegistrationTokensForValidity()
        next()
    } catch (e) {
        console.error(e)
        return res.status(ReturnCode.INTERNAL_SERVER_ERROR).end()
    }
}
