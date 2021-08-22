export interface CourseMetaData {
	name: string;
	description: string;
	price: number;
	uploading: boolean;
	paid: string;
	loading: boolean;
	category: string;
}

export interface MongoCourse {
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
