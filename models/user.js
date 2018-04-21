const mongoose = require("mongoose")
const deepPopulate = require("mongoose-deep-populate")(mongoose);

const userSchema = new mongoose.Schema({
	comments: [ { type: mongoose.Schema.Types.ObjectId, ref: "Comment" } ],
	communities: [ { type: mongoose.Schema.Types.ObjectId, ref: "Community" } ],
	downvoted: [ { type: mongoose.Schema.Types.ObjectId, ref: "Post" } ],
	isAdmin: Boolean,
	moderatorCommunities: [ { type: mongoose.Schema.Types.ObjectId, ref: "Community" } ],
	ownedCommunities: [ { type: mongoose.Schema.Types.ObjectId, ref: "Community" } ],
	passwordHash: String,
	posts: [ { type: mongoose.Schema.Types.ObjectId, ref: "Post" } ],
	saved: [ { type: mongoose.Schema.Types.ObjectId, ref: "Post" } ],
	upvoted: [ { type: mongoose.Schema.Types.ObjectId, ref: "Post" } ],
	username: String,
	usernameLowercase: String
})

userSchema.statics.format = user => {
	return {
		id: user.id,
		comments: user.comments,
		communities: user.communities,
		downvoted: user.downvoted,
		isAdmin: user.isAdmin,
		moderatorCommunities: user.moderatorCommunities,
		ownedCommunities: user.ownedCommunities,
		passwordHash: user.passwordHash,
		posts: user.posts,
		saved: user.saved,
		upvoted: user.upvoted,
		username: user.username,
		usernameLowercase: user.usernameLowercase,
	}
}

userSchema.plugin(deepPopulate)

const User = mongoose.model("User", userSchema)

module.exports = User