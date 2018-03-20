const router = require("express").Router()
const Post = require("../models/post")

const jwt = require("jsonwebtoken")


/*

	/api/posts/ <-- c/all
	/api/posts/:community <-- hot
	/api/posts/:community/new
	/api/posts/:community/top
	/api/posts/:community/controversial

*/


router.get("/", async (request, response) => {
	const posts = await Post
		.find({})
		// .populate("user", {_id: 1, username: 1})

	response.json(posts.map(Post.format))
})

router.get("/:community/hot", async(request, response) => {
	
})

router.get("/:community/new", async(request, response) => {
	
})

router.get("/:community/top", async(request, response) => {
	
})

router.get("/:community/controversial", async(request, response) => {
	
})


router.post("/", async (request, response) => {
	const body = request.body
	response.status(200).json({ "success": true })
})

router.delete("/:id", async (request, response) => {
	const id = request.params.id
})

module.exports = router
