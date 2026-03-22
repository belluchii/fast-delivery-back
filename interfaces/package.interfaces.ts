import mongoose from 'mongoose'
export interface PackageInterface {
	_id?: mongoose.Types.ObjectId;
	client: string;
	destination: string;
	creation_date?: Date;
	is_delivered: boolean;
	package_weight: number;
	additional_information: string;
	quantity: number;
	quantity_taked: number;
	coords?: object;
}
