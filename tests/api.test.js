const supertest = require("supertest")
const { app, server } = require("../index")
const api = supertest(app)

const { initialUsers, usersInDb, initialCommunities, communitiesInDb, initialPosts, postsInDb, } = require("../utils/test_helper")

const Post = require("../models/post")
const User = require("../models/user")
const Community = require("../models/community")

describe("when there are no data in database", () => {
	beforeAll(async () => {
		await User.remove({})
		await Community.remove({})
		await Post.remove({})		
	})

	describe("no data is returned by", () => {
		test("GET /api/post", async () => {
			const response = await api
				.get("/api/post")
				.expect(200)
				.expect("Content-Type", /application\/json/)
	
			expect(response.body.length).toBe(0)
		})
	
		test("GET /api/community", async () => {
			const response = await api
				.get("/api/community")
				.expect(200)
				.expect("Content-Type", /application\/json/)
	
			expect(response.body.length).toBe(0)
		})
	
		test("GET /api/user", async () => {
			const response = await api
				.get("/api/user")
				.expect(200)
				.expect("Content-Type", /application\/json/)
	
			expect(response.body.length).toBe(0)
		})
	})
})

describe("account creation", () => {
	beforeAll(async () => {
		await User.remove({})
		
		await api
			.post("/api/user")
			.send({ "username": "Taken", "password": "123456" })
			.expect(201)
			.expect("Content-Type", /application\/json/)
	})

	describe("fails when", () => {
		test("username is undefined", async () => {
			const userdata = {
				"password": "123"
			}
	
			const response = await api
				.post("/api/user")
				.send(userdata)
				.expect(400)
				.expect("Content-Type", /application\/json/)
	
			expect(response.body.error).toBe("Username missing")
		})
	
		test("password is undefined", async () => {
			const userdata = {
				"username": "Failure1"
			}
	
			const response = await api
				.post("/api/user")
				.send(userdata)
				.expect(400)
				.expect("Content-Type", /application\/json/)
	
			expect(response.body.error).toBe("Password missing")
		})
	
		test("password is too short ( <6 )", async () => {
			const userdata = {
				"username": "Failure2",
				"password": "123"
			}
	
			const response = await api
				.post("/api/user")
				.send(userdata)
				.expect(400)
				.expect("Content-Type", /application\/json/)
	
			expect(response.body.error).toBe("Password too short ( < 6 )")
		})
	
		test("username is already taken", async () => {
			const userdata = {
				"username": "Taken",
				"password": "123123"
			}
	
			const response = await api
				.post("/api/user")
				.send(userdata)
				.expect(400)
				.expect("Content-Type", /application\/json/)
	
			expect(response.body.error).toBe("Username already taken")
		})
	})

	describe("is successful when", () => {
		test("using a non-taken username and a valid password", async () => {
			const userdata = {
				"username": "xXxNotTakenxXx",
				"password": "123456"
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
})

describe("when there are users in database", () => {
	beforeAll(async () => {
		await User.remove({})
		await Community.remove({})
		await Post.remove({})

		await Promise.all(
			initialUsers.map(userdata => 
				api
					.post("/api/user")
					.send(userdata)
					.expect(201)
					.expect("Content-Type", /application\/json/)
			)
		)
	})

	describe("logging in", () => {
		test("is possible with valid credentials", async () => {
			const credentials = {
				"username": "LoggingTest",
				"password": "123456"
			}
	
			const response = await api
				.post("/api/login")
				.send(credentials)
				.expect(200)
				.expect("Content-Type", /application\/json/)
	
			expect(response.body.token).not.toBeUndefined()
			expect(response.body.user).not.toBeUndefined()
			expect(response.body.user.username).toBe(credentials.username)
			expect(response.body.user.password).toBeUndefined()
			expect(response.body.user.passwordHash).not.toBe(credentials.password)
		})

		test("fails with invalid credentials", async () => {
			const credentials = {
				"username": "LoggingTest",
				"password": "WrongPasswordMcWrongPasswordFace"
			}

			const response = await api
				.post("/api/login")
				.send(credentials)
				.expect(401)
				.expect("Content-Type", /application\/json/)

			expect(response.body.error).toBe("Invalid username or password")
		})
	})

	describe("content creation", () => {
		describe("when not logged in", () => {
			test("unable to create a community", async () => {
				const data = {
					"name": "TestCommunity",
					"owner": "TestUser"
				}

				const response = await api
					.post("/api/community")
					.send(data)
					.expect(401)
					.expect("Content-Type", /application\/json/)

				expect(response.body.error).toBe("jwt must be provided")
			})

			test("unable to create a community with malformed token", async () => {
				const data = {
					"name": "TestCommunity",
					"owner": "TestUser"
				}

				const response = await api
					.post("/api/community")
					.set("Authorization", "bearer badfakemctokenface")
					.send(data)
					.expect(401)
					.expect("Content-Type", /application\/json/)

				expect(response.body.error).toBe("jwt malformed")
			})

		})

	})
})


/* 
describe("when there are posts, users and communities in database", () => {
	beforeAll(async () => {
		await User.remove({})
		await Community.remove({})
		await Post.remove({})

		await Promise.all(
			initialPosts.map(post => new Post(post)).map(post => 
					post.save()
				)
			)
		
	})

	test("GET /api/post returns all posts", async () => {
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
})*/