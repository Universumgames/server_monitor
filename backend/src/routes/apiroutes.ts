import { config } from "../monitor_config"
import { ReturnCode } from "server_mgt-lib/ReturnCode"

import express, { NextFunction, Request, Response } from "express"
import { Device } from "../entities/Device"

// eslint-disable-next-line new-cap
const apiRoutes = express.Router()

/* const test = async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({
        message: "Test successful"
    })
} */

const testRegisterDevice = async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({
        message: req.body.token + " " + req.body.deviceName
    })
}

const testRegisterSoftware = async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({
        devTok: req.body.deviceToken,
        softName: req.body.softwareName,
        softVer: req.body.softwareVersion,
        newestSoftVer: req.body.newestVersion
    })
}

export const testPushSystemUpdates = async (req: Request, res: Response, next: NextFunction) => {
    const returnData = {
        token: req.body.deviceToken,
        count: req.body.updateCount,
        updates: req.body.updateList
    }
    return res.status(ReturnCode.OK).json(returnData)
}

export const serverInfo = async (req: Request, res: Response, next: NextFunction) => {
    const returnData = {
        version: config.serverVersion,
        serverPort: config.serverPort,
        frontendPort: config.frontEndPort,
        deviceCount: (await Device.find()).length
    }
    return res.status(ReturnCode.OK).json(returnData)
}

apiRoutes.all("/serverInfo", serverInfo)
apiRoutes.post("/registerDevice", testRegisterDevice)
apiRoutes.post("/registerSoftware", testRegisterSoftware)
apiRoutes.post("/pushSystemUpdates", testPushSystemUpdates)

export default apiRoutes
