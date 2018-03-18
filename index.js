const http = require("http")
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")

const config = require("./utils/configuration")
const middleware = require("./utils/middleware")

async function establishDatabaseConnection() {
	try {
		mongoose.Promise = global.Promise
		await mongoose.connect(config.mongoUri)
		console.log("Connected to databse!")
	} catch (error) {
		console.log(error);
	}
}

app.use(cors())
app.use(bodyParser.json())
app.use(middleware.tokenExtractor)

const app = express()
const server = http.createServer(app)

server.listen(config.port, () => {
	console.log(`Server running on port ${config.port}`)
})

server.on("close", () => {
	mongoose.connection.close()
})

module.exports = { app, server }