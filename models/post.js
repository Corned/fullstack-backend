const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	community: { type: mongoose.Schema.Types.ObjectId, ref: "Community" },
	comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
	title: String,
	date: Date,
	type: String,
	url: String,
	body: String
})

postSchema.statics.format = (post) => {
	return {
		id: post.id,
		user: post.user,
		community: post.community,
		comments: post.comments,
		title: post.title,
		date: new Date(post.date),
		type: post.type,
		url: post.url || undefined,
		body: post.body || undefined
	}
}

const post = mongoose.model("Post", postSchema)

module.exports = post