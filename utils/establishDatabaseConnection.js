const mongoose = require("mongoose")

module.exports = async function(url) {
	try {
		mongoose.Promise = global.Promise
		await mongoose.connect(url)
		console.log("Connected to database!")
	} catch (error) {
		console.log(error);
	}
}