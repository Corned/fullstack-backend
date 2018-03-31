const router = require("express").Router()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const User = require("../models/user")

router.post("/", async (request, response) => {
	const body = request.body

	try {
		const user = await User.findOne({ username: body.username })
		const passwordCorrect = user === null ? false : await bcrypt.compare(body.password, user.passwordHash)
		
		if (!(user && passwordCorrect)) {
			return response.status(401).json({ error: "invalid username or password" })
		}

		const token = jwt.sign({
			username: user.username,
			id: user._id
		}, process.env.SECRET)
		
		response.status(200).json({ token, user })
	} catch (exception) {
		console.log(exception)
		response.status(500).json({ error: "something went wrong" })
	}
})

module.exports = router