import { User } from "./entities/User"

/**
 * User management class
 */
export default class UserManagement {
    /**
     * get user by id
     * @param {{string, string}} data user data to find user
     * @return {User | undefined} the user or undefined
     */
    static async getUser(data: { id?: string; userame?: string }): Promise<User | undefined> {
        return await User.findOne({
            where: { id: data.id, username: data.userame },
            relations: ["groups"]
        })
    }

    /**
     * Create a new user
     * @param {{strng, string}} data user data to create user
     * @return {User} the created user
     */
    static async createUser(data: { username: string; email: string }): Promise<User> {
        const user = new User()
        user.username = data.username
        user.email = data.email
        return await user.save()
    }
}
