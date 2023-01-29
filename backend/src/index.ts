// import http from "http"
import Router from "./router"
import apiRoutes from "./routes/apiroutes"
import { config } from "./monitor_config"
import Database from "./database"
import { createMailManager } from "./MailManager"
import UserManagement from "./UserManagement"
import "reflect-metadata"

const db = new Database()
db.init()

const mailManager = createMailManager()

/**
 * Test mail connection
 */
async function init() {
    const mailTest = await mailManager.testConnection()
    console.log("Connection to mail server is " + (mailTest ? "successful" : "not successful"))
    await UserManagement.ensureAdminUser()
}

init()

const router = new Router(config.serverPort)

router.addRoutes("/", apiRoutes)
router.startServer()
