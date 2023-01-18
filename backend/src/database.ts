import { Connection, createConnection } from "typeorm"
import { config } from "./monitor_config"

/**
 * Database class to manage access to database
 */
export default class Database {
    private dbConnection: Connection

    private static instance: Database
    /**
     * Create basic database object
     */
    constructor() {
        Database.instance = this
    }

    /**
     * Initialise databse
     */
    async init() {
        try {
            this.dbConnection = await createConnection({
                type: config.database.type as any,
                host: config.database.host,
                port: config.database.port,
                username: "root",
                password: config.database.rootPW,
                database: config.database.name,
                // eslint-disable-next-line no-undef
                entities: [__dirname + "/entities/entities.js"],
                synchronize: true,
                logging: false
            })
            /* const repo = this.dbConnection.getRepository(User)
            const u = new User()
            const u2 = await repo.findOne({ where: { mail: "test@test.com" } })
            Object.assign(u, u2)
            u.firstName = "tom"
            u.lastName = "a"
            u.mail = "test@test.com"
            u.username = "universum"
            u.active = true
            await repo.save(u) */
        } catch (e) {
            console.error("Connection failed", e)
        }
    }

    /**
     * get typeorm Database connection object
     */
    get connection(): Connection {
        return this.dbConnection
    }

    /**
     * get singleton instance of Database
     * @return {Database} singleton instance of Database
     */
    static getInstance(): Database {
        return this.instance
    }
}
