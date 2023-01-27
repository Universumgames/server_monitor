import { config } from "./monitor_config"
import { Device, Group, User, UserSession } from "./entities/entities"
import getMailManager from "./MailManager"
import { Request } from "express"
import GroupManagement from "./GroupManagement"
import Database from "./database"

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
        data: { id?: string; username?: string; mail?: string; sessionToken?: string },
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

        let whereClause: any = {}
        if (userId != undefined) whereClause = { ...whereClause, id: userId }
        if (data.username != undefined) whereClause = { ...whereClause, username: data.username }
        if (data.mail != undefined) whereClause = { ...whereClause, email: data.mail }

        Object.keys(whereClause).forEach((key) =>
            whereClause[key] === undefined ? delete whereClause[key] : {}
        )

        return await User.findOne({
            where: { ...whereClause },
            relations: Array.from(new Set([...["groups", "userGroup"], ...additionalRelations]))
        })
    }

    /**
     * get all users
     * @param {string[]} additionalRelations user data to find user
     * @return {User[]} the users
     */
    static async getUsers(additionalRelations: string[] = []): Promise<User[]> {
        return await User.find({
            relations: Array.from(new Set([...["groups", "userGroup"], ...additionalRelations]))
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
        await user.save()
        const userGroup = new Group()
        userGroup.name = data.username
        userGroup.owner = user
        await userGroup.save()
        user.groups = [userGroup]
        user.userGroup = userGroup
        await user.save()
        return user
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
     * Create new session
     * @param {{string}} data user data to find user
     * @return {UserSession} the created session
     */
    static async createSession(data: { userId: string }): Promise<UserSession | undefined> {
        const session = new UserSession()
        const user = await UserManagement.getUser({ id: data.userId })
        if (user == undefined) return undefined
        session.user = user
        // set expiration to 3 months
        session.expires = new Date()
        session.expires.setMonth(session.expires.getMonth() + 3)
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

        if (admin != undefined) {
            // admin.userGroup.owner = admin
            // await admin.userGroup.save()
            return
        }
        const newAdmin = await UserManagement.createUser({
            email: config.superAdmin.mail,
            username: config.superAdmin.username ?? "Admin"
        })
        newAdmin.admin = true
        await newAdmin.save()
    }

    /**
     * delete a user
     * @param {{string}} data user data to find user
     * @return {void}
     */
    static async deleteUser(data: { userId: string }): Promise<void> {
        const user = await UserManagement.getUser({ id: data.userId }, [
            "groups",
            "groups.owner",
            "userGroup",
            "userGroup.owner"
        ])
        if (user == undefined) return
        const devices = await UserManagement.getOwnDevices({ id: data.userId })
        if (devices != undefined) {
            for (const device of devices) {
                await device.remove()
            }
        }

        user.userGroup = null
        await user.save()

        const groupsFromUser = (await GroupManagement.getGroups()).filter(
            (group) => group.owner.id == user.id
        )

        for (const group of groupsFromUser) {
            const users = await GroupManagement.getUsersInGroup({ groupId: group.id })
            if (users != undefined) {
                for (const user of users) {
                    await GroupManagement.removeUserFromGroup({
                        userId: user.id,
                        groupId: group.id
                    })
                }
            }

            await Group.remove(group)
        }

        user.groups = []
        await user.save()

        await User.remove(user)
    }
}

/**
 * Build login url sent via mail
 * @param {Request} req express request object
 * @param {string} loginKey the users login key
 * @return {string} the login url
 */
function urlBuilder(req: Request, loginKey: string): string {
    // const port = req.app.settings.port || config.frontEndPort
    return config.url + "/user/login?token=" + encodeURIComponent(loginKey)
}
