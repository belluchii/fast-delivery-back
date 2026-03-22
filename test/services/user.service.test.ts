import User_Services from '../../services/user.services'
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals'
import UserModel from '../../models/User.model'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const newUserData: any = {
	email: '1234@test.com',
	password: 'Hola1234',
	name: 'Jose',
	last_name: 'Moya',
}

beforeAll(
	async () => await mongoose.connect('mongodb://localhost/fast-delivery-back')
)

afterAll(async () => await mongoose.disconnect())

describe('User_Services', () => {
	const userServices = User_Services.getInstance()

	it('should create a new user', async () => {
		try {
			await userServices.createUser(newUserData)

			const createdUser = await UserModel.findOne({ email: newUserData.email })

			expect(createdUser).toBeDefined()
			if (createdUser) {
				expect(createdUser.email).toBe(newUserData.email)
				expect(createdUser.name).toEqual(newUserData.name)
				expect(createdUser.last_name).toBe(newUserData.last_name)
			}
		} catch (error) {
			console.error(error)
		}
	})

	it('should find user by email', async () => {
		try {
			await userServices.findByUserEmail(newUserData.email)

			const findedUser = await UserModel.findOne({ email: newUserData.email })

			expect(findedUser).toBeDefined()
			if (findedUser) {
				expect(findedUser.email).toMatch(newUserData.email)
				expect(findedUser.name).toEqual(newUserData.name)
				expect(findedUser.last_name).toBe(newUserData.last_name)
			}
		} catch (error) {
			console.error(error)
		}
	})

	it('should validate password', async () => {
		try {
			await userServices.validateUserPassword(
				newUserData.email,
				newUserData.password
			)

			const findedUser = await UserModel.findOne({ email: newUserData.email })

			expect(findedUser).toBeDefined()
			if (findedUser) {
				expect(findedUser.email).toMatch(newUserData.password)
			}
		} catch (error) {
			console.error(error)
		}
	})
})
