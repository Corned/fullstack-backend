const supertest = require("supertest")
const { app, server } = require("../index")
const api = supertest(app)

const { initialPosts, postsInDb } = require("../utils/test_helper")
const Post = require("../models/post")

describe("when there are no posts in database", () => {

})

describe("when there are posts in database", () => {
	beforeAll(async () => {
		await Post.remove({})

		const postObjects = initialPosts.map(post => new Post(post))
		await Promise.all(postObjects.map(post => post.save()))
	})

	test("all posts are returned as JSON by GET /api/posts", async () => {
		const postsInDatabase = await postsInDb()

		const response = await api
			.get("/api/posts")
			.expect(200)
			.expect("Content-Type", /application\/json/)

		expect(response.body.length).toBe(postsInDatabase.length)

		const returnedTitles = response.body.map(post => post.title)
		postsInDatabase.forEach(post => {
			expect(returnedTitles).toContain(post.title)
		})
	})

	afterAll(async () => {
		await Post.remove({})
	})
})