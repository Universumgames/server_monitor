import nodeconfig from "config"

export const config = {
    database: {
        type: nodeconfig.get<string>("database.type"),
        host: nodeconfig.get<string>("database.host"),
        port: nodeconfig.get<number>("database.port"),
        rootPW: nodeconfig.get<string>("database.rootPW"),
        name: nodeconfig.get<string>("database.name")
    },
    serverPort: nodeconfig.get<number>("serverPort"),
    frontEndPort: nodeconfig.get<number>("frontEndPort"),
    url: nodeconfig.get<string>("url"),
    serverVersion: nodeconfig.get<string>("serverVersion"),
    superAdmin: {
        mail: nodeconfig.get<string>("superAdmin.mail"),
        username: nodeconfig.get<string | undefined>("superAdmin.username")
    },
    mailServer: {
        host: nodeconfig.get<string>("mailServer.host"),
        port: nodeconfig.get<number>("mailServer.port"),
        secure: nodeconfig.get<boolean>("mailServer.secure"),
        user: nodeconfig.get<string>("mailServer.user"),
        password: nodeconfig.get<string>("mailServer.password")
    }
}
