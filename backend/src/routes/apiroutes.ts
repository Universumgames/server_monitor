import { config } from "../monitor_config"
import { ReturnCode } from "server_mgt-lib/ReturnCode"
import express, { NextFunction, Request, Response } from "express"
import { Device, DeviceSoftware } from "../entities/entities"
import deviceRoutes from "./deviceRoutes"
import { getDataFromAny } from "../helper"

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
        token: getDataFromAny(req, "deviceToken"),
        count: req.body.updateCount,
        updates: req.body.updateList
    }
    console.log("Received update request from " + returnData.token)
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

const testGetAllDevices = async (req: Request, res: Response, next: NextFunction) => {
    const devices = await Device.find({ relations: ["software", "status", "status.ipAddresses"] })
    return res.status(200).json(devices)
}

const testGetAllSoftware = async (req: Request, res: Response, next: NextFunction) => {
    const software = await DeviceSoftware.find()
    return res.status(200).json(software)
}

const testClearAllDevices = async (req: Request, res: Response, next: NextFunction) => {
    await Device.clear()
    return res.status(200).end()
}

const testClearAllSoftware = async (req: Request, res: Response, next: NextFunction) => {
    await DeviceSoftware.clear()
    return res.status(200).end()
}

apiRoutes.all("/serverInfo", serverInfo)
apiRoutes.use("/device", deviceRoutes)
apiRoutes.post("/registerDevice", testRegisterDevice)
apiRoutes.post("/registerSoftware", testRegisterSoftware)
apiRoutes.post("/pushSystemUpdates", testPushSystemUpdates)
apiRoutes.get("/getAllDevices", testGetAllDevices)
apiRoutes.get("/getAllSoftware", testGetAllSoftware)
apiRoutes.get("/clearAllDevices", testClearAllDevices)
apiRoutes.get("/clearAllSoftware", testClearAllSoftware)
export default apiRoutes
