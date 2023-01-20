import { Request } from "express"

export const cookieName = "server_monitor_data"

/**
 * Get deviceToken from cookie or from request body
 * @param {express.Request} req the express request process
 * @return {string} the deviceToken
 */
export function getDeviceToken(req: Request): string | undefined {
    return getDataFromAny(req, "deviceToken")
}

/**
 * get data from cookie, request body or query
 * @param {express.Request} req the exporess request process
 * @param {string} dataKey the key of the data to get
 * @return {string} the data from any source
 */
export function getDataFromAny(req: Request, dataKey: string): string | undefined {
    if (req.cookies != undefined) {
        const cookie = req.cookies[cookieName]
        if (cookie != undefined) {
            const key = cookie[dataKey] as string
            if (key != undefined) return key
        }
    }
    if (req.body != undefined && req.body[dataKey] != undefined)
        return req.body[dataKey] as string
    if (req.query != undefined && req.query[dataKey] != undefined)
        return req.query[dataKey] as string
    if (req.params != undefined && req.params[dataKey] != undefined)
        return req.params[dataKey] as string
    return undefined
}

/**
 * check if a register token for registering a new device is valid
 * @param {string} registerToken the token to check
 * @return {boolean} true, when token is valid, false otherwise
 */
export function registerTokenIsValid(registerToken: string): boolean {
    return registerToken == ""
}
