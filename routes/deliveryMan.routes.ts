import express from 'express'
const router = express()
import {
	getTakedPackages,
	markDelivered,
	takePackage,
	untakePackage,
	getAllDeliverymans,
	getOneDeliveryman,
	getDeliById,
	markInactive,
} from '../controllers/deliveryMan.controller'
import validateUser from '../middlewares/auth'

router.get('/taked-packages', validateUser, getTakedPackages)
router.get('/all', validateUser, getAllDeliverymans)
router.get('/one', validateUser, getOneDeliveryman)
router.get('/one/:deliveryId', validateUser, getDeliById)
router.post('/mark-in-or-active', validateUser, markInactive)
router.post('/mark-deli', validateUser, markDelivered)
router.post('/take-packages', validateUser, takePackage)
router.delete('/untake-package/:packageId', validateUser, untakePackage)

export default router
