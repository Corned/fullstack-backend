const mongoose = require("mongoose")
const deepPopulate = require("mongoose-deep-populate")(mongoose);

const communitySchema = new mongoose.Schema({
	banned: [ { type: mongoose.Schema.Types.ObjectId, ref: "User" } ],
	members: [ { type: mongoose.Schema.Types.ObjectId, ref: "User" } ],
	moderators: [ { type: mongoose.Schema.Types.ObjectId, ref: "User" } ],
	name: String,
	nameLowercase: String,
	owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	posts: [ { type: mongoose.Schema.Types.ObjectId, ref: "Post" } ]
})

communitySchema.statics.format = (community) => {
	return {
		id: community.id,
		banned: community.banned,
		members: community.members,
		moderators: community.moderators,
		name: community.name,
		nameLowercase: community.nameLowercase,
		owner: community.owner,
		posts: community.posts
	}
}

communitySchema.plugin(deepPopulate)

const Community = mongoose.model("Community", communitySchema)

module.exports = Community