const router = require("express").Router()
const Post = require("../models/post")

const jwt = require("jsonwebtoken")


/*

GET
	/api/post/ <-- c/all
	/api/post/:community <-- hot
	/api/post/:community/new
	/api/post/:community/top
	/api/post/:community/controversial

*/


router.get("/", async (request, response) => {
	const posts = await Post
		.find({})
		.populate("user", { _id: 1, username: 1 })
		.populate("community", { _id: 1, name: 1 })

	response.json(posts.map(Post.format))
})

// Specific post data
router.get("/:id", async (request, response) => {

})

router.get("/c/:community/hot", async(request, response) => {
	
})

router.get("/c/:community/new", async(request, response) => {
	
})

router.get("/c/:community/top", async(request, response) => {
	
})

router.get("/c/:community/controversial", async(request, response) => {
	
})


router.post("/", async (request, response) => {
	const body = request.body
	try {
		if (body.community === undefined) {
			return response.status(400).json({ error: "Community missing" })
		} if (body.type === undefined) {
			return response.status(400).json({ error: "Type missing" })
		} else if (body.type !== "link" && body.type !== "text") {
			return response.status(400).json({ error: "Invalid body type" })
		} else if (body.type === "link" && body.url === undefined) {
			return response.status(400).json({ error: "Link missing" })
		} else if (body.type === "text" && body.body === undefined) {
			return response.status(400).json({ error: "Body missing" })
		}

		const post = new Post({
			title: body.title,
			user: body.user,
			date: new Date(),
			type: body.type,
			url: body.url,
			body: body.body,
			community: body.community
		})

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
