const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema({
	author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	body: String,
	bodyLowercase: String,
	parent: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
	post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
	replies: [ { type: mongoose.Schema.Types.ObjectId, ref: "Comment" } ]
})

commentSchema.statics.format = (comment) => {
	return {
		id: comment.id,
		author: comment.author,
		body: comment.body,
		bodyLowercase: comment.bodyLowercase,
		parent: comment.parent,
		post: comment.post,
		replies: comment.replies
	}
}

const Comment = mongoose.model("Comment", commentSchema)

module.exports = Comment