const router = require("express").Router()
const User = require("../models/user")

const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

/*

GET
	/api/user
	/api/user/:id
*/


router.get("/", async (request, response) => {
	const Users = await User
		.find({})
		// .populate("user", {_id: 1, username: 1})

	response.json(Users.map(User.format))
})

// Specific User data
router.get("/:username", async (request, response) => {

})

router.post("/", async (request, response) => {
	const body = request.body

	try {
		if (body.password === undefined) {
			return response.status(400).json({ error: "Password missing" })
		} else if (body.password.length < 6) {
			return response.status(400).json({ error: "Password too short ( <6 ) "})
		}

		const users = await User.find({ username: body.username })
		if (users.length > 0) {
			return response.status(400).json({ error: "Username already in use" })
		} 		

		const saltRounds = 11
		const passwordHash = await bcrypt.hash(body.password, saltRounds)

		const user = new User({
			username: body.username,
			passwordHash,
			ownedCommunities: [],
			posts: [],
			upvoted: [],
			downvotes: [],
			saved: [],
			comments: []
		})

		const savedUser = await user.save()
		response.status(201).json(savedUser) 


	} catch (exception) {
		console.log(exception)
		response.status(500).json({ error: exception })
	}
})

router.delete("/:id", async (request, response) => {
	const id = request.params.id

	
})

module.exports = router
