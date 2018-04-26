const establish = require("./establishDatabaseConnection")

const Comment = require("../models/comment")

const f = async () => {
	await establish("")
}

(async () => {
	await f()

	const all = await Comment.find({})

	all.forEach(async (comment, index) => {
		comment.deleted = false

		await comment.save()
	})
})()