const Post = require("../models/post")

const initialPosts = [
	{
		id: "1",
		title: "1 Hello World!",
		date: new Date(),
		type: "text",
		url: undefined,
		body: "This is a textpost!"
	}, 
	{
		id: "2",
		title: "2 Goodbye World!",
		date: new Date(),
		type: "link",
		url: "https://google.com/",
		body: undefined
	}, 
]

const postsInDb = async () => {
	const posts = await Post.find({})
	return posts
}

module.exports = {
	initialPosts,
	postsInDb
}