
import express, { NextFunction, Request, Response } from "express"
import { ReturnCode } from "server_mgt-lib/ReturnCode"
import { getDataFromAny } from "../helper"
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
        const username = getDataFromAny(req, "username")
        const password = getDataFromAny(req, "password")
        if (username == undefined || password == undefined)
            return res.status(ReturnCode.BAD_REQUEST).end()


        // TODO implement login

        return res.status(ReturnCode.OK).end()
    } catch (error) {
        console.error(error)
        return res.status(ReturnCode.INTERNAL_SERVER_ERROR).end()
    }
}

const isLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // @ts-ignore
        return req.user != undefined
            ? res.status(ReturnCode.OK).end() : res.status(ReturnCode.UNAUTHORIZED).end()
    } catch (error) {
        console.error(error)
        return res.status(ReturnCode.INTERNAL_SERVER_ERROR).end()
    }
}

userRoutes.post("/login", login)
userRoutes.get("/isLoggedIn", checkLoggedIn, isLoggedIn)


export default userRoutes
