import mongoose from 'mongoose'

export interface UserInterface {
	id?: number;
	username?: string;
	email: string;
	profile_img?: string;
	password: string;
	name: string;
	last_name: string;
	salt?: string;
	is_deleted?: boolean;
	is_admin?: boolean;
	deliveryManInfo?: mongoose.Types.ObjectId;
}

export interface UserWithPasswordValidation extends UserInterface {
	validatePassword(password: string): Promise<boolean>;
}

export interface UserPayload {
	id: number;
	profile_img: string;
	name: string;
	email: string;
	is_admin: boolean;
	is_deleted: boolean;
	deliveryManInfo?: mongoose.Types.ObjectId;
}
