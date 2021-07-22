export interface IUser {
	_id: string;
	name: string;
	email?: string;
	password?: string;
	picture?: string;
	role: string[] | string;
	stripe_account_id?: string;
	stripe_seller?: Object;
	stripeSession?: Object;
	createdAt: string;
	updatedAt: string;
	__v?: number;
}
