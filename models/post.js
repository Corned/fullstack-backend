const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	community: { type: mongoose.Schema.Types.ObjectId, ref: "Community" },
	title: String,
	date: Date,
	type: String,
	url: String,
	body: String,
	upvotes: [ Number ],
	downvotes: [ Number ],
	pinned: Boolean,
	comments: [ { type: mongoose.Schema.Types.ObjectId, ref: "Comment" } ]
})

postSchema.statics.format = (post) => {
	return {
		id: post._id,
		user: post.user,
		community: post.community,
		title: post.title,
		date: new Date(post.date),
		type: post.type,
		url: post.url || undefined,
		body: post.body || undefined,
		upvotes: post.updates || [],
		downvotes: post.downvotes || [],
		pinned: post.pinned || false,
		comments: post.comments || []
	}
}

const post = mongoose.model("Post", postSchema)

module.exports = post