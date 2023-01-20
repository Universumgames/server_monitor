import { NextFunction, Request, Response } from "express"
import { getDataFromAny, getDeviceToken, registerTokenIsValid } from "../helper"
import { ReturnCode } from "server_mgt-lib/ReturnCode"
import { Device } from "../entities/Device"

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

        // @ts-ignore
        req.registrationToken = registerToken
        // check register validity
        if (!registerTokenIsValid(registerToken)) next()
    } catch (e) {
        console.error(e)
        return res.status(ReturnCode.INTERNAL_SERVER_ERROR).end()
    }
}
