import { createRouter, createWebHashHistory, createWebHistory } from "vue-router"
import Home from "../views/Home.vue"

const routes = [
    {
        path: "/",
        component: () => import(/* webpackChunkName: "layout" */ "../InteractiveApp.vue"),
        children: [
            {
                path: "/",
                name: "Devices",
                component: () => import("../views/DeviceList.vue"),
                meta: {
                    title: "Devicelist"
                },
                children: [
                    {
                        path: "/devices/:id",
                        name: "DeviceDetails",
                        component: () => import("../views/DeviceDetails.vue"),
                        meta: {
                            title: "Device Details"
                        }
                    }
                ]
            },
            {
                path: "/login",
                name: "Login",
                component: () => import("../views/Login.vue"),
                meta: {
                    title: "Login"
                }
            },
            {
                path: "/management",
                name: "Management",
                component: () => import("../views/Management/Management.vue"),
                meta: {
                    title: "Management"
                },
                children: [
                    {
                        path: "user",
                        name: "Usermanagement",
                        component: () => import("../views/Management/UserManagement.vue")
                    },
                    {
                        path: "group",
                        name: "Groupmanagement",
                        component: () => import("../views/Management/GroupManagement.vue")
                    },
                    {
                        path: "device",
                        name: "Devicemanagement",
                        component: () => import("../views/Management/DeviceManagement.vue")
                    }
                ]
            },
            {
                path: "/siteNotice",
                name: "SiteNotice",
                component: () => import("../views/SiteNotice.vue"),
                meta: {
                    title: "Site Notice"
                }
            },
            {
                path: "/register/:token?",
                name: "Register new Device",
                component: () => import("../views/DeviceRegistration.vue"),
                meta: {
                    title: "Register new Device"
                }
            }
        ]
    },
    {
        path: "/overview/:id?",
        component: () =>
            import(/* webpackChunkName: "layout" */ "../views/DeviceOverviewStandalone.vue"),
        meta: {
            title: "Device Overview"
        }
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL), // to use this, you would have to configure the webserver, see https://router.vuejs.org/guide/essentials/history-mode.html#hash-mode
    //history: createWebHashHistory(),
    routes
})

export default router
