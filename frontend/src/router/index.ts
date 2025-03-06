import { createRouter, createWebHashHistory } from "vue-router"

const routes = [
    {
        path: "/",
        component: () => import("../InteractiveApp.vue"),
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
            },
            {
                path: "/groups",
                name: "Groups",
                component: () => import("../views/GroupList.vue"),
                meta: {
                    title: "Groups"
                },
                children: [
                    {
                        path: "/groups/:id",
                        name: "GroupDetails",
                        component: () => import("../views/GroupEdit.vue"),
                        meta: {
                            title: "Group Details"
                        }
                    }
                ]
            }
        ]
    },
    {
        path: "/overview/:id?",
        component: () =>
            import("../views/DeviceOverviewStandalone.vue"),
        meta: {
            title: "Device Overview"
        }
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
})

export default router
