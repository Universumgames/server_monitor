import { ReturnCode } from "server_mgt-lib/ReturnCode"
import { ISystemUpdatePost } from "server_mgt-lib/types"
import express, { NextFunction, Request, Response } from "express"
import { DeviceSoftware, MonitoredDeviceSoftware } from "../entities/entities"
import { getDataFromAny } from "../helper"
import { checkDeviceToken, checkLoggedIn } from "./routehelper"
import { MonitoredDeviceSoftwareRequest } from "server_mgt-lib/requests"

// eslint-disable-next-line new-cap
const softwareRoutes = express.Router()

/* const test = async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({
        message: "Test successful"
    })
} */

const pushSystemUpdates = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updateList = getDataFromAny(req, "updateList")
        // const updateCount = getDataFromAny(req, "updateCount")
        if (updateList == undefined) return res.status(ReturnCode.MISSING_PARAMS).end()

        // @ts-ignore
        const device = req.device
        const updateListParsed = (
            typeof updateList == "object" ? updateList : JSON.parse(updateList)
        ) as ISystemUpdatePost
        const updateObjs: DeviceSoftware[] = []
        if (device.software == undefined) device.software = []
        // add new system updates
        for (const update of updateListParsed.updates) {
            const existingUpdate = await DeviceSoftware.findOne({
                where: { name: update.name, device: { id: device.id } }
            })
            const updateObj = existingUpdate ?? new DeviceSoftware()
            updateObj.name = update.name
            updateObj.currentVersion = update.currentVersion
            updateObj.newVersion = update.newVersion
            updateObj.device = device
            updateObj.isSystemUpdate = existingUpdate?.isSystemUpdate ?? true
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

const clearSystemUpdates = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // @ts-ignore
        const device = req.device
        if (device.software == undefined) device.software = []
        // clear old system updates
        device.software = device.software.filter(
            (software: DeviceSoftware) => !software.isSystemUpdate
        )
        await device.save()
        for (const software of await DeviceSoftware.find({
            where: { device: { id: undefined } }
        })) {
            if (software.isSystemUpdate) {
                await software.remove()
            }
        }
        return res.status(ReturnCode.OK).end()
    } catch (e) {
        console.error(e)
        return res.status(ReturnCode.INTERNAL_SERVER_ERROR).end()
    }
}

const promoteSoftware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const software = req.body as MonitoredDeviceSoftwareRequest
        if (software == undefined) return res.status(ReturnCode.MISSING_PARAMS).end()

        let monitoredSoftware = await DeviceSoftware.findOne({
            where: { id: software.id, device: { id: software.deviceId } }
        })
        if (monitoredSoftware == undefined)
            monitoredSoftware = await MonitoredDeviceSoftware.findOne({
                where: { name: software.name }
            })
        if (monitoredSoftware == undefined) return res.status(ReturnCode.BAD_REQUEST).end()

        if (software.promote) {
            const newMonitoredSoftware = new MonitoredDeviceSoftware()
            newMonitoredSoftware.name = monitoredSoftware.name
            newMonitoredSoftware.imageURL = software.imageURL ?? ""
            newMonitoredSoftware.currentVersion = monitoredSoftware.currentVersion
            newMonitoredSoftware.newVersion = monitoredSoftware.newVersion
            newMonitoredSoftware.isSystemUpdate = false
            newMonitoredSoftware.device = { id: software.deviceId } as any
            await newMonitoredSoftware.save()
            await monitoredSoftware.remove()
        } else {
            const newDeviceSoftware = new DeviceSoftware()
            newDeviceSoftware.name = monitoredSoftware.name
            newDeviceSoftware.currentVersion = monitoredSoftware.currentVersion
            newDeviceSoftware.newVersion = monitoredSoftware.newVersion
            newDeviceSoftware.isSystemUpdate = true
            newDeviceSoftware.device = { id: software.deviceId } as any
            await newDeviceSoftware.save()
            await monitoredSoftware.remove()
        }

        return res.status(ReturnCode.OK).end()
    } catch (e) {
        console.error(e)
        return res.status(ReturnCode.INTERNAL_SERVER_ERROR).end()
    }
}

const getSoftwareUpdates = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // @ts-ignore
        const deviceID = getDataFromAny(req, "deviceID")
        if (deviceID == undefined) return res.status(ReturnCode.MISSING_PARAMS).end()
        const software = await DeviceSoftware.find({ where: { device: { id: deviceID } } })
        if (software == undefined) return res.status(ReturnCode.BAD_REQUEST).end()

        return res.status(ReturnCode.OK).json(software)
    } catch (e) {
        console.error(e)
        return res.status(ReturnCode.INTERNAL_SERVER_ERROR).end()
    }
}

softwareRoutes.post("/pushSystemUpdates", checkDeviceToken, pushSystemUpdates)
softwareRoutes.post("/clearSystemUpdates", checkDeviceToken, clearSystemUpdates)
softwareRoutes.get("/:deviceID/softwareList", checkLoggedIn, getSoftwareUpdates)
softwareRoutes.post("/promoteSoftware", checkLoggedIn, promoteSoftware)

export default softwareRoutes
