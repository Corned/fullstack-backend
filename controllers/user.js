const router = require("express").Router()
const User = require("../models/user")

const jwt = require("jsonwebtoken")


/*

GET
	/api/user
	/api/user/:id
*/


router.get("/", async (request, response) => {
	const Users = await User
		.find({})
		// .populate("user", {_id: 1, username: 1})

	response.json(Users.map(User.format))
})

// Specific User data
router.get("/:username", async (request, response) => {

})

router.post("/", async (request, response) => {

})

router.delete("/:id", async (request, response) => {
	const id = request.params.id
})

module.exports = router
