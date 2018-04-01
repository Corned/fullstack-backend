const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema({
	author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
	replies: [ { type: mongoose.Schema.Types.ObjectId, ref: "Comment" } ],
	body: String
})

commentSchema.statics.format = (comment) => {
	return {
		id: comment.id,
		author: comment.author,
		post: comment.post,
		replies: comment.replies,
		body: comment.body
	}
}

const Comment = mongoose.model("Comment", commentSchema)

module.exports = Comment