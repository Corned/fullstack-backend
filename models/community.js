const mongoose = require("mongoose")
const deepPopulate = require("mongoose-deep-populate")(mongoose);

const communitySchema = new mongoose.Schema({
	name: String,
	nameLowercase: String,
	owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	moderators: [ { type: mongoose.Schema.Types.ObjectId, ref: "User" } ],
	members: [ { type: mongoose.Schema.Types.ObjectId, ref: "User" } ],
	banned: [ { type: mongoose.Schema.Types.ObjectId, ref: "User" } ],
	posts: [ { type: mongoose.Schema.Types.ObjectId, ref: "Post" } ],
})

communitySchema.statics.format = (community) => {
	return {
		id: community.id,
		name: community.name,
		nameLowercase: community.nameLowercase,
		owner: community.owner,
		moderators: community.moderators,
		members: community.members,
		banned: community.banned,
		posts: community.posts
	}
}

communitySchema.plugin(deepPopulate)

const Community = mongoose.model("Community", communitySchema)

module.exports = Community