import { Types } from 'mongoose'
import DeliveryManModel from '../models/DeliveryMan.model'
import Package from '../models/Package.model'
import { PackagesServices } from './packages.services'
const packages_service = PackagesServices.getInstance()
import UserModel from '../models/User.model'

export default class DeliveryManService {
	private static instance: DeliveryManService | null = null
	private constructor() {}
	static getInstance(): DeliveryManService {
		if (!DeliveryManService.instance) {
			DeliveryManService.instance = new DeliveryManService()
		}
		return DeliveryManService.instance
	}

	async findDeliveryManById(deliverymanId: string) {
		const deliveryman = await DeliveryManModel.findById(deliverymanId)
		if (!deliveryman) {
			throw new Error('Deliveryman not found')
		}
		return deliveryman
	}
	async getAllDeliverymans() {
		const registeredDeliverymans = await DeliveryManModel.find()

		const nonAdminUsers = await UserModel.find({ is_admin: false })

		const combinedResults = {
			deliverymans: registeredDeliverymans,
			users: nonAdminUsers,
		}

		return combinedResults
	}
	async takePackage(packageId: string, deliverymanId: string) {
		const deliveryman = await this.findDeliveryManById(deliverymanId)
		const pack = await packages_service.getPackage(packageId)
		const takedPackage = new Types.ObjectId(packageId)

		if (pack) {
			pack.quantity_taked = pack.quantity
			pack.quantity = 0
			await pack.save()
			if (deliveryman.current_deliveries < 10) {
				deliveryman.current_deliveries += pack.quantity_taked
				deliveryman.packages.push(takedPackage)
			}
			if (deliveryman.packages.length > 0) {
				deliveryman.status = true
			}
		} else {
			return 'daily packages limit exceded'
		}
		await deliveryman.save()
	}

	async untakePackage(deliverymanId: string, packageId: string) {
		const deliveryman = await this.findDeliveryManById(deliverymanId)
		const pack = await packages_service.getPackage(packageId)
		const packageToDeleteId = new Types.ObjectId(packageId)
		const packageIndex = deliveryman.packages.indexOf(packageToDeleteId)

		if (packageIndex !== -1) {
			if (pack) {
				deliveryman.packages.splice(packageIndex, 1)
				pack.quantity = pack.quantity_taked
				pack.quantity_taked = 0
				await pack.save()
				if (deliveryman.current_deliveries > 0) {
					deliveryman.current_deliveries -= pack.quantity
				}

				const packageDeliveryPromises = deliveryman.packages.map(
					async (packageId) => {
						const pack = await packages_service.getPackage(
							packageId.toString()
						)
						return pack && pack.is_delivered === true
					}
				)
				const packageDeliveryStatus = await Promise.all(
					packageDeliveryPromises
				)
				const allPackagesDelivered = packageDeliveryStatus.every(
					(status) => status === true
				)
				if (allPackagesDelivered || deliveryman.packages.length === 0) {
					deliveryman.status = false
				}
			} else {
				return 'daily packages limit exceded'
			}
			await deliveryman.save()
		} else {
			throw new Error('Package not found in deliveryman packages')
		}
	}
	async markInactiveOrActive(deliverymanId: string) {
		const deliveryman = await DeliveryManModel.findById(deliverymanId)
		if (!deliveryman) {
			throw new Error('Deliveryman not found')
		}
		deliveryman.active = !deliveryman.active
		if (deliveryman.active === false) {
			for (let i = 0; i <= deliveryman.packages.length; i++) {
				const pack = await packages_service.getPackage(
					deliveryman.packages[i]._id.toString()
				)

				if (pack) {
					if (!pack.is_delivered) {
						await this.untakePackage(deliverymanId, pack._id.toString())
						await deliveryman.save()
					}
				}
			}
		}
		await deliveryman.save()
		return deliveryman
	}

	async getTakedPackages(deliverymanId: string) {
		const deliveryman = await this.findDeliveryManById(deliverymanId)
		const packageIds = deliveryman.packages
		const packagesData = await Package.find({ _id: { $in: packageIds } })

		if (packagesData.length > 0) {
			return packagesData
		} else {
			throw new Error('No packages found')
		}
	}

	async markDelivered(deliverymanId: string, packageId: string) {
		const deliveryman = await this.findDeliveryManById(deliverymanId)
		const packageIndex = deliveryman.packages.findIndex(
			(pkg) => pkg.toString() === packageId
		)
		if (packageIndex !== -1) {
			const foundPackage = await Package.findById(packageId)
			if (foundPackage) {
				foundPackage.is_delivered = true

				if (!deliveryman) {
					throw new Error('Deliveryman not found')
				}

				deliveryman.delivered += foundPackage.quantity_taked

				await deliveryman.save()

				await foundPackage.save()
			} else {
				throw new Error('Package not found in the database')
			}
		} else {
			throw new Error('Package not found in deliveryman packages')
		}
	}
}
