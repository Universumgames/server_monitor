import { User, UserSession } from "./entities/entities"
import { CookieOptions, Request, Response } from "express"
import { config } from "./monitor_config"

export const cookieName = "server_monitor_data"

/**
 * create cookie config with expiration date
 * @param {UserSession} session the user session
 * @return {CookieConfig} necessary cookie config for express
 */
export function cookieConfig(session: UserSession): CookieOptions {
    return { httpOnly: true, sameSite: "strict", expires: session.expires }
}

/**
 * Add cookie to response
 * @param {express.Response} res the express response process
 * @param {UserSession} session the user session
 * @return {express.Response} the express response process
 */
export function addSessionCookie(res: Response, session: UserSession): Response {
    return res.cookie(cookieName, { sessionToken: session.token }, cookieConfig(session))
}

/**
 * Get cookie from request
 * @param {express.Request} req the express request process
 * @return {Cookie} the cookie
 */
export function getSessionToken(req: Request): string | null {
    return getDataFromAny(req, "sessionToken")
}

/**
 * Get deviceToken from cookie or from request body
 * @param {express.Request} req the express request process
 * @return {string} the deviceToken
 */
export function getDeviceToken(req: Request): string | null {
    return getDataFromAny(req, "deviceToken")
}

/**
 * get data from cookie, request body or query
 * @param {express.Request} req the exporess request process
 * @param {string} dataKey the key of the data to get
 * @return {string} the data from any source
 */
export function getDataFromAny(req: Request, dataKey: string): string | boolean | any | undefined {
    if (req.cookies != undefined) {
        const cookie = req.cookies[cookieName]
        if (cookie != undefined) {
            const key = cookie[dataKey] as string
            if (key != undefined) return key
        }
    }
    if (req.body != undefined && req.body[dataKey] != undefined) return req.body[dataKey] as string
    if (req.query != undefined && req.query[dataKey] != undefined)
        return req.query[dataKey] as string
    if (req.params != undefined && req.params[dataKey] != undefined)
        return req.params[dataKey] as string
    return undefined
}

/**
 * check if a user is admin
 * @param {User} user the user to check
 * @return {boolean} true, when user is admin, false otherwise
 */
export function userIsAdmin(user: User): boolean {
    return user.admin || userIsSuperAdmin(user)
}

/**
 * check if a user is super admin
 * @param {User} user the user to check
 * @return {boolean} true, when user is super admin, false otherwise
 */
export function userIsSuperAdmin(user: User): boolean {
    return config.superAdmin.mail.toLowerCase() == user.email.toLowerCase()
}

/**
 * get unique values from array
 * @param {T[]} arr the array to get unique values from
 * @return {T[]} the unique values
 */
export function unique<T>(arr: T[]): T[] {
    return [...new Set(arr)]
}
