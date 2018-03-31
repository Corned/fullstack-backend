const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
	username: String,
	isAdmin: Boolean,
	passwordHash: String,
	ownedCommunities: [ { type: mongoose.Schema.Types.ObjectId, ref: "Community" } ],
	communities: [ { type: mongoose.Schema.Types.ObjectId, ref: "Community" } ],
	moderatorCommunities: [ { type: mongoose.Schema.Types.ObjectId, ref: "Community" } ],
	posts: [ { type: mongoose.Schema.Types.ObjectId, ref: "Post" } ],
	upvoted: [ { type: mongoose.Schema.Types.ObjectId, ref: "Post" } ],
	downvoted: [ { type: mongoose.Schema.Types.ObjectId, ref: "Post" } ],
	saved: [ { type: mongoose.Schema.Types.ObjectId, ref: "Post" } ],
	comments: [ { type: mongoose.Schema.Types.ObjectId, ref: "Comment" } ]
})

userSchema.statics.format = user => {
	return {
		id: user.id,
		username: user.username,
		isAdmin: user.isAdmin,
		passwordHash: user.passwordHash,
		ownedCommunities: user.ownedCommunities,
		communities: user.communities,
		moderatorCommunities: user.moderatorCommunities,
		posts: user.posts,
		upvoted: user.upvoted,
		downvoted: user.downvoted,
		saved: user.saved,
		comments: user.comments,
	}
}

const User = mongoose.model("User", userSchema)

module.exports = User