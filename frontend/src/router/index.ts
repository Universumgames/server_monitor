import { createRouter, createWebHashHistory, createWebHistory } from "vue-router"
import Home from "../views/Home.vue"

const routes = [
    {
        path: "/",
        component: () => import(/* webpackChunkName: "layout" */ "../InteractiveApp.vue"),
        children: [
            {
                path: "/home",
                name: "Home",
                component: Home
            },
            {
                path: "/about",
                name: "About",
                // route level code-splitting
                // this generates a separate chunk (about.[hash].js) for this route
                // which is lazy-loaded when the route is visited.
                component: () => import(/* webpackChunkName: "about" */ "../views/About.vue")
            },
            {
                path: "/",
                name: "Devices",
                component: () => import(/* webpackChunkName: "devices" */ "../views/DeviceList.vue")
            },
            {
                path: "/devices/:id",
                name: "Device",
                component: () => import(/* webpackChunkName: "device" */ "../views/DeviceDetails.vue")
            }
        ]
    },
    {
        path: "/overview/:id?",
        component: () => import(/* webpackChunkName: "layout" */ "../views/DeviceOverviewStandalone.vue")
    }

]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL), // to use this, you would have to configure the webserver, see https://router.vuejs.org/guide/essentials/history-mode.html#hash-mode
    //history: createWebHashHistory(),
    routes
})

export default router
