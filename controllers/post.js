const router = require("express").Router()
const Post = require("../models/post")
const User = require("../models/user")
const Community = require("../models/community")

const jwt = require("jsonwebtoken")

router.get("/", async (request, response) => {
	const posts = await Post
		.find({})
		.populate("user", { _id: 1, username: 1 })
		.populate("community", { _id: 1, name: 1 })

	response.json(posts.map(Post.format))
})

// Specific post data
router.get("/:id", async (request, response) => {
	const post = await Post
		.findById(request.params.id)
		.populate("user", { _id: 1, username: 1 })
		.populate("community", { _id: 1, name: 1 })

	response.json(Post.format(post))
})

router.get("/c/:community", async (request, response) => {
	try {
		const community = await Community
			.findOne({ name: request.params.community })

		if (community === undefined) {
			return response.json(400).json({ error: "community not found" })
		}

		const posts = await Post
			.find({ community: community._id })
			.populate("user", { _id: 1, username: 1 })
			.populate("community", { _id: 1, name: 1 })

		response.json(posts.map(Post.format))
	} catch (exception) {
		response.status(500).json({ error: "oops" })
	}

})

router.post("/", async (request, response) => {
	const body = request.body
	
	try {
		const token = request.token
		const decodedToken = jwt.verify(token, process.env.SECRET)

		if (!token || !decodedToken.id) {
			return response.status(401).json({ error: "token missing or invalid" })
		}

		const userid = decodedToken.id

		if (body.community === undefined) {
			return response.status(400).json({ error: "community missing" })
		} else if (body.title === undefined) {
			return response.status(400).json({ error: "title missing" })
		} else if (body.title.length < 3) {
			return response.status(400).json({ error: "title's length must be greater than 3"})
		} else if (body.type === undefined) {
			return response.status(400).json({ error: "type missing" })
		} else if (body.type !== "link" && body.type !== "text") {
			return response.status(400).json({ error: "invalid body type" })
		} else if (body.type === "link" && body.url === undefined) {
			return response.status(400).json({ error: "url missing" })
		} else if (body.type === "text" && body.body === undefined) {
			return response.status(400).json({ error: "body missing" })
		} else if (body.type === "text" && body.body.length < 3) {
			return response.status(400).json({ error: "body's length must be greater than 3" })
		}

		const user = await User.findById(userid)
		const community = await Community.findOne({ name: body.community })

		if (user === null) {
			return response.status(400).json({ error: "user missing" })
		} else if (community === null) {
			return response.status(400).json({ error: "community missing" })
		}

		const post = new Post({
			title: body.title,
			user: userid,
			community: community.id,
			date: new Date(),
			type: body.type,
			url: body.url,
			body: body.body
		})

		user.posts = [ ...user.posts, post ]
		community.posts = [ ...community.posts, post ]

		await user.save()
		await community.save()
		const savedPost = await post.save()
		
		response.status(201).json(savedPost)
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
