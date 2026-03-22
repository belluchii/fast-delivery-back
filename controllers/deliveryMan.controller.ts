import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import DeliveryManService from '../services/deliveryMan.services'
import { Responses } from '../services/responses'
const deliveryManServices = DeliveryManService.getInstance()
const responses = new Responses()

export const takePackage = asyncHandler(
	async (req: Request, res: Response) => {
		try {
			const packagesId = req.body
			const deliveryManId = req.user.deliveryManInfo?.toString() || ''

			for (let i = 0; i < packagesId.length; i++) {
				await deliveryManServices.takePackage(packagesId[i], deliveryManId)
			}

			responses.success(res, 'Package taken successfully', 200)
		} catch (error) {
			responses.error(res, error, 500)
		}
	}
)
export const markDelivered = asyncHandler(
	async (req: Request, res: Response) => {
		try {
			const { packageId } = req.body

			const deliveryManId = req.user.deliveryManInfo?.toString() || ''

			await deliveryManServices.markDelivered(deliveryManId, packageId)
			responses.success(res, 'Package marked as delivered', 200)
		} catch (error) {
			responses.error(res, error, 500)
		}
	}
)

export const markInactive = asyncHandler(
	async (req: Request, res: Response) => {
		try {
			const { deliveryId } = req.body
			const id = deliveryId.toString()

			const delivery = await deliveryManServices.markInactiveOrActive(id)

			responses.sendDeliverymans(res, delivery, 200)
		} catch (error) {
			responses.error(res, error, 500)
		}
	}
)

export const getTakedPackages = asyncHandler(
	async (req: Request, res: Response) => {
		try {
			const deliveryManId = req.user.deliveryManInfo?.toString() || ''

			const takedPackages = await deliveryManServices.getTakedPackages(
				deliveryManId
			)
			responses.sendPackage(res, takedPackages, 200)
		} catch (error) {
			responses.error(res, error, 500)
		}
	}
)

export const untakePackage = asyncHandler(
	async (req: Request, res: Response) => {
		try {
			const deliveryManId = req.user.deliveryManInfo?.toString() || ''
			const { packageId } = req.params
			await deliveryManServices.untakePackage(deliveryManId, packageId)
			responses.success(res, 'Package untaked successfully', 200)
		} catch (error) {
			responses.error(res, error, 500)
		}
	}
)

export const getAllDeliverymans = asyncHandler(
	async (req: Request, res: Response) => {
		try {
			const result = await deliveryManServices.getAllDeliverymans()
			responses.sendDeliverymans(res, result, 200)
		} catch (error) {
			responses.error(res, error, 500)
		}
	}
)

export const getOneDeliveryman = asyncHandler(
	async (req: Request, res: Response) => {
		try {
			const deliveryManId = req.user.deliveryManInfo?.toString() || ''
			const result = await deliveryManServices.findDeliveryManById(
				deliveryManId
			)
			responses.sendDeliverymans(res, result, 200)
		} catch (error) {
			responses.error(res, error, 500)
		}
	}
)

export const getDeliById = asyncHandler(
	async (req: Request, res: Response) => {
		try {
			const { deliveryId } = req.params
			const id = deliveryId.toString()
			const result = await deliveryManServices.findDeliveryManById(id)
			responses.sendDeliverymans(res, result, 200)
		} catch (error) {
			responses.error(res, error, 500)
		}
	}
)
