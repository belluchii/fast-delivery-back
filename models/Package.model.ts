import mongoose, { Schema } from 'mongoose'
import { PackageInterface } from '../interfaces/package.interfaces'

const PackageSchema: Schema = new Schema({
	client: {
		type: String,
		required: [true, 'Please enter client name'],
	},
	quantity: {
		type: Number,
		required: [true, 'Please enter quantity'],
	},
	quantity_taked: {
		type: Number,
		default: 0,
	},
	destination: {
		type: String,
		required: [true, 'Please enter a destination for your package'],
	},
	coords: {
		type: Object,
		default: { lat: 0, lng: 0 },
	},
	creation_date: {
		type: Date,
		default: Date.now,
	},
	is_delivered: {
		type: Boolean,
		default: false,
		required: [true, 'Please enter the package status'],
	},
	package_weight: {
		type: Number,
		default: 0,
		required: [true, 'Please enter the package weight'],
	},
	additional_information: {
		type: String,
		default: null,
	},
	deadline_date: {
		type: Date,
		default: 0,
		required: [true, 'Please enter delivery deadline'],
	},
})

const PackageModel = mongoose.model<PackageInterface>('Package', PackageSchema)

export default PackageModel
