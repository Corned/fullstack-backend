const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
	//user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	title: String,
	date: Date,
	type: String,
	url: String,
	body: String,
	upvotes: Number,
	downvotes: Number
})

postSchema.statics.format = (post) => {
	return {
		id: post._id,
		//user: post.user,
		title: post.title,
		date: new Date(post.date),
		type: post.type,
		url: post.url,
		body: post.body,
	}
}

const post = mongoose.model("Post", postSchema)

module.exports = post