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

	describe("a single instance is returned by", () => {
		test("GET /api/user/:username", async () => {
			const usersInDatabase = await usersInDb()
			const user = usersInDatabase[0]
	
			const response = await api
				.get(`/api/user/${user.username}`)
				.expect(200)
				.expect("Content-Type", /application\/json/)
	
			expect(response.body.id).toBe(user.id)
			expect(response.body.username).toBe(user.username)
		})

		test("GET /api/community/:name", async () => {
			const communitiesInDatabase = await communitiesInDb()
			const community = communitiesInDatabase[0]
	
			const response = await api
				.get(`/api/community/${community.name}`)
				.expect(200)
				.expect("Content-Type", /application\/json/)
	
			expect(response.body.id).toBe(community.id)
			expect(response.body.name).toBe(community.name)
		})

		test("GET /api/post/:id", async () => {
			const postsInDatabase = await postsInDb()
			const post = postsInDatabase[0]
	
			const response = await api
				.get(`/api/post/${post.id}`)
				.expect(200)
				.expect("Content-Type", /application\/json/)
	
			expect(response.body.id).toBe(post.id)
			expect(response.body.title).toBe(post.title)
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

	describe("logging in", () => {
		test("200 Is possible with valid credentials", async () => {
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

		test("401 Fails with invalid credentials", async () => {
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
})

describe("content creation", () => {
	describe("POST /api/user", () => {
		beforeAll(async () => {
			await User.remove({})
			
			await createUsers(api)
			await createCommunities(api)
			await createPosts(api) 
		}, 20000)
	
		describe("fails when", () => {
			test("400 Username is undefined", async () => {
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
		
			test("400 Password is undefined", async () => {
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
		
			test("400 Password is too short ( <6 )", async () => {
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
		
			test("400 Username is already taken", async () => {
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
			test("201 Using a non-taken username and a valid password", async () => {
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


	describe("when not logged in", () => {
		describe("POST /api/community", () => {
			test("401 Unauthorized when no authorization is provided", async () => {
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
	
			test("401 Unauthorized when a malformed token is provided", async () => {
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

		describe("POST /api/user", () => {			
			test("401 Unauthorized when no authorization is provided", async () => {
				const data = {
					community: "TestCommunity",
					title: "401 Test 1",
					type: "link",
					url: "https://google.com"
				}

				const response = await api
					.post("/api/post")
					.send(data)
					.expect(401)
					.expect("Content-Type", /application\/json/)

				expect(response.body.error).toBe("jwt must be provided")
			})

			test("401 Unauthorized when a malformed token is provided", async () => {
				const data = {
					community: "TestCommunity",
					title: "401 Test 2",
					type: "link",
					url: "https://google.com"
				}

				const response = await api
					.post("/api/post")
					.set("Authorization", "bearer badfakemctokenface")
					.send(data)
					.expect(401)
					.expect("Content-Type", /application\/json/)

				expect(response.body.error).toBe("jwt malformed")
			})
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

		describe("POST /api/community", () => {
			test("201 Able to create a community with a non-taken name", async () => {
				const communityData = {
					"name": "NonTaken"
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
	
			test("400 Unable to create a community when name is taken", async () => {
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
	
			test("400 Unable to create a community when name is undefined", async () => {
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

		describe("POST /api/post", () => {
			test("201 Able to create a post with a type of \"text\" when using valid data", async () => {
				const postData = {
					community: "TestCommunity",
					title: "POST /api/post test",
					type: "text",
					body: "test post please ignore"
				}
	
				const response = await api
					.post("/api/post")
					.set("Authorization", `bearer ${loggedInUserData.token}`)
					.send(postData)
					.expect(201)
					.expect("Content-Type", /application\/json/)
				
				expect(response.body.title).toBe(postData.title)
				expect(response.body.type).toBe(postData.type)
				expect(response.body.body).toBe(postData.body)
			})

			test("400 Unable to create a post when title is undefined", async () => {
				const postData = {
					community: undefined,
					title: "Title of the Ancients",
					type: "text",
					body: "test post please ignore"
				}
	
				const response = await api
					.post("/api/post")
					.set("Authorization", `bearer ${loggedInUserData.token}`)
					.send(postData)
					.expect(400)
					.expect("Content-Type", /application\/json/)
				
				expect(response.body.error).toBe("community missing")
			})

			test("400 Unable to create a post when title is undefined", async () => {
				const postData = {
					community: "TestCommunity",
					title: undefined,
					type: "text",
					body: "test post please ignore"
				}
	
				const response = await api
					.post("/api/post")
					.set("Authorization", `bearer ${loggedInUserData.token}`)
					.send(postData)
					.expect(400)
					.expect("Content-Type", /application\/json/)
				
				expect(response.body.error).toBe("title missing")
			})

			test("400 Unable to create a post when type is undefined", async () => {
				const postData = {
					community: "TestCommunity",
					title: "hello world",
					type: undefined,
					url: "https://google.com"
				}
	
				const response = await api
					.post("/api/post")
					.set("Authorization", `bearer ${loggedInUserData.token}`)
					.send(postData)
					.expect(400)
					.expect("Content-Type", /application\/json/)
				
				expect(response.body.error).toBe("type missing")
			})

			test("400 Unable to create a post when type is not \"url\" or \"text\"", async () => {
				const postData = {
					community: "TestCommunity",
					title: "hello world",
					type: "third-option",
					url: "https://google.com"
				}
	
				const response = await api
					.post("/api/post")
					.set("Authorization", `bearer ${loggedInUserData.token}`)
					.send(postData)
					.expect(400)
					.expect("Content-Type", /application\/json/)
				
				expect(response.body.error).toBe("invalid body type")
			})
			
			test("400 Unable to create a post with a type of \"link\" when url is undefined", async () => {
				const postData = {
					community: "TestCommunity",
					title: "hello world",
					type: "link",
					url: undefined
				}
	
				const response = await api
					.post("/api/post")
					.set("Authorization", `bearer ${loggedInUserData.token}`)
					.send(postData)
					.expect(400)
					.expect("Content-Type", /application\/json/)
				
				expect(response.body.error).toBe("url missing")
			})

			test("400 Unable to create a post with a type of \"text\" when body is undefined", async () => {
				const postData = {
					community: "TestCommunity",
					title: "hello world",
					type: "text",
					body: undefined
				}
	
				const response = await api
					.post("/api/post")
					.set("Authorization", `bearer ${loggedInUserData.token}`)
					.send(postData)
					.expect(400)
					.expect("Content-Type", /application\/json/)
				
				expect(response.body.error).toBe("body missing")
			})
		})
	})
})