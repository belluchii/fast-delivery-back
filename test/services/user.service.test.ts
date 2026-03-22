import User_Services from '../../services/user.services'
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals'
import UserModel from '../../models/User.model'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { UserInterface } from '../../interfaces/user.interfaces'
dotenv.config()

const userServices = User_Services.getInstance()

beforeAll(
	async () => await mongoose.connect('mongodb://localhost/fast-delivery-back')
)

afterAll(async () => await mongoose.disconnect())

afterEach(async () => {
	await UserModel.deleteMany({ email: /@test.com$/ })
})

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
	})

	it('should find user by email', async () => {
		const newUserData: UserInterface = {
			email: `find${Date.now()}@test.com`,
			password: 'Hola1234',
			name: 'Test',
			last_name: 'User',
		}
		await userServices.createUser(newUserData)
		await userServices.findByUserEmail(newUserData.email)

		const findedUser = await UserModel.findOne({ email: newUserData.email })

		expect(findedUser).toBeDefined()
		expect(findedUser?.email).toMatch(newUserData.email)
		expect(findedUser?.name).toEqual(newUserData.name)
		expect(findedUser?.last_name).toBe(newUserData.last_name)
	})

	it('should validate password', async () => {
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
})
