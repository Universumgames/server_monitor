import { NextFunction, Request, Response } from "express"
import { getDataFromAny, getDeviceToken } from "../helper"
import { ReturnCode } from "server_mgt-lib/ReturnCode"
import { Device, DeviceRegistrationToken } from "../entities/entities"

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
        // TODO implement checking of user session token is valid
        // @ts-ignore
        req.user = "test"
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
