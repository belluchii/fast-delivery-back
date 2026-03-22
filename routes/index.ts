import user from './user.route'
import packages from './package.route'
import deliveryMan from './deliveryMan.routes'
import express from 'express'

const router = express()

router.use('/users', user)
router.use('/packages', packages)
router.use('/delivery-man', deliveryMan)

export default router
