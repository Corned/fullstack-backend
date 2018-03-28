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
	const users = await User
		.find({})
		.populate("posts", { _id: 1, title: 1, type: 1 })
		.populate("communities", { _id: 1, name: 1 })
		.populate("ownedCommunities", { _id: 1, name: 1 })
		.populate("moderatorCommunities", { _id: 1, name: 1 })

	response.json(users.map(User.format))
})

// Specific User data
router.get("/:username", async (request, response) => {
	const user = await User
		.findOne({ username: request.params.username })
		.populate("posts", { _id: 1, title: 1, type: 1 })
		.populate("communities", { _id: 1, name: 1 })
		.populate("ownedCommunities", { _id: 1, name: 1 })
		.populate("moderatorCommunities", { _id: 1, name: 1 })

	response.json(User.format(user))
})

// new user
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
