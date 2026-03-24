//dependencies
import asyncHandler from 'express-async-handler'
import { Request, Response } from 'express'
// config
import { generateToken } from '../config/tokens'
//services
import { Responses } from '../services/responses'
import User_Services from '../services/user.services'
// interfaces
import {
	UserInterface,
	UserPayload,
} from '../interfaces/user.interfaces'

const responses = new Responses()
const user_service = User_Services.getInstance()

const signup = asyncHandler(async (req: Request, res: Response) => {
	try {
		const user: UserInterface = req.body
		const foundUser = await user_service.findByUserEmail(user.email)
		if (foundUser) {
			responses.error(res, 'invalid data', 400)
		} else {
			await user_service.createUser(user)
			responses.success(res, 'user created succesfuly', 201)
		}
	} catch (error) {
		responses.error(res, 'signup error:' + error, 500)
	}
})

const login = asyncHandler(async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body

		const user = await user_service.findByUserEmail(email)

		if (!user) {
			responses.error(res, 'Invalid username or password', 401)
			return
		}

		const isValid = await user_service.validateUserPassword(email, password)

		if (!isValid) {
			responses.error(res, 'Invalid username or password', 401)
			return
		}

		const payload: UserPayload = {
			id: user.id!,
			name: user.name!,
			profile_img: user.profile_img!,
			email: user.email,
			is_admin: user.is_admin!,
			is_deleted: user.is_deleted!,
			deliveryManInfo: user.deliveryManInfo,
		}

		const token: string = generateToken(payload)

		res.cookie('token', token, { sameSite: 'none', secure: true })
		responses.success(res, token, 200)
	} catch (error) {
		responses.error(res, 'Login error', 500)
	}
})

const updateInfo = asyncHandler(async (req: Request, res: Response) => {
	try {
		const { userId } = req.params
		const { newData } = req.body 
		const user = await user_service.findById(userId)

		if (!user) {
			responses.error(res, 'User not found', 404)
			return
		}

		if (newData.email) user.email = newData.email
		if (newData.last_name) user.last_name = newData.last_name
		if (newData.name) user.name = newData.name
		if (newData.profile_img) user.profile_img = newData.profile_img

		await user.save()

		responses.success(
			res,
			'User information updated successfully',
			200
		)
	} catch (error) {
		responses.error(res, 'Update info error', 500)
	}
})
const getUser = asyncHandler(async (req: Request, res: Response) => {
	try {
		const { userId } = req.params
		const user = await user_service.findById(userId)

		if (!user) {
			responses.error(res, 'User not found', 404)
			return
		}

		res.status(200).send(user)
	} catch (error) {
		responses.error(res, 'Get user error', 500)
	}
})
const logout = asyncHandler(async (req: Request, res: Response) => {
	try {
		if (!req.user) {
			responses.error(res, 'User is not logged in', 401)
		}

		res.clearCookie('token')

		responses.success(res, 'Logout successful', 200)
	} catch (error) {
		responses.error(res, 'Logout error', 500)
	}
})

const testAuth = asyncHandler(async (req: Request, res: Response) => {
	try {
		if (!req.user) {
			responses.error(res, 'User is not authenticated', 401)
		}

		responses.success(res, 'AUTHENTICATION SUCCESSFUL', 200)
	} catch (error) {
		responses.error(res, 'Test auth error', 500)
	}
})

export { login, signup, logout, testAuth, updateInfo, getUser}
