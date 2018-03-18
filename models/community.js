const mongoose = require("mongoose")

const communitySchema = new mongoose.Schema({
	name: String,
	owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	moderators: [ { type: mongoose.Schema.Types.ObjectId, ref: "User" } ],
	members: [ { type: mongoose.Schema.Types.ObjectId, ref: "User" } ],
	banned: [ { type: mongoose.Schema.Types.ObjectId, ref: "User" } ],
	posts: [ { type: mongoose.Schema.Types.ObjectId, ref: "Post" } ],
})

communitySchema.statics.format = (community) => {
	return {
		id: community._id,
		name: community.name,
		owner: community.owner,
		moderators: community.moderators,
		members: community.members,
		banned: community.banned,
		posts: community.posts
	}
}

const Community = mongoose.model("Community", communitySchema)

module.exports = Community