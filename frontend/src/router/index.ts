import { createRouter, createWebHistory } from "vue-router"
import Home from "../views/Home.vue"

const routes = [
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

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
