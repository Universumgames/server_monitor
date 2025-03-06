import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import vueJsx from "@vitejs/plugin-vue-jsx"
import VueDevTools from "vite-plugin-vue-devtools"

const path = require("path")

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), vueJsx(), VueDevTools()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src")
        }
    },
    server: {
        proxy: {
            "^/api": {
                target: "http://localhost:6060",
                changeOrigin: true,
                ws: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api/, "")
            }
        },
        host: "0.0.0.0",
        port: 8080
    }
})
