import jwt, { SignOptions } from 'jsonwebtoken'
import { UserPayload } from '../interfaces/user.interfaces'
import dotenv from 'dotenv'
dotenv.config()

const SECRET = process.env.JWT_SECRET || 'default-secret-change-me'
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret-change-me'
const EXPIRESIN = process.env.EXPIRESIN || '2d'
const REFRESH_EXPIRESIN = process.env.JWT_REFRESH_EXPIRESIN || '7d'

const generateToken = (payload: UserPayload): string => {
	return jwt.sign({ user: payload }, SECRET, { expiresIn: EXPIRESIN } as SignOptions)
}

const generateRefreshToken = (payload: UserPayload): string => {
	return jwt.sign({ user: payload }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRESIN } as SignOptions)
}

const validateToken = (token: string): UserPayload | null => {
	try {
		return jwt.verify(token, SECRET) as UserPayload
	} catch (error) {
		console.error('Error validating token:', error)
		return null
	}
}

const validateRefreshToken = (token: string): UserPayload | null => {
	try {
		return jwt.verify(token, REFRESH_SECRET) as UserPayload
	} catch (error) {
		console.error('Error validating refresh token:', error)
		return null
	}
}

export { generateToken, generateRefreshToken, validateToken, validateRefreshToken }
