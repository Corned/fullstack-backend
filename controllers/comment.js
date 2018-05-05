const router = require("express").Router()

const Comment = require("../models/comment")
const Community = require("../models/community")
const Post = require("../models/post")
const User = require("../models/user")

const jwt = require("jsonwebtoken")

router.get("/", async (request, response) => {
	const comments = await Comment
		.find({})
		.populate("author", { username: 1 })

	response.json(comments.map(Comment.format))
})

router.get("/:id", async (request, response) => {
	const comment = await Comment
		.findById(request.params.id)
		.populate("author", { username: 1 })

	response.json(Comment.format(comment))
})

router.get("/post/:id", async (request, response) => {
	const comments = await Comment
		.find({ post: request.params.id })
		.populate("author", { username: 1 })

	response.json(comments.map(Comment.format))
})

router.post("/", async (request, response) => {	
	try {
		// Comment's body, the text.
		const commentBody = request.body.body
		// Comment's post, the post where the comment was made.
		const postId = request.body.post
		// Comment's parent, the comment you're replying to.
		const parentId = request.body.parent

		const token = request.token
		const decodedToken = jwt.verify(token, process.env.SECRET)

		if (!token || !decodedToken.id) {
			return response.status(401).json({ error: "token missing or invalid" })
		}

		const userid = decodedToken.id

		if (commentBody === undefined) {
			return response.status(400).json({ error: "body missing" })
		} else if (commentBody.length === 0) {
			return response.status(400).json({ error: "body's length must be greater than zero" })
		} else if (postId === undefined) {
			return response.status(400).json({ error: "post undefined, something went wrong" })
		}

		const user = await User.findById(userid)
		if (user === null) {
			return response.status(400).json({ error: "user missing" })
		}

		const post = await Post.findById(postId)
		if (post === null) {
			return response.status(400).json({ error: "post missing" })
		}

		const comment = new Comment({
			author: userid,
			body: commentBody,
			bodyLowercase: commentBody.toLowerCase(),
			date: new Date(),
			deleted: false,
			parent: parentId || null,
			post: postId,
			replies: []
		})

		user.comments = [ ...user.comments, comment ]
		post.comments = [ ...post.comments, comment ]

		await user.save()
		await post.save()
		const savedComment = await comment.save()

		if (parentId !== null) {
			const parentComment = await Comment
				.findById(parentId)

			parentComment.replies = [ ...parentComment.replies, savedComment ]
			await parentComment.save()
		}

		response.status(201).json(Comment.format(savedComment))
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

	try {
		const token = request.token
		const decodedToken = jwt.verify(token, process.env.SECRET)

		if (!token || !decodedToken.id) {
			return response.status(401).json({ error: "token missing or invalid" })
		}

		const userid = decodedToken.id

		const comment = await Comment.findById(id)

		if (userid !== comment.author.id) {
			return response.status(401).json({ error: "you don't own this comment" })
		}

		comment.deleted = true
		const savedComment = await comment.save()

		response.status(200).json(Comment.format(savedComment))
	}catch (exception) {
		if (exception.name === "JsonWebTokenError") {
			response.status(401).json({ error: exception.message })
		} else {
			console.log(exception)
			response.status(500).json({ error: "Oops!" })
		}
	}
})

module.exports = router
