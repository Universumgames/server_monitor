import { NextFunction, Request, Response } from "express"
import { getDeviceToken } from "../helper"
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
