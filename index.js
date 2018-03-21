const http = require("http")
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const morgan = require("morgan")

const config = require("./utils/configuration")
const middleware = require("./utils/middleware")

async function establishDatabaseConnection() {
	try {
		mongoose.Promise = global.Promise
		await mongoose.connect(config.mongoUri)
		console.log("Connected to database!")
	} catch (error) {
		console.log(error);
	}
}

const app = express()
const server = http.createServer(app)

morgan.token("body", req => JSON.stringify(req.body))
app.use(morgan(":method :url :body :status :res[content-length] - :response-time ms"))
app.use(cors())
app.use(bodyParser.json())
app.use(middleware.tokenExtractor)

// Controllers
app.use("/api/post", require("./controllers/post"))
app.use("/api/user", require("./controllers/user"))
app.use("/api/community", require("./controllers/community"))

server.listen(config.port, () => {
	establishDatabaseConnection()
	console.log(`Server running on port ${config.port}`)
})

server.on("close", () => {
	mongoose.connection.close()
})

module.exports = { app, server }