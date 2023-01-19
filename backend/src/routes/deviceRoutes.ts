import { ReturnCode } from "server_mgt-lib/ReturnCode"
import { DeviceState, ISystemStatus, ISystemUpdatePost } from "server_mgt-lib/types"
import express, { NextFunction, Request, Response } from "express"
import { Device, DeviceSoftware, SystemIP, SystemStatus } from "../entities/entities"
import { getDataFromAny, registerTokenIsValid } from "../helper"
import { checkDeviceToken } from "./routehelper"

// eslint-disable-next-line new-cap
const deviceRoutes = express.Router()

/* const test = async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({
        message: "Test successful"
    })
} */

const registerDevice = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const registerToken = getDataFromAny(req, "registerToken")
        const deviceName = getDataFromAny(req, "deviceName")
        if (registerToken == undefined || deviceName == undefined)
            return res.status(ReturnCode.MISSING_PARAMS).end()
        // check register validity
        if (!registerTokenIsValid(registerToken)) return res.status(200).end()

        const device = new Device()
        device.name = deviceName
        device.state = DeviceState.RUNNING
        device.auth_key = Device.generateDeviceToken()
        await device.save()

        console.log(device)

        return res.status(ReturnCode.OK).json({ token: device.auth_key })
    } catch (e) {
        console.error(e)
        return res.status(ReturnCode.INTERNAL_SERVER_ERROR).end()
    }
}

const pushSystemUpdates = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updateList = getDataFromAny(req, "updateList")
        // const updateCount = getDataFromAny(req, "updateCount")
        if (updateList == undefined) return res.status(ReturnCode.MISSING_PARAMS).end()

        // @ts-ignore
        const device = req.device
        const updateListParsed = JSON.parse(updateList) as ISystemUpdatePost
        const updateObjs: DeviceSoftware[] = []
        if (device.software == undefined) device.software = []
        // clear old system updates
        device.software = device.software.filter(
            (software: DeviceSoftware) => !software.isSystemUpdate
        )
        // add new system updates
        for (const update of updateListParsed.updates) {
            const updateObj = new DeviceSoftware()
            updateObj.name = update.name
            updateObj.currentVersion = update.currentVersion
            updateObj.newVersion = update.newVersion
            updateObj.device = device
            updateObj.isSystemUpdate = true
            updateObjs.push(updateObj)
        }
        await DeviceSoftware.save(updateObjs)
        device.software.push(...updateObjs)
        device.updateLastSeen()
        await device.save()

        return res.status(ReturnCode.OK).end()
    } catch (e) {
        console.error(e)
        return res.status(ReturnCode.INTERNAL_SERVER_ERROR).end()
    }
}

const pushSystemStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const status = getDataFromAny(req, "status")
        if (status == undefined) return res.status(ReturnCode.MISSING_PARAMS).end()

        // @ts-ignore
        const device = req.device

        const statusParsed = JSON.parse(status) as ISystemStatus
        if (device.status != undefined) device.status.delete()

        console.log(statusParsed)

        device.status = SystemStatus.copyFromJSON(statusParsed, device)

        await device.status.save()

        await SystemIP.save(device.status.ipAddresses)
        await device.save()

        return res.status(ReturnCode.OK).end()
    } catch (e) {
        console.error(e)
        return res.status(ReturnCode.INTERNAL_SERVER_ERROR).end()
    }
}

const listDevices = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const devices = await Device.find()
        return res.status(ReturnCode.OK).json(devices)
    } catch (e) {
        console.error(e)
        return res.status(ReturnCode.INTERNAL_SERVER_ERROR).end()
    }
}

deviceRoutes.post("/registerDevice", registerDevice)
deviceRoutes.post("/pushSystemUpdates", checkDeviceToken, pushSystemUpdates)
deviceRoutes.post("/pushSystemStatus", checkDeviceToken, pushSystemStatus)
deviceRoutes.get("/list", listDevices)

export default deviceRoutes
