const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
	//user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	title: String,
	type: String,
	url: String,
	body: String
})

postSchema.statics.format = (post) => {
	return {
		id: post._id,
		//user: post.user,
		title: post.title,
		type: post.type,
		url: post.url,
		body: post.body,
	}
}

const post = mongoose.model("Post", postSchema)

module.exports = post