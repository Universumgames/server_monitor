// import http from "http"
import Router from "./router"
import apiRoutes from "./routes/apiroutes"
import { config } from "./monitor_config"
import Database from "./database"

const db = new Database()
db.init()

const router = new Router(config.serverPort)

router.addRoutes("/", apiRoutes)
router.startServer()
