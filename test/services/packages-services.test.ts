import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { PackageInterface } from '../../interfaces/package.interfaces'
import { PackagesServices } from '../../services/packages.services'
import PackageModel from '../../models/Package.model'
import { MongoMemoryServer } from 'mongodb-memory-server'
dotenv.config()

let mongoServer: MongoMemoryServer
let mongoUri: string
let packageServices: PackagesServices

beforeAll(async () => {
	mongoServer = await MongoMemoryServer.create({
		instance: {
			launchTimeout: 60000,
		},
	})
	mongoUri = mongoServer.getUri()
	await mongoose.connect(mongoUri)
	packageServices = PackagesServices.getInstance()
}, 60000)

afterAll(async () => {
	await mongoose.disconnect()
	if (mongoServer) await mongoServer.stop()
})

afterAll(async () => {
	await mongoose.disconnect()
	await mongoServer.stop()
})

describe('packages_services', () => {
	afterEach(async () => {
		await PackageModel.deleteMany({})
	})

	it('should create a new package', async () => {
		const newPackageData: PackageInterface = {
			quantity: 10,
			quantity_taked: 0,
			client: 'Cliente de prueba',
			destination: 'Dirección de prueba',
			is_delivered: false,
			package_weight: 1.5,
			additional_information: 'Información adicional de prueba',
		}

		const createdPackage = await packageServices.createPackage(newPackageData)

		expect(createdPackage).toBeDefined()
		expect(createdPackage.client).toBe(newPackageData.client)
		expect(createdPackage.destination).toBe(newPackageData.destination)
		expect(createdPackage.quantity).toBe(newPackageData.quantity)
		expect(createdPackage.is_delivered).toBe(false)
	})

	it('should get a package by ID', async () => {
		const newPackageData: PackageInterface = {
			quantity: 5,
			quantity_taked: 2,
			client: 'Cliente de prueba5',
			destination: 'Dirección de prueba',
			is_delivered: false,
			package_weight: 1.5,
			additional_information: 'Información adicional de prueba',
		}
		const createdPackage = await packageServices.createPackage(newPackageData)

		const retrievedPackage = await packageServices.getPackage(createdPackage.id)

		expect(retrievedPackage).toBeDefined()
		expect(retrievedPackage?.id).toEqual(createdPackage.id)
		expect(retrievedPackage?.client).toBe(createdPackage.client)
	})

	it('should return null for non-existent package ID', async () => {
		const nonExistentId = new mongoose.Types.ObjectId().toString()
		const retrievedPackage = await packageServices.getPackage(nonExistentId)

		expect(retrievedPackage).toBeNull()
	})

	it('should delete a package by ID', async () => {
		const newPackageData: PackageInterface = {
			quantity: 5,
			quantity_taked: 0,
			client: 'Cliente de prueba5',
			destination: 'Dirección de prueba',
			is_delivered: false,
			package_weight: 1.5,
			additional_information: 'Información adicional de prueba',
		}
		const createdPackage = await packageServices.createPackage(newPackageData)

		await packageServices.deletePackage(createdPackage.id)

		const deletedPackage = await packageServices.getPackage(createdPackage.id)
		expect(deletedPackage).toBeNull()
	})

	it('should return null when deleting non-existent package', async () => {
		const nonExistentId = new mongoose.Types.ObjectId().toString()
		const result = await packageServices.deletePackage(nonExistentId)

		expect(result).toBeNull()
	})

	it('should edit a package and verify changes', async () => {
		const newPackageData: PackageInterface = {
			quantity: 10,
			quantity_taked: 0,
			client: 'Cliente de prueba',
			destination: 'Dirección de prueba',
			is_delivered: false,
			package_weight: 1.5,
			additional_information: 'Información adicional de prueba',
		}
		const createdPackage = await packageServices.createPackage(newPackageData)

		const updatedData: PackageInterface = {
			...createdPackage.toObject(),
			is_delivered: true,
			client: 'Cliente actualizado',
		}

		const updatedPackage = await packageServices.editPackage(
			createdPackage.id,
			updatedData
		)

		expect(updatedPackage).toBeDefined()
		expect(updatedPackage?.is_delivered).toBe(true)
		expect(updatedPackage?.client).toBe('Cliente actualizado')
	})

	it('should return null when editing non-existent package', async () => {
		const nonExistentId = new mongoose.Types.ObjectId().toString()
		const fakeData: PackageInterface = {
			quantity: 10,
			quantity_taked: 0,
			client: 'Test',
			destination: 'Test',
			is_delivered: false,
			package_weight: 1.5,
			additional_information: 'Test',
		}

		const result = await packageServices.editPackage(nonExistentId, fakeData)
		expect(result).toBeNull()
	})

	it('should get all packages', async () => {
		const allPackages = await packageServices.getPackages()

		expect(allPackages).toBeDefined()
		expect(Array.isArray(allPackages)).toBe(true)
	})

	it('should create multiple packages and retrieve all', async () => {
		const package1: PackageInterface = {
			quantity: 5,
			quantity_taked: 0,
			client: 'Cliente 1',
			destination: 'Dirección 1',
			is_delivered: false,
			package_weight: 1.0,
			additional_information: 'Info 1',
		}
		const package2: PackageInterface = {
			quantity: 10,
			quantity_taked: 0,
			client: 'Cliente 2',
			destination: 'Dirección 2',
			is_delivered: true,
			package_weight: 2.0,
			additional_information: 'Info 2',
		}

		await packageServices.createPackage(package1)
		await packageServices.createPackage(package2)

		const allPackages = await packageServices.getPackages()

		expect(allPackages.length).toBeGreaterThanOrEqual(2)
	})

	it('should update package quantity_taked', async () => {
		const newPackageData: PackageInterface = {
			quantity: 20,
			quantity_taked: 0,
			client: 'Cliente test',
			destination: 'Dirección test',
			is_delivered: false,
			package_weight: 3.0,
			additional_information: 'Test',
		}
		const createdPackage = await packageServices.createPackage(newPackageData)

		const updatedData: PackageInterface = {
			...createdPackage.toObject(),
			quantity_taked: 15,
		}

		const updatedPackage = await packageServices.editPackage(
			createdPackage.id,
			updatedData
		)

		expect(updatedPackage?.quantity_taked).toBe(15)
		expect(updatedPackage?.quantity).toBe(20)
	})

	it('should fail with invalid package data', async () => {
		const invalidData: PackageInterface = {
			quantity: -5,
			quantity_taked: 0,
			client: '',
			destination: 'Dirección',
			is_delivered: false,
			package_weight: 1.5,
			additional_information: 'Test',
		}

		await expect(
			packageServices.createPackage(invalidData)
		).rejects.toThrow()
	})
})