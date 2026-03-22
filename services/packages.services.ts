import { PackageInterface } from '../interfaces/package.interfaces'
import { Package } from '../models'

export class PackagesServices {
	private static instance: PackagesServices | null = null

	private constructor() {}

	static getInstance(): PackagesServices {
		if (!PackagesServices.instance) {
			PackagesServices.instance = new PackagesServices()
		}
		return PackagesServices.instance
	}

	async getPackages() {
		const allPackages = await Package.find()
		return allPackages
	}

	async getPackage(id: string) {
		const onePackage = await Package.findById(id)
		return onePackage
	}

	async createPackage(data: PackageInterface) {
		const newPackage = new Package(data)
		await newPackage.save()
		return newPackage
	}

	async deletePackage(id: string) {
		const deletedPackage = await Package.findByIdAndRemove(id, {
			select: '_id',
		})
		if (!deletedPackage) {
			console.log('Package not found')
		}
	}

	async editPackage(id: string, updatedData: PackageInterface) {
		const updatedPackage = await Package.findByIdAndUpdate(id, updatedData)
		return updatedPackage
	}

	async addSeederPackages(productData: PackageInterface[]) {
		const existingProducts = await Package.find()
		if (existingProducts.length === 0) {
			for (const product of productData) {
				await Package.create(product)
			}
			console.log('Seeding complete!')
		} else {
			console.log('Products already exist in the database.')
		}
	}
}
