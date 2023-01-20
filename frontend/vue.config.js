/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
// eslint-disable-next-line no-undef
module.exports = {
    devServer: {
        proxy: {
            "^/api": {
                target: "http://localhost:6060",
                changeOrigin: true,
                ws: true,
                disableHostCheck: true,
                pathRewrite: {
                    "^/api": ""
                }
            }
        },
        disableHostCheck: true,
        // https: true,
        port: 8080
    }
}
