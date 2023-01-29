import nodemailer from "nodemailer"
import { config } from "./monitor_config"

export interface Mail {
    from: string
    to: string
    subject: string
    text?: string
    html?: string
}

/**
 * Manager class to send mails
 */
class MailManager {
    private transporter: nodemailer.Transporter

    /**
     * Create new transporter object
     */
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: config.mailServer.host,
            port: config.mailServer.port,
            secure: config.mailServer.secure,
            auth: {
                user: config.mailServer.user,
                pass: config.mailServer.password
            }
        })
    }

    /**
     * Test connection to server
     * @return {Promise<boolean>} return true when connection is successful
     */
    testConnection(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.transporter.verify((error: any, success: any) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(true)
                }
            })
        })
    }

    /**
     * send a mail
     * @param {Mail} mail the mail you want to send
     * @return {Promise<any>} a Promise to get nodemailer mail info
     */
    async sendMail(mail: Mail): Promise<any> {
        return new Promise((resolve, reject) => {
            this.transporter.sendMail(mail, (error: Error | null, info: any) => {
                if (error) reject(error)
                else resolve(info)
            })
        })
    }
}

let mailManager: MailManager | null

/**
 * creates if not already present a new UserManager, if existent returns existing one
 * @return {MailManager} User Manager to manage all User todos
 */
export function createMailManager(): MailManager {
    if (mailManager == undefined) mailManager = new MailManager()
    return mailManager
}

/**
 * returns initialized user manager
 * @return {MailManager} current user manager
 */
export default function getMailManager(): MailManager {
    if (mailManager == undefined) mailManager = createMailManager()
    return mailManager
}
