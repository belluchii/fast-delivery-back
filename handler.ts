import serverlessHttp from 'serverless-http'
import app from './server'

export const handler = serverlessHttp(app)
