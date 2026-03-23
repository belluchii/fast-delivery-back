import path from 'path'

const baseDir = process.env.LAMBDA_TASK_ROOT 
  ? path.join(process.env.LAMBDA_TASK_ROOT, 'docs')
  : path.resolve(__dirname, '../docs')

const options = {
	definition: {
		openapi: '3.1.0',
		info: {
			title: 'Fast Delivery API',
			description: 'This API handles Fast delivery data',
			version: '1.12.0',
		},
	},
	servers: [
		{
			url: 'http://localhost:3001',
		},
	],
	basePath: '/api',
	apis: [
		path.resolve(baseDir, './deliverymanDocs/deliverymanRoutes.yml'),
		path.resolve(baseDir, './deliverymanDocs/deliverymanSchema.yml'),
		path.resolve(baseDir, './packagesDocs/packageRoutes.yml'),
		path.resolve(baseDir, './packagesDocs/packageSchema.yml'),
		path.resolve(baseDir, './userDocs/userRoutes.yml'),
		path.resolve(baseDir, './userDocs/userSchema.yml')
	],
}

export default options
