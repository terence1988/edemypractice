import mongoose from "mongoose";
const { Schema } = mongoose;
const ObjectId = mongoose.Types.ObjectId;

const lessonSchema = new Schema(
	{
		title: {
			type: String,
			trim: true,
			minlength: 3,
			maxlength: 320,
			required: true,
		},
		//slug mongoDB commenting system built-in
		slug: {
			type: String,
			lowercase: true,
		},
		content: {
			type: {},
			minlength: 200,
		},
		video_link: {},
		free_preview: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
	//Generally mean the createdAt and updatedAt
);

const courseSchema = new Schema(
	{
		name: {
			type: String,
			trim: true,
			minlength: 3,
			maxlength: 320,
			required: true,
		},
		slug: {
			type: String,
			lowercase: true,
		},
		description: {
			type: {},
			minlength: 200,
			required: true,
		},
		price: {
			type: Number,
			default: 9.99,
		},
		image: {},
		category: { type: String },
		published: { type: Boolean, default: false },
		paid: { type: String },
		instructor: {
			type: ObjectId,
			ref: "User",
			required: true,
		},
		lessons: [lessonSchema],
	},
	{ timestamps: true }
);

export default mongoose.model("course", courseSchema);
