export interface ILesson {
	title: string;
	free_preview: boolean;
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
	free_preview: boolean;
	content: string;
	video: {
		Location: string;
		Bucket: string;
		Key: string;
		ETag: string;
	};
}
