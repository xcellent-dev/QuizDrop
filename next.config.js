/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    env: {
        mongodburl: "mongodb://127.0.0.1:27017/quizdrop",
        rpcUrl: "http://127.0.0.1:7545"
    }
}
