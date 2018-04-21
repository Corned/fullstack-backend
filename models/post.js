const mongoose = require("mongoose")
const deepPopulate = require("mongoose-deep-populate")(mongoose);

const postSchema = new mongoose.Schema({
	body: String,
	bodyLowercase: String,
	comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
	community: { type: mongoose.Schema.Types.ObjectId, ref: "Community" },
	date: Date,
	title: String,
	titleLowercase: String,
	type: String,
	url: String,
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
})

postSchema.statics.format = (post) => {
	return {
		id: post.id,
		body: post.body || undefined,
		bodyLowercase: post.bodyLowercase || undefined,
		comments: post.comments,
		community: post.community,
		date: new Date(post.date),
		title: post.title,
		titleLowercase: post.title.toLowerCase(),
		type: post.type,
		url: post.url || undefined,
		user: post.user,
	}
}

postSchema.plugin(deepPopulate, {
	populate: {
		"comments.author": {
			select: "username"
		}
	}
})

const post = mongoose.model("Post", postSchema)

module.exports = post