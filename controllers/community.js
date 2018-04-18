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

router.get("/:community", async (request, response) => {
	const community = await Community
		.findOne({ name: request.params.community })
		.populate("moderators", { _id: 1, username: 1 })
		.populate("members", { _id: 1, username: 1 })
		.populate("owner", { _id: 1, username: 1 })
		.populate("banned", { _id: 1, username: 1 })
		.populate("posts", { title: 1, type: 1, date: 1, body: 1, url: 1, user: 1, community: 1 })

	response.json(Community.format(community))
})

router.post("/", async (request, response) => {
	const body = request.body
	try {
		const token = request.token
		const decodedToken = jwt.verify(token, process.env.SECRET)
		
		if (!token || !decodedToken.id) {
			return response.status(401).json({ error: "token missing or invalid" })
		}

		body.owner = decodedToken.id

		if (body.name === undefined) {
			return response.status(400).json({ error: "name is missing" })
		}			
				
		const user = await User.findById(body.owner)
		const communities = await Community.find({ name: body.name })
		
		if (user === null) {
			// Should never happen
			return response.status(400).json({ error: "this should never happen (user is missing but authentication worked)" })
		} 
		
		if (communities.length > 0) {
			return response.status(400).json({ error: "name already taken" })
		} 		

		const community = new Community({
			name: body.name,
			owner: body.owner,
			moderators: [ body.owner ],
			members: [ body.owner ],
			banned: [],
			posts: []
		})
		
		user.communities = [ ...user.communities, community ]
		user.ownedCommunities = [ ...user.ownedCommunities, community ]
		user.moderatorCommunities = [ ...user.moderatorCommunities, community ]
		await user.save()		
		const savedCommunity = await community.save()
		
		response.status(201).json(savedCommunity)
	} catch (exception) {
		if (exception.name === "JsonWebTokenError") {
			response.status(401).json({ error: exception.message })
		} else {
			console.log(body)
			console.log(exception)
			response.status(500).json({ error: "Oops!" })
		}
	}
})

router.delete("/:id", async (request, response) => {
	const id = request.params.id
})

module.exports = router
