const router = require("express").Router()

const Comment = require("../models/comment")
const Community = require("../models/community")
const Post = require("../models/post")
const User = require("../models/user")

const jwt = require("jsonwebtoken")

router.get("/", async (request, response) => {
	const comments = await Comment
		.find({})
		.populate("user", { _id: 1, username: 1 })

	response.json(comments.map(Comment.format))
})

// Specific post data
router.get("/:id", async (request, response) => {
	const comment = await Comment
		.findById(request.params.id)
		.populate("user", { _id: 1, username: 1 })

	response.json(Comment.format(comment))
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

		if (body.body === undefined) {
			return response.status(400).json({ error: "body missing" })
		} else if (body.body.length < 3) {
			return response.status(400).json({ error: "body's length must be greater than three" })
		} else if (body.post === undefined) {
			return response.status(400).json({ error: "post undefined, something went wrong" })
		}

		const user = await User.findById(userid)

		if (user === null) {
			return response.status(400).json({ error: "user missing" })
		}

		const comment = new Comment({
			author: user,
			body: body.body,
			bodyLowercase: body.body.toLowerCase(),
			parent: body.parent || null,
			post: body.post,
			replies: []
		})

		user.comments = [ ...user.comments, comment ]

		await user.save()
		const savedComment = await comment.save()

		if (body.parent) {
			const parentComment = await Comment
				.findById(body.parent._id)

			parentComment.replies = [ ...parentComment.replies, comment ]
			await parentComment.save()
		}
		
		response.status(201).json(savedComment)
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
