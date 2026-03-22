import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
//Services
import DeliveryManService from '../services/deliveryMan.services'
import { Responses } from '../services/responses'
const deliveryManServices = DeliveryManService.getInstance()
const responses = new Responses()

export const take_package = asyncHandler(
	async (req: Request, res: Response) => {
		try {
			const packagesId = req.body
			const deliveryManId = req.user.deliveryManInfo?.toString() || ''

			for (let i = 0; i < packagesId.length; i++) {
				await deliveryManServices.takePackage(packagesId[i], deliveryManId)
			}

			responses.success(res, 'package taked succesfully', 200)
		} catch (error) {
			responses.error(res, error, 500)
		}
	}
)
export const mark_delivered = asyncHandler(
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

export const mark_inactive = asyncHandler(
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

export const get_taked_packages = asyncHandler(
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

export const untake_package = asyncHandler(
	async (req: Request, res: Response) => {
		try {
			const deliveryManId = req.user.deliveryManInfo?.toString() || ''
			const { packageId } = req.params
			await deliveryManServices.untakePackage(deliveryManId, packageId)
			responses.success(res, 'package untaked succesfully', 200)
		} catch (error) {
			responses.error(res, error, 500)
		}
	}
)

export const get_all_deliverymans = asyncHandler(
	async (req: Request, res: Response) => {
		try {
			const result = await deliveryManServices.getAllDeliverymans()
			responses.sendDeliverymans(res, result, 200)
		} catch (error) {
			responses.error(res, error, 500)
		}
	}
)

export const get_one_deliveryman = asyncHandler(
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

export const get_deli_by_id = asyncHandler(
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
