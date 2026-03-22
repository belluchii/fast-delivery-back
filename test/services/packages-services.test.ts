import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { PackageInterface } from '../../interfaces/package.interfaces'
import { PackagesServices } from '../../services/packages.services'
import PackageModel from '../../models/Package.model'
dotenv.config()

describe('packages_services', () => {
	beforeAll(async () => {
		await mongoose.connect('mongodb://localhost/fast-delivery-back')
	})

	afterAll(async () => {
		await mongoose.connection.close()
	})

	afterEach(async () => {
		await PackageModel.deleteMany({})
	})

	it('should create a new package', async () => {
		const newPackageData: PackageInterface = {
			quantity: 0,
			quantity_taked: 0,
			client: 'Cliente de prueba',
			destination: 'Dirección de prueba',
			is_delivered: false,
			package_weight: 1.5,
			additional_information: 'Información adicional de prueba',
		}
		const packageServices = PackagesServices.getInstance()

		const createdPackage = await packageServices.createPackage(newPackageData)

		expect(createdPackage).toBeDefined()
		expect(createdPackage.client).toBe(newPackageData.client)
	})

	it('should get a package by ID', async () => {
		const newPackageData: PackageInterface = {
			quantity_taked: 0,
			quantity: 0,
			client: 'Cliente de prueba5',
			destination: 'Dirección de prueba',
			is_delivered: false,
			package_weight: 1.5,
			additional_information: 'Información adicional de prueba',
		}
		const packageServices = PackagesServices.getInstance()
		const createdPackage = await packageServices.createPackage(newPackageData)

		const retrievedPackage = await packageServices.getPackage(
			createdPackage.id
		)

		expect(retrievedPackage).toBeDefined()
		expect(retrievedPackage?.id).toEqual(createdPackage.id)
	})

	it('should delete a package by ID', async () => {
		const newPackageData: PackageInterface = {
			quantity: 0,
			quantity_taked: 0,
			client: 'Cliente de prueba5',
			destination: 'Dirección de prueba',
			is_delivered: false,
			package_weight: 1.5,
			additional_information: 'Información adicional de prueba',
		}
		const packageServices = PackagesServices.getInstance()
		const createdPackage = await packageServices.createPackage(newPackageData)

		await packageServices.deletePackage(createdPackage.id)

		const deletedPackage = await packageServices.getPackage(createdPackage.id)

		expect(deletedPackage).toBeNull()
	})

	it('should edit a package', async () => {
		const newPackageData: PackageInterface = {
			quantity_taked: 0,
			quantity: 0,
			client: 'Cliente de prueba',      destination: 'Dirección de prueba',
			is_delivered: false,
			package_weight: 1.5,
			additional_information: 'Información adicional de prueba',
		}
		const packageServices = PackagesServices.getInstance()
		const createdPackage = await packageServices.createPackage(newPackageData)

		const updatedData: PackageInterface = {
			...createdPackage.toObject(),
			is_delivered: true,
		}

		const updatedPackage = await packageServices.editPackage(
			createdPackage.id,
			updatedData
		)

		expect(updatedPackage).toBeDefined()
	})

	it('should get all packages', async () => {
		const packageServices = PackagesServices.getInstance()
		const allPackages = await packageServices.getPackages()

		expect(allPackages).toBeDefined()
		expect(Array.isArray(allPackages)).toBe(true)
	})
})
