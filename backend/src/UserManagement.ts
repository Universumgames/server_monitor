import { config } from "./monitor_config"
import { Device, Group, User, UserSession } from "./entities/entities"
import getMailManager from "./MailManager"
import { Request } from "express"

/**
 * User management class
 */
export default class UserManagement {
    /**
     * get user by id
     * @param {{string, string}} data user data to find user
     * @param {string[]} additionalRelations additional relations to load
     * @return {User | undefined} the user or undefined
     */
    static async getUser(
        data: { id?: string; userame?: string; mail?: string; sessionToken?: string },
        additionalRelations: string[] = []
    ): Promise<User | undefined> {
        let userId = data.id
        if (data.sessionToken != undefined) {
            const session = await UserSession.findOne({
                where: { token: data.sessionToken },
                relations: ["user"]
            })
            if (session != undefined) userId = session.user.id
        }
        return await User.findOne({
            where: { id: userId, username: data.userame, email: data.mail },
            relations: [...["groups"], ...additionalRelations]
        })
    }

    /**
     * Create a new user
     * @param {{string, string}} data user data to create user
     * @return {User} the created user
     */
    static async createUser(data: { username: string; email: string }): Promise<User> {
        const user = new User()
        user.username = data.username
        user.email = data.email
        user.userGroup = new Group()
        user.userGroup.name = data.username
        user.userGroup.owner = user
        await user.userGroup.save()
        return await user.save()
    }

    /**
     * Get all devices owned by a user
     * @param {{string}} data user data to find user
     * @return {Device[] | undefined} the devices or undefined
     */
    static async getOwnDevices(data: { id: string }): Promise<Device[] | undefined> {
        const user = await UserManagement.getUser({ id: data.id }, ["owns"])
        if (user == undefined) return undefined
        return user.owns
    }

    /**
     * create new session
     * @param {{string}} data user data to find user
     * @return {UserSession} the created session
     */
    static async createSession(data: { userId: string }): Promise<UserSession | undefined> {
        const session = new UserSession()
        const user = await UserManagement.getUser({ id: data.userId })
        if (user == undefined) return undefined
        session.user = user
        return await session.save()
    }

    /**
     * create a session and send a login mail
     * @param {{User, Request}} data user data to find user
     * @return {void}
     */
    static async createAndSendLoginMail(data: { user: User; req: Request }): Promise<void> {
        const session = await UserManagement.createSession({ userId: data.user.id })
        if (session == undefined) return
        getMailManager().sendMail({
            from: config.mailServer.user,
            to: data.user.email,
            subject: "Login to Server Monitor",
            text: `You can login to the server monitor with the following link: ${urlBuilder(
                data.req,
                session.token
            )}`
        })
    }

    /**
     * ensure that the admin user exists
     * @return {void}
     */
    static async ensureAdminUser(): Promise<void> {
        const admin = await UserManagement.getUser({ mail: config.superAdmin.mail })
        if (admin != undefined) return
        const newAdmin = await UserManagement.createUser({
            email: config.superAdmin.mail,
            username: config.superAdmin.username ?? "Admin"
        })
        newAdmin.admin = true
        await newAdmin.save()
    }
}

/**
 * Build login url sent via mail
 * @param {Request} req express request object
 * @param {string} loginKey the users login key
 * @return {string} the login url
 */
function urlBuilder(req: Request, loginKey: string): string {
    const port = req.app.settings.port || config.frontEndPort
    return (
        req.protocol +
        "://" +
        req.headers.host +
        (port == 80 || port == 443 ? "" : ":" + port) +
        "/api/user/login?token=" +
        encodeURIComponent(loginKey)
    )
}
