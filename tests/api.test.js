const supertest = require("supertest")
const { app, server } = require("../index")
const api = supertest(app)

const {
	initialUsers,

	usersInDb,
	communitiesInDb,
	postsInDb,

	login,
	createUsers,
	createCommunities,
	createPosts
} = require("../utils/test_helper")

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


describe("when there are data in database", () => {
	beforeAll(async () => {
		await User.remove({})
		await Community.remove({})
		await Post.remove({})

		await createUsers(api)
		await createCommunities(api)
		await createPosts(api) 
	}, 20000)

	describe("all data is returned by", () => {
		test("GET /api/user", async () => {
			const response = await api
				.get("/api/user")
				.expect(200)
				.expect("Content-Type", /application\/json/)
	
			expect(response.body.length).toBe(3)
		})
		
		test("GET /api/community", async () => {
			const response = await api
				.get("/api/community")
				.expect(200)
				.expect("Content-Type", /application\/json/)
	
			expect(response.body.length).toBe(3)
		})
	
		test("GET /api/post", async () => {
			const response = await api
				.get("/api/post")
				.expect(200)
				.expect("Content-Type", /application\/json/)
	
			expect(response.body.length).toBe(3)
		}) 
	})
})

describe("account creation", () => {
	beforeAll(async () => {
		await User.remove({})
		
		await createUsers(api)
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
	
			expect(response.body.error).toBe("username missing")
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
	
			expect(response.body.error).toBe("password missing")
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
	
			expect(response.body.error).toBe("password too short ( < 6 )")
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
	
			expect(response.body.error).toBe("username already taken")
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

		await createUsers(api)
	})

	test("GET /api/user/:id returns information about user", async () => {
		const usersInDatabase = await usersInDb()
		const user = usersInDatabase[0]

		const response = await api
			.get(`/api/user/${user.username}`)
			.expect(200)
			.expect("Content-Type", /application\/json/)

		expect(response.body.id).toBe(user.id)
		expect(response.body.username).toBe(user.username)
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

			expect(response.body.error).toBe("invalid username or password")
		})
	})

	describe("content creation", () => {
		describe("when not logged in", () => {
			test("unable to create a community", async () => {
				const data = {
					"name": "TestCommunity"
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
					"name": "TestCommunity"
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

		describe("when logged in", () => {
			let loggedInUserData

			beforeAll(async () => {
				const credentials = {
					"username": "TestUser",
					"password": "123456"
				}
		
				const response = await api
					.post("/api/login")
					.send(credentials)
					.expect(200)
					.expect("Content-Type", /application\/json/)

				loggedInUserData = response.body
			})

			test("able to create a community when name is not taken", async () => {
				const communityData = {
					"name": "TestCommunity"
				}

				const response = await api
					.post("/api/community")
					.set("Authorization", `bearer ${loggedInUserData.token}`)
					.send(communityData)
					.expect(201)
					.expect("Content-Type", /application\/json/)
					
				expect(response.body.name).toBe(communityData.name)
				expect(response.body.owner).toBe(loggedInUserData.user._id)
				expect(response.body.moderators[0]).toBe(loggedInUserData.user._id)
				expect(response.body.members[0]).toBe(loggedInUserData.user._id)
				expect(response.body.posts.length).toBe(0)
				expect(response.body.banned.length).toBe(0)
			})

			test("unable to create a community when name is taken", async () => {
				const communityData = {
					"name": "TestCommunity"
				}

				const response = await api
					.post("/api/community")
					.set("Authorization", `bearer ${loggedInUserData.token}`)
					.send(communityData)
					.expect(400)
					.expect("Content-Type", /application\/json/)
					
				expect(response.body.error).toBe("name already taken")
			})

			test("unable to create a community when name is undefined", async () => {
				const communityData = {
					"name": undefined
				}

				const response = await api
					.post("/api/community")
					.set("Authorization", `bearer ${loggedInUserData.token}`)
					.send(communityData)
					.expect(400)
					.expect("Content-Type", /application\/json/)
					
				expect(response.body.error).toBe("name is missing")
			})
		})
	})
})
