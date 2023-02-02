import { ReturnCode } from "server_mgt-lib/ReturnCode"
import { DeviceState, ISystemStatus, ISystemUpdatePost } from "server_mgt-lib/types"
import express, { NextFunction, Request, Response } from "express"
import {
    Device,
    DeviceRegistrationToken,
    DeviceSoftware,
    MonitoredDeviceSoftware,
    SystemIP,
    SystemStatus,
    User
} from "../entities/entities"
import { getDataFromAny, userIsAdmin } from "../helper"
import { checkDeviceToken, checkLoggedIn, checkRegistrationToken } from "./routehelper"
import DeviceManagement from "../DeviceManagement"
import * as responses from "server_mgt-lib/responses"
import * as requests from "server_mgt-lib/requests"
import GroupManagement from "../GroupManagement"

// eslint-disable-next-line new-cap
const deviceRoutes = express.Router()

/* const test = async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({
        message: "Test successful"
    })
} */

const createDeviceRegistrationToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // @ts-ignore
        const user = req.user as User
        if (user == undefined) return res.status(ReturnCode.UNAUTHORIZED).end()

        const token = await DeviceManagement.createDeviceRegistrationToken({ userId: user.id })
        return res.status(ReturnCode.OK).json({
            token: token?.token ?? "",
            expires: token?.expires ?? ""
        } as responses.CreateDeviceRegistrationResponse)
    } catch (e) {
        console.error(e)
        return res.status(ReturnCode.INTERNAL_SERVER_ERROR).end()
    }
}

const checkDeviceRegistrationToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = getDataFromAny(req, "token")
        if (token == undefined) return res.status(ReturnCode.MISSING_PARAMS).end()

        const registrationToken = await DeviceRegistrationToken.findOne({
            where: { token: token },
            relations: ["device"]
        })
        if (registrationToken == undefined) return res.status(ReturnCode.UNAUTHORIZED).end()

        return res.status(ReturnCode.OK).json({
            token: registrationToken.token,
            expires: registrationToken.expires,
            deviceId: registrationToken.device?.id ?? ""
        } as responses.CheckDeviceRegistrationResponse)
    } catch (e) {
        console.error(e)
        return res.status(ReturnCode.INTERNAL_SERVER_ERROR).end()
    }
}

const registerDevice = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deviceName = getDataFromAny(req, "deviceName")
        if (deviceName == undefined) return res.status(ReturnCode.MISSING_PARAMS).end()

        // @ts-ignore
        const owner = req.user as User
        // @ts-ignore
        const registrationToken = req.registrationToken as DeviceRegistrationToken

        const device = await DeviceManagement.createDevice({ name: deviceName, ownerId: owner.id })

        registrationToken.device = device
        await registrationToken.save()

        return res.status(ReturnCode.OK).json({ token: device.auth_key })
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
        const device1 = req.device
        const device = await Device.findOne({
            where: { id: device1.id },
            relations: ["status", "status.ipAddresses"]
        })
        if (device == undefined) return res.status(ReturnCode.BAD_REQUEST).end()

        const statusParsed = JSON.parse(status) as ISystemStatus
        if (device.status != undefined) {
            await SystemIP.remove(device.status.ipAddresses)
        }

        device.status = SystemStatus.copyFromJSON(statusParsed, device)
        device.updateLastSeen()

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
        // @ts-ignore
        const user = req.user as User
        const devices = await DeviceManagement.getDevicesAccessibleByUser({
            userId: user.id,
            considerAdmin: false
        })
        const devicesSend = devices.map((device) => {
            const deviceSend: any = Object.assign({}, device)
            if (
                (Date.now() - deviceSend.lastSeen.getTime()) / 1000 < 1000 &&
                deviceSend.state == DeviceState.UNKNOWN
            )
                deviceSend.state = DeviceState.RUNNING
            deviceSend.auth_key = undefined
            return deviceSend
        })

        return res.status(ReturnCode.OK).json(devicesSend)
    } catch (e) {
        console.error(e)
        return res.status(ReturnCode.INTERNAL_SERVER_ERROR).end()
    }
}

const listDeviceIDs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // @ts-ignore
        const user = req.user as User
        const devices = await DeviceManagement.getDevicesAccessibleByUser({
            userId: user.id,
            considerAdmin: false
        })
        const devicesSend = devices.map((device) => device.id)

        return res.status(ReturnCode.OK).json(devicesSend)
    } catch (e) {
        console.error(e)
        return res.status(ReturnCode.INTERNAL_SERVER_ERROR).end()
    }
}

const getDeviceStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // @ts-ignore
        const deviceID = getDataFromAny(req, "deviceID")
        if (deviceID == undefined) return res.status(ReturnCode.MISSING_PARAMS).end()
        const status = (
            await Device.findOne({
                where: { id: deviceID },
                relations: ["status", "status.ipAddresses"]
            })
        )?.status ?? {
            uptimeSeconds: 0,
            cpuUsage: {
                avg15m: 0,
                avg1m: 0,
                avg5m: 0
            },
            ipAddresses: []
        }

        return res.status(ReturnCode.OK).json(status)
    } catch (e) {
        console.error(e)
        return res.status(ReturnCode.INTERNAL_SERVER_ERROR).end()
    }
}

export const getBasicDevice = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // @ts-ignore
        const deviceID = getDataFromAny(req, "deviceID")
        if (deviceID == undefined) return res.status(ReturnCode.MISSING_PARAMS).end()
        const device = await DeviceManagement.getDevice(deviceID)
        if (device == undefined) return res.status(ReturnCode.BAD_REQUEST).end()

        const deviceSend: any = Object.assign({}, device)
        if (
            (Date.now() - deviceSend.lastSeen.getTime()) / 1000 / 60 < 1000 &&
            deviceSend.state == DeviceState.UNKNOWN
        )
            deviceSend.state = DeviceState.RUNNING

        deviceSend.auth_key = undefined

        return res.status(ReturnCode.OK).json(deviceSend)
    } catch (e) {
        console.error(e)
        return res.status(ReturnCode.INTERNAL_SERVER_ERROR).end()
    }
}

export const getDetailedDevice = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // @ts-ignore
        const user = req.user as User
        const deviceID = getDataFromAny(req, "deviceID")
        if (deviceID == undefined) return res.status(ReturnCode.MISSING_PARAMS).end()

        const device = await DeviceManagement.getDevice({ id: deviceID }, [
            "status",
            "status.ipAddresses",
            "software"
        ])
        if (device == undefined) return res.status(ReturnCode.UNPROCESSABLE_ENTITY).end()
        if (
            await DeviceManagement.isAccessibleByUser({
                deviceId: device.id,
                userId: user.id,
                considerAdmin: true
            })
        )
            return res.status(ReturnCode.OK).json(device)
        else return res.status(ReturnCode.UNAUTHORIZED).end()
    } catch (e) {
        console.error(e)
        return res.status(ReturnCode.INTERNAL_SERVER_ERROR).end()
    }
}

const editDevice = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // @ts-ignore
        const user = req.user as User
        const deviceID = getDataFromAny(req, "deviceID")
        if (deviceID == undefined) return res.status(ReturnCode.MISSING_PARAMS).end()

        const device = await DeviceManagement.getDeviceAccessibleByUser({
            userId: user.id,
            deviceId: deviceID
        })
        if (device == undefined) return res.status(ReturnCode.UNPROCESSABLE_ENTITY).end()
        if (device.owner.id != user.id && !userIsAdmin(user))
            return res.status(ReturnCode.UNAUTHORIZED).end()

        const edits = req.body as requests.DeviceEditRequest
        if (edits.delete) {
            await DeviceManagement.deleteDevice({ userId: user.id, deviceId: deviceID })
            return res.status(ReturnCode.OK).end()
        }
        if (edits.newGroupId != undefined) {
            const group = await GroupManagement.moveDeviceToGroup({
                deviceId: deviceID,
                groupId: edits.newGroupId
            })
            return res
                .status(group?.id == edits.newGroupId ? ReturnCode.OK : ReturnCode.BAD_REQUEST)
                .end()
        }
        return res.status(ReturnCode.UNPROCESSABLE_ENTITY).end()
    } catch (e) {
        console.error(e)
        return res.status(ReturnCode.INTERNAL_SERVER_ERROR).end()
    }
}

// TODO add editing of device

deviceRoutes.post("/registerDevice", checkRegistrationToken, registerDevice)
deviceRoutes.post("/pushSystemStatus", checkDeviceToken, pushSystemStatus)
deviceRoutes.get("/list", checkLoggedIn, listDevices)
deviceRoutes.get("/listIDs", checkLoggedIn, listDeviceIDs)
deviceRoutes.get("/:deviceID/state", checkLoggedIn, getDeviceStatus)
deviceRoutes.get("/:deviceID/basic", checkLoggedIn, getBasicDevice)
deviceRoutes.get("/:deviceID/details", checkLoggedIn, getDetailedDevice)
deviceRoutes.post("/:deviceID/edit", checkLoggedIn, editDevice)
deviceRoutes.post("/createDeviceRegistrationToken", checkLoggedIn, createDeviceRegistrationToken)
deviceRoutes.get("/checkDeviceRegistrationToken", checkLoggedIn, checkDeviceRegistrationToken)

export default deviceRoutes
