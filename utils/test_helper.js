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

const initialCommunities = [
	{ name: "TestCommunity" },
	{ name: "Gaming" },
	{ name: "explainlikeimfive" }
]

const initialPosts = [
	{
		community: "TestCommunity",
		title: "Test Link",
		type: "link",
		url: "https://google.com"
	},
	{
		community: "TestCommunity",
		title: "Test Text",
		type: "text",
		body: "lorem ipsum"
	},
	{
		community: "TestCommunity",
		title: "blkah blahblah",
		type: "text",
		body: "test post please ignore"
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

const login = async (api, credentials) => {
	const response = await api
		.post("/api/login")
		.send(credentials)
		.expect(200)
		.expect("Content-Type", /application\/json/)

	return response.body
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

const createCommunities = async (api, token) => {
	const auth = await login(api, { username: "TestUser", password: "123456" })

	for (let i = 0; i < initialCommunities.length; i++) {
		await api
			.post("/api/community")
			.set("Authorization", `bearer ${auth.token}`)
			.send(initialCommunities[i])
			.expect(201)
			.expect("Content-Type", /application\/json/)
	}
}

const createPosts = async (api, token) => {
	const auth = await login(api, { username: "TestUser", password: "123456" })

	for (let i = 0; i < initialPosts.length; i++) {
		await api
			.post("/api/post")
			.set("Authorization", `bearer ${auth.token}`)
			.send(initialPosts[i])
			.expect(201)
			.expect("Content-Type", /application\/json/)
	}
}

module.exports = {
	initialUsers,

	usersInDb,
	communitiesInDb,
	postsInDb,

	login,
	createUsers,
	createCommunities,
	createPosts
}