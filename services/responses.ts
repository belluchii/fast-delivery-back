import { Response } from 'express'

export class Responses {
	success(res: Response, message: string, statusCode?: number) {
		return res.status(statusCode || 200).send({
			message,
		})
	}
	sendPackage(res: Response, message: any, statusCode?: number) {
		return res.status(statusCode || 200).send({
			message,
		})
	}

	sendDeliverymans(res: Response, message: any, statusCode?: number) {
		return res.status(statusCode || 200).send({
			message,
		})
	}

	error(res: Response, message: string | unknown, statusCode?: number) {
		return res.status(statusCode || 500).send({
			error: message,
		})
	}
}
