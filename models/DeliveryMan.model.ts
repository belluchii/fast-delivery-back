import { Schema, model } from 'mongoose'

const DeliveryMan = new Schema({
	current_deliveries: {
		type: Number,
		default: 0,
		max: 10,
	},
	delivered: {
		type: Number,
		default: 0,
	},
	active: {
		type: Boolean,
		default: true,
	},
	status: {
		type: Boolean,
		default: false,
	},
	drinked_alcohol: {
		type: Boolean,
		default: false,
	},
	taked_drugs: {
		type: Boolean,
		default: false,
	},
	have_stress: {
		type: Boolean,
		default: false,
	},
	packages: [{ type: Schema.Types.ObjectId, ref: 'Package' }],
})

const DeliveryManModel = model('Deliveryman', DeliveryMan)

export default DeliveryManModel
