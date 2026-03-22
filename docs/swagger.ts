import path from 'path'

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
		path.resolve(__dirname, './deliverymanDocs/deliverymanRoutes.yml'),
		path.resolve(__dirname, './deliverymanDocs/deliverymanSchema.yml'),
		path.resolve(__dirname, './packagesDocs/packageRoutes.yml'),
		path.resolve(__dirname, './packagesDocs/packageSchema.yml'),
		path.resolve(__dirname, './userDocs/userRoutes.yml'),
		path.resolve(__dirname, './userDocs/userSchema.yml')
	],
}

export default options
