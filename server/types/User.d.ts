export interface MongoUser {
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

// const User = {
// 	picture: "/avatar.png",
// 	role: ["Subscriber"],
// 	_id: "60e275a3b07f8669ba9f758a",
// 	name: "Fayer",
// 	email: "fayer@gmail.com",
// 	password: "",
// 	createdAt: "2021-07-05T02:59:47.066Z",
// 	updatedAt: "2021-07-05T02:59:47.066Z",
// 	__v: 0,
// };
