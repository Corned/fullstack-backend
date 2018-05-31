const http = require("http")
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const morgan = require("morgan")

const establishDatabaseConnection = require("./utils/establishDatabaseConnection")
const config = require("./utils/configuration")
const middleware = require("./utils/middleware")

const app = express()
const server = http.createServer(app)

morgan.token("body", req => JSON.stringify(req.body))
app.use(express.static("build"))
app.use(morgan(":method :url :body :status :res[content-length] - :response-time ms"))
app.use(cors())
app.use(bodyParser.json())
app.use(middleware.tokenExtractor)

// Controllers
app.use("/api/comment", 	require("./controllers/comment"))
app.use("/api/community", 	require("./controllers/community"))
app.use("/api/login",		require("./controllers/login"))
app.use("/api/post", 		require("./controllers/post"))
app.use("/api/user", 		require("./controllers/user"))

/*
	Silly.

	The app would only send index.html to user only when GET /.
	Refreshing would've goofed everything up.
*/
const path = require("path")
app.get("/*", (req, res) => {
	res.sendFile(path.join(__dirname, "./build/index.html"), (err) => {
		if (err) {
		 	res.status(500).send(err)
		}
	})
})

server.listen(config.port, () => {
	establishDatabaseConnection(config.mongoUri)
	console.log(`Server running on port ${config.port}`)
})

server.on("close", () => {
	mongoose.connection.close()
})

module.exports = { app, server }