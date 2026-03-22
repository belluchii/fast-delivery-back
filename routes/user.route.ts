import express from 'express'
import { getUser, testAuth, login, logout, signup, updateInfo } from '../controllers/user.controller'
import validateUser from '../middlewares/auth'

const router = express()

router.post('/signup', signup)
router.post('/login', login)
router.get('/test-auth', validateUser, testAuth)
router.post('/logout', validateUser, logout)
router.put('/update/:userId', validateUser, updateInfo)
router.get('/:userId', validateUser, getUser)
export default router
