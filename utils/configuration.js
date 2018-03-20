
const node_env = process.env.NODE_ENV

if (node_env !== "production") {
	require("dotenv").config()
}

let port = process.env.PORT
let mongoUri = process.env.MONGODB_URI

if (node_env === "test") {
	port = process.env.TEST_PORT
	mongoUri = process.env.TEST_MONGODB_URI
}

module.exports = { port, mongoUri }