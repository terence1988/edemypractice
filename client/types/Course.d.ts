export interface ICourseMetaData {
	name: string;
	description: string;
	price: number;
	uploading: boolean;
	paid: string;
	loading: boolean;
	category: string;
}

export interface IMongoCourse {
	_id: string;
	name: string;
	price: number;
	slug: string;
	paid: string;
	description: string;
	category: string;
	image: any;
	published: boolean;
	lessons?: any[];
	instructor: any;
	createdAt: string;
	updatedAt: string;
	__v?: number;
}
