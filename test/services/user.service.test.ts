import User_Services from '../../services/user.services'
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals'
import UserModel from '../../models/User.model'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { UserInterface } from '../../interfaces/user.interfaces'
import { MongoMemoryServer } from 'mongodb-memory-server'
dotenv.config()

let mongoServer: MongoMemoryServer
let mongoUri: string

beforeAll(async () => {
	mongoServer = await MongoMemoryServer.create({
		instance: {
			launchTimeout: 60000,
		},
	})
	mongoUri = mongoServer.getUri()
	await mongoose.connect(mongoUri)
}, 60000)

afterAll(async () => {
	await mongoose.disconnect()
	if (mongoServer) await mongoServer.stop()
})

afterAll(async () => {
	await mongoose.disconnect()
	await mongoServer.stop()
})

afterEach(async () => {
	await UserModel.deleteMany({ email: /@test.com$/ })
})

const userServices = User_Services.getInstance()

describe('User_Services', () => {
	it('should create a new user', async () => {
		const newUserData: UserInterface = {
			email: `user${Date.now()}@test.com`,
			password: 'Hola1234',
			name: 'Jose',
			last_name: 'Moya',
		}
		await userServices.createUser(newUserData)

		const createdUser = await UserModel.findOne({ email: newUserData.email })

		expect(createdUser).toBeDefined()
		expect(createdUser?.email).toBe(newUserData.email)
		expect(createdUser?.name).toEqual(newUserData.name)
		expect(createdUser?.last_name).toBe(newUserData.last_name)
		expect(createdUser?.password).not.toBe(newUserData.password)
	})

	it('should find user by email', async () => {
		const newUserData: UserInterface = {
			email: `find${Date.now()}@test.com`,
			password: 'Hola1234',
			name: 'Test',
			last_name: 'User',
		}
		await userServices.createUser(newUserData)
		const findedUser = await userServices.findByUserEmail(newUserData.email)

		expect(findedUser).toBeDefined()
		expect(findedUser?.email).toMatch(newUserData.email)
		expect(findedUser?.name).toEqual(newUserData.name)
		expect(findedUser?.last_name).toBe(newUserData.last_name)
	})

	it('should return null when email not found', async () => {
		const findedUser = await userServices.findByUserEmail('nonexistent@test.com')
		expect(findedUser).toBeNull()
	})

	it('should validate correct password', async () => {
		const newUserData: UserInterface = {
			email: `valid${Date.now()}@test.com`,
			password: 'Hola1234',
			name: 'Pass',
			last_name: 'Test',
		}
		await userServices.createUser(newUserData)

		const isValid = await userServices.validateUserPassword(
			newUserData.email,
			newUserData.password
		)

		expect(isValid).toBe(true)
	})

	it('should reject incorrect password', async () => {
		const newUserData: UserInterface = {
			email: `invalid${Date.now()}@test.com`,
			password: 'Hola1234',
			name: 'Pass',
			last_name: 'Test',
		}
		await userServices.createUser(newUserData)

		const isValid = await userServices.validateUserPassword(
			newUserData.email,
			'WrongPassword123'
		)

		expect(isValid).toBe(false)
	})

	it('should throw error when validating non-existent user', async () => {
		await expect(
			userServices.validateUserPassword('notfound@test.com', 'password')
		).rejects.toThrow()
	})

	it('should reject duplicate email', async () => {
		const newUserData: UserInterface = {
			email: `duplicate${Date.now()}@test.com`,
			password: 'Hola1234',
			name: 'Test',
			last_name: 'User',
		}
		await userServices.createUser(newUserData)

		await expect(userServices.createUser(newUserData)).rejects.toThrow()
	})

	it('should hash password on creation', async () => {
		const newUserData: UserInterface = {
			email: `hash${Date.now()}@test.com`,
			password: 'Hola1234',
			name: 'Test',
			last_name: 'User',
		}
		await userServices.createUser(newUserData)

		const storedUser = await UserModel.findOne({ email: newUserData.email })
		expect(storedUser?.password).not.toBe(newUserData.password)
		expect(storedUser?.password).toMatch(/^\$/)
	})

	it('should fail with invalid email format', async () => {
		const invalidUser: UserInterface = {
			email: 'invalid-email',
			password: 'Hola1234',
			name: 'Test',
			last_name: 'User',
		}

		await expect(userServices.createUser(invalidUser)).rejects.toThrow()
	})
})