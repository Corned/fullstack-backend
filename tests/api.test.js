const supertest = require("supertest")
const { app, server } = require("../index")
const api = supertest(app)

const { initialPosts, postsInDb } = require("../utils/test_helper")

const Post = require("../models/post")
const User = require("../models/user")
const Community = require("../models/community")

describe("when there are no data in database", () => {
	beforeAll(async () => {
		await Post.remove({})
		await User.remove({})
		await Community.remove({})
	})

	test("no data is returned by GET /api/post", async () => {
		const response = await api
			.get("/api/post")
			.expect(200)
			.expect("Content-Type", /application\/json/)

		expect(response.body.length).toBe(0)
	})

	test("no data is returned by GET /api/community", async () => {
		const response = await api
			.get("/api/community")
			.expect(200)
			.expect("Content-Type", /application\/json/)

		expect(response.body.length).toBe(0)
	})

	test("no data is returned by GET /api/user", async () => {
		const response = await api
			.get("/api/user")
			.expect(200)
			.expect("Content-Type", /application\/json/)

		expect(response.body.length).toBe(0)
	})

	test("account creation fails with undefined username", async () => {
		const userdata = {
			"password": "short"
		}

		const response = await api
			.post("/api/user")
			.send(userdata)
			.expect(400)
			.expect("Content-Type", /application\/json/)

		console.log(response.body)

		expect(response.body.error).toBe("Username missing")
	})

	test("account creation fails with undefined password", async () => {
		const userdata = {
			"username": "test"
		}

		const response = await api
			.post("/api/user")
			.send(userdata)
			.expect(400)
			.expect("Content-Type", /application\/json/)

		console.log(response.body)

		expect(response.body.error).toBe("Password missing")
	})

	test("account creation fails with a password with the length of 3", async () => {
		const userdata = {
			"username": "test",
			"password": "short"
		}

		const response = await api
			.post("/api/user")
			.send(userdata)
			.expect(400)
			.expect("Content-Type", /application\/json/)

		expect(response.body.error).toBe("Password too short ( < 6 )")
	})

	test("account creation is a success with valid username and password", async () => {
		const userdata = {
			"username": "test",
			"password": "longer"
		}

		const response = await api
			.post("/api/user")
			.send(userdata)
			.expect(201)
			.expect("Content-Type", /application\/json/)

		expect(response.body.username).toBe(userdata.username)
		expect(response.body).not.toContain(userdata.password)
	})
})

describe("when there are communities, posts and users in database", () => {
	beforeAll(async () => {
		await Post.remove({})

		const postObjects = initialPosts.map(post => new Post(post))
		await Promise.all(postObjects.map(post => post.save()))
	})

	test("all posts are returned as JSON by GET /api/post", async () => {
		const postsInDatabase = await postsInDb()

		const response = await api
			.get("/api/post")
			.expect(200)
			.expect("Content-Type", /application\/json/)

		expect(response.body.length).toBe(postsInDatabase.length)

		const returnedTitles = response.body.map(post => post.title)
		postsInDatabase.forEach(post => {
			expect(returnedTitles).toContain(post.title)
		})
	})

	test("GET /api/post/:id returns the correct post", async () => {
		const postsInDatabase = await postsInDb()
		const postWithId = postsInDatabase[0]
		const postId = postWithId.id

		const response = await api
			.get(`/api/post/${postId}`)
			.expect(200)
			.expect("Content-Type", /application\/json/)

		expect(response.body.id).toBe(postId)
	})

	describe("when user is not logged in", () => {
		
		beforeAll(async () => {
			await Post.remove({})
		})
	})
})
