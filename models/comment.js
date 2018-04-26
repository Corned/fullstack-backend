const mongoose = require("mongoose")
const deepPopulate = require("mongoose-deep-populate")(mongoose);

const commentSchema = new mongoose.Schema({
	author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	body: String,
	bodyLowercase: String,
	date: Date,
	deleted: Boolean,
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
		date: comment.date,
		deleted: comment.deleted,
		parent: comment.parent,
		post: comment.post,
		replies: comment.replies
	}
}

commentSchema.plugin(deepPopulate)

const Comment = mongoose.model("Comment", commentSchema)

module.exports = Comment