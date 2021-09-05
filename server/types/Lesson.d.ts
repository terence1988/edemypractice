export interface ILesson {
	title: string;
	content: string;
	free_preview: boolean;
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
	free_preview: boolean;
	video: {
		Location: string;
		Bucket: string;
		Key: string;
		ETag: string;
	};
}
