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
	}
]

const usersInDb = async () => {
	const users = await User.find({})
	return users
}

const communitiesInDb = async () => {
	const communities = await Community.find({})
	return communities
}

const postsInDb = async () => {
	const posts = await Post.find({})
	return posts
}

module.exports = {
	initialUsers,
	usersInDb,
	communitiesInDb,
	postsInDb
}