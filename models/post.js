const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	title: String
})

postSchema.statics.format = (post) => {
	return {
		id: post._id,
		user: post.user,
		title: post.title,
	}
}

const post = mongoose.model("Post", postSchema)

module.exports = post