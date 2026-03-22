import mongoose from 'mongoose'
import dotenv from 'dotenv'
import seedProducts from '../seeder/packages.seeder'
dotenv.config()
const URL: string = process.env.URL || ''

const connectDB = async () => {
	try {
		await mongoose.connect(URL)
		await seedProducts()
		console.log('DB is connected')
	} catch (error) {
		console.error('Error connecting to database:', error)
	}
}
export default connectDB
