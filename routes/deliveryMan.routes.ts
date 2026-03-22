import express from 'express'
const router = express()
import {
	get_taked_packages,
	mark_delivered,
	take_package,
	untake_package,
	get_all_deliverymans,
	get_one_deliveryman,
	get_deli_by_id,
	mark_inactive,
} from '../controllers/deliveryMan.controller'
import validateUser from '../middlewares/auth'

router.get('/taked-packages', validateUser, get_taked_packages)
router.get('/all', validateUser, get_all_deliverymans)
router.get('/one', validateUser, get_one_deliveryman)
router.get('/one/:deliveryId', validateUser, get_deli_by_id)
router.post('/mark-in-or-active',validateUser, mark_inactive)
router.post('/mark-deli', validateUser, mark_delivered)
router.post('/take-packages', validateUser, take_package)
router.delete('/untake-package/:packageId', validateUser, untake_package)


export default router
