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
    serverVersion: nodeconfig.get<string>("serverVersion")
}
