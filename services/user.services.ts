import { User as UserModel } from '../models'
import { DeliveryMan } from '../models'
import { UserInterface, UserWithPasswordValidation } from '../interfaces/user.interfaces'

export default class User_Services {
	private static instance: User_Services | null = null

	static getInstance(): User_Services {
		if (!User_Services.instance) {
			User_Services.instance = new User_Services()
		}
		return User_Services.instance
	}

	async createUser(userData: UserInterface) {
		const createdUser = await UserModel.create(userData)

		if (!createdUser.is_admin) {
			const newDeliveryMan = new DeliveryMan()

			await newDeliveryMan.save()

			createdUser.deliveryManInfo = newDeliveryMan._id
		}
		await createdUser.save()
	}

	async findByUserEmail(email: string) {
		const user: UserWithPasswordValidation | null = await UserModel.findOne({
			email,
		})
		return user
	}

	async findById(id: string) {
		const user = await UserModel.findById(id)
		return user
	}

	async validateUserPassword(email: string, password: string) {
		const user = await UserModel.findOne({ email })
		if (!user) {
			throw new Error('User not found')
		}
		const isValid = await user.validatePassword(password)
		return isValid
	}
}
