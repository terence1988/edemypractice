export interface MongoCourse {
	_id: string;
	name: string;
	price: number;
	slug: string;
	paid: string;
	category: string;
	image: any;
	published: boolean;
	lessons?: any[];
	instructor: string;
	createdAt: string;
	updatedAt: string;
	__v?: number;
}

//  {
// 	name: "ssdfsdf",
// 	description: "sdfsdfsdf",
// 	price: 9.99,
// 	uploading: false,
// 	paid: "free",
// 	loading: false,
// 	category: "dsfsdfdsf",
// 	image: {},
// };
