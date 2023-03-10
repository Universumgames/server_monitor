import { UserSession } from "../entities/UserSession"
import express, { NextFunction, Request, Response } from "express"
import { ReturnCode } from "server_mgt-lib/ReturnCode"
import UserManagement from "../UserManagement"
import { addSessionCookie, cookieName, getDataFromAny, userIsAdmin } from "../helper"
import { checkAdmin, checkLoggedIn } from "./routehelper"
import { User } from "../entities/User"

// eslint-disable-next-line new-cap
const userRoutes = express.Router()

/* const test = async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({
        message: "Test successful"
    })
} */

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const requestMailData = getDataFromAny(req, "requestMailData")
        const token = getDataFromAny(req, "token")
        if (requestMailData == undefined && token == undefined)
            return res.status(ReturnCode.MISSING_PARAMS).end()

        if (token != undefined) {
            const user = await UserManagement.getUser({ sessionToken: token })
            if (user == undefined) return res.status(ReturnCode.UNAUTHORIZED).end()
            const session = await UserSession.findOne({ where: { token: token } })
            if (session == undefined) return res.status(ReturnCode.UNAUTHORIZED).end()
            return addSessionCookie(res.status(ReturnCode.OK), session).end()
        } else {
            let user = await UserManagement.getUser({ mail: requestMailData })
            if (user == undefined)
                user = await UserManagement.getUser({ username: requestMailData })
            if (user == undefined) return res.status(ReturnCode.UNAUTHORIZED).end()
            await UserManagement.createAndSendLoginMail({ user, req })
            return res.redirect("/")
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

const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // @ts-ignore
        const user = req.user as User
        if (user == null) return res.status(ReturnCode.UNAUTHORIZED).end()

        const session = await UserSession.findOne({ where: { user: { id: user.id } } })
        if (session == undefined) return res.status(ReturnCode.UNAUTHORIZED).end()
        await session.remove()
        return res.status(ReturnCode.OK).clearCookie(cookieName).end()
    } catch (error) {
        console.error(error)
        return res.status(ReturnCode.INTERNAL_SERVER_ERROR).end()
    }
}

const getBasicUserData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // @ts-ignore
        const user = req.user as User

        const responseUser = {
            id: user.id,
            email: user.email,
            username: user.username,
            admin: user.admin || userIsAdmin(user)
        }
        return res.status(ReturnCode.OK).json(responseUser)
    } catch (error) {
        console.error(error)
        return res.status(ReturnCode.INTERNAL_SERVER_ERROR).end()
    }
}

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const username = getDataFromAny(req, "username")
        const email = getDataFromAny(req, "email")
        if (username == undefined || email == undefined)
            return res.status(ReturnCode.MISSING_PARAMS).end()

        const user = await UserManagement.createUser({ username, email })
        if (user == undefined) return res.status(ReturnCode.BAD_REQUEST).end()

        await UserManagement.createAndSendLoginMail({ user, req })
        return res.status(ReturnCode.OK).end()
    } catch (error) {
        console.error(error)
        return res.status(ReturnCode.INTERNAL_SERVER_ERROR).end()
    }
}

userRoutes.all("/login", login)
userRoutes.get("/logout", checkLoggedIn, logout)
userRoutes.get("/isLoggedIn", checkLoggedIn, isLoggedIn)
userRoutes.get("/basicUserData", checkLoggedIn, getBasicUserData)
userRoutes.post("/createUser", checkLoggedIn, checkAdmin, createUser)

export default userRoutes
