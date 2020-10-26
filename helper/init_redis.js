const redis = require('redis')
const client = redis.createClient({
    port: 6379,
    host: "127.0.0.1"
})

client.on("connect", () => {
    console.log('redis connected...')
})

client.on("ready", () => {
    console.log("redis ready to use...")
})

client.on("error", (err) => {
    console.log(err.message)
})

client.on("end", () => {
    console.log("redis is disconnected...")
})

process.on('SIGINT', () => {
    client.end()
})

module.exports = client