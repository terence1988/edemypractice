export interface ILesson {
	title: string;
	content: string;
	video: {
		Location: string;
		Bucket: string;
		Key: string;
		ETag: string;
	};
}

export interface IMongoLesson {
	_id: string;
	title: string;
	content: string;
	video: {
		Location: string;
		Bucket: string;
		Key: string;
		ETag: string;
	};
}
