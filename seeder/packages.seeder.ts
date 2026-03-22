import fakePackages from './fakePackages'
import { PackagesServices } from '../services/packages.services'
const packages_service = PackagesServices.getInstance()

const seedProducts = async () => {
	try {
		await packages_service.addSeederPackages(fakePackages)
	} catch (error) {
		console.error('Seeding error:', error)
	}
}

export default seedProducts
