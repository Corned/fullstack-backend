const User = require("../models/user")
const Community = require("../models/community")
const Post = require("../models/post")

const initialUsers = [
	{
		username: "LoggingTest",
		password: "123456"
	},
	{
		username: "TestUser",
		password: "123456"
	},
	{
		username: "Taken",
		password: "123456"
	}
]

const usersInDb = async () => {
	const users = await User.find({})
	return users.map(User.format)
}

const communitiesInDb = async () => {
	const communities = await Community.find({})
	return communities.map(Community.format)
}

const postsInDb = async () => {
	const posts = await Post.find({})
	return posts.map(Post.format)
}

const createUsers = async (api) => {
	await Promise.all(
		initialUsers.map(userdata => 
			api
				.post("/api/user")
				.send(userdata)
				.expect(201)
				.expect("Content-Type", /application\/json/)
		)
	)
}

const login = async (api, credentials) => {
	const response = await api
		.post("/api/login")
		.send(credentials)
		.expect(200)
		.expect("Content-Type", /application\/json/)

	return response.body
}

module.exports = {
	initialUsers,

	usersInDb,
	communitiesInDb,
	postsInDb,

	login,
	createUsers
}