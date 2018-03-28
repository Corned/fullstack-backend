const router = require("express").Router()
const Community = require("../models/community")
const User = require("../models/user")

const jwt = require("jsonwebtoken")


router.get("/", async (request, response) => {
	const communities = await Community
		.find({})
		.populate("moderators", { _id: 1, username: 1 })
		.populate("members", { _id: 1, username: 1 })
		.populate("owner", { _id: 1, username: 1 })
		.populate("banned", { _id: 1, username: 1 })
		.populate("posts", { _id: 1, title: 1, type: 1 })

	response.json(communities.map(Community.format))
})

router.post("/", async (request, response) => {
	const body = request.body
	try {
		const token = request.token
		const decodedToken = jwt.verify(token, process.env.SECRET)

		if (!token || !decodedToken.id) {
			return response.status(401).json({ error: "Token missing or invalid" })
		}

		body.owner = decodedToken.id

		if (body.name === undefined) {
			return response.status(400).json({ error: "Name missing" })
		} else if (body.owner === undefined) {
			return response.status(400).json({ error: "Owner missing" })
		}				
		
		// Get User from user id
		const user = await User.findById(body.owner)
		if (user === null) {
			return response.status(400).json({ error: "User missing" })
		} 
		
		const communities = await Community.find({ name: body.name })
		if (communities.length > 0) {
			return response.status(400).json({ error: "Community name already taken" })
		} 		

		const community = new Community({
			name: body.name,
			owner: body.owner,
			moderators: [ body.owner ],
			members: [ body.owner ],
			banned: [],
			posts: []
		})

		const savedCommunity = await community.save()

		response.status(201).json(savedCommunity)
	} catch (exception) {
		if (exception.name === "JsonWebTokenError") {
			response.status(401).json({ error: exception.message })
		} else {
			console.log(exception)
			response.status(500).json({ error: "Oops!" })
		}
	}
})

router.delete("/:id", async (request, response) => {
	const id = request.params.id
})

module.exports = router
