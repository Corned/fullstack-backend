const router = require("express").Router()
const Community = require("../models/community")

const jwt = require("jsonwebtoken")


/*

GET
	/api/community/
	/api/community/:name/:id

*/


router.get("/", async (request, response) => {
	const communities = await Community
		.find({})
		// .populate("user", {_id: 1, username: 1})

	response.json(communities.map(Community.format))
})

router.post("/", async (request, response) => {

})

router.delete("/:id", async (request, response) => {
	const id = request.params.id
})

module.exports = router
