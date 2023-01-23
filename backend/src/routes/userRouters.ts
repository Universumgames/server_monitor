import { UserSession } from "entities/UserSession"
import express, { NextFunction, Request, Response } from "express"
import { ReturnCode } from "server_mgt-lib/ReturnCode"
import UserManagement from "../UserManagement"
import { addSessionCookie, getDataFromAny } from "../helper"
import { checkLoggedIn } from "./routehelper"

// eslint-disable-next-line new-cap
const userRoutes = express.Router()

/* const test = async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({
        message: "Test successful"
    })
} */

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const mail = getDataFromAny(req.body, "mail")
        const token = getDataFromAny(req.body, "token")
        if (mail == undefined && token == undefined) return res.status(ReturnCode.BAD_REQUEST).end()

        if (token != undefined) {
            const user = await UserManagement.getUser({ sessionToken: token })
            if (user == undefined) return res.status(ReturnCode.UNAUTHORIZED).end()
            const session = await UserSession.findOne({ token: token })
            if (session == undefined) return res.status(ReturnCode.UNAUTHORIZED).end()
            return addSessionCookie(res.status(ReturnCode.OK), session).end()
        } else {
            const user = await UserManagement.getUser({ mail: mail })
            if (user == undefined) return res.status(ReturnCode.BAD_REQUEST).end()
            await UserManagement.createAndSendLoginMail({ user, req })
            return res.status(ReturnCode.OK).end()
        }
    } catch (error) {
        console.error(error)
        return res.status(ReturnCode.INTERNAL_SERVER_ERROR).end()
    }
}

const isLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // @ts-ignore
        return req.user != undefined
            ? res.status(ReturnCode.OK).end()
            : res.status(ReturnCode.UNAUTHORIZED).end()
    } catch (error) {
        console.error(error)
        return res.status(ReturnCode.INTERNAL_SERVER_ERROR).end()
    }
}

userRoutes.post("/login", login)
userRoutes.get("/isLoggedIn", checkLoggedIn, isLoggedIn)

export default userRoutes
