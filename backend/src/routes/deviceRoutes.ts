import { config } from "../monitor_config"
import { ReturnCode } from "server_mgt-lib/ReturnCode"
import { DeviceStatus } from "server_mgt-lib/types"
import express, { NextFunction, Request, Response } from "express"
import { Device } from "../entities/Device"
import { getDataFromAny, registerTokenIsValid } from "../helper"

// eslint-disable-next-line new-cap
const deviceRoutes = express.Router()

/* const test = async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({
        message: "Test successful"
    })
} */

const registerDevice = async (req: Request, res: Response, next: NextFunction) => {
    const registerToken = getDataFromAny(req, "registerToken")
    const deviceName = getDataFromAny(req, "deviceName")
    if (registerToken == undefined || deviceName == undefined)
        return res.status(ReturnCode.MISSING_PARAMS).end()
    // check register validity
    if (!registerTokenIsValid(registerToken)) return res.status(200).end()

    const device = new Device()
    device.name = deviceName
    device.status = DeviceStatus.RUNNING
    device.auth_key = Device.generateDeviceToken()
}

export default deviceRoutes
