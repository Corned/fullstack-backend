const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
	username: String,
	passwordHash: String,
	ownedCommunities: [ { type: mongoose.Schema.Types.ObjectId, ref: "Community" } ],
	communities: [ { type: mongoose.Schema.Types.ObjectId, ref: "Community" } ],
	posts: [ { type: mongoose.Schema.Types.ObjectId, ref: "Post" } ]
})

userSchema.statics.format = user => {
	return {
		id: user._id,
		username: user.username,
		passwordHash: user.passwordHash,
		adult: user.adult,
		posts: user.posts
	}
}

const User = mongoose.model("User", userSchema)

module.exports = User