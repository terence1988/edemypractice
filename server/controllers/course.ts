import { Request, Response } from "express";
import { AWSError, S3 } from "aws-sdk";
import crypto from "crypto"; //node crypto
import { nanoid } from "nanoid";
import { DeleteObjectRequest, PutObjectRequest } from "aws-sdk/clients/s3";
import slugify from "slugify";
import { readFileSync } from "fs";

import Course from "../models/course";
import { MongoCourse } from "../types/Course";
import { MongoUser } from "../types/User";
import { ILesson } from "../types/Lesson";
import User from "../models/user";

const awsConfig = {
	assessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REGION
};

const s3 = new S3(awsConfig);

function sha256(data: string) {
	return crypto.createHash("sha256").update(data, "binary").digest("base64");
	// data -- base64 encoded image byte string      ------  binary: hash the byte string
}

export const uploadImage = async (req: Request, res: Response) => {
	//req.body.image
	try {
		const { image } = req.body;
		if (!image) return res.status(400).send("No image");

		//prepare the image (image in base64 encoded format)
		const base64Image = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""), "base64");
		//base64 is offset

		//image metadata
		const type = image.split(";")[0].split("/")[1];
		const params: PutObjectRequest = {
			Bucket: "tedemy-bucket",
			Key: `${nanoid()}.${type}`, // nanoid.jpeg Key -> filename in S3
			Body: base64Image,
			ACL: "public-read",
			ContentType: `image/${type}`
		};
		//upload to s3
		s3.upload(params, (err: Error, data: S3.ManagedUpload.SendData) => {
			if (err) {
				return res.sendStatus(400);
			} else {
				console.log(data);
				return res.send(data);
			}
		});
	} catch (err) {
		console.log(err);
		res.send("Had some errors");
	}
};

export const removeImage = async (req: Request, res: Response) => {
	try {
		const { image } = req.body;
		if (!image) return res.status(400).send("No image");

		//image params from client ????
		const params: PutObjectRequest = {
			Bucket: image.Bucket,
			Key: image.Key
		};

		s3.deleteObject(params, (err, data) => {
			if (err) {
				console.log(err);
				return res.sendStatus(400);
			} else {
				return res.send({ ok: true });
			}
		});
	} catch (err) {
		console.log(err);
		res.send("Had some errors");
	}
};

// React for beginners
// react-for-beginners --> slug is auto generated (?) via slugify or something in this format
export const createCourse = async (req: Request, res: Response) => {
	try {
		const alreadyExist = await Course.findOne({
			slug: slugify((req.body as MongoCourse).name.toLowerCase())
		});
		if (alreadyExist) return res.status(400).send("Title has been used");

		//mongoDB will save things in lowercases
		const course = await new Course({
			slug: slugify((req.body as MongoCourse).name),
			instructor: (req.user as MongoUser)._id,
			...req.body
		}).save();
		res.json(course);
	} catch (err) {
		console.log(err);
		res.status(400).send("Course Create error, try again");
	}
};

export const getCourseBySlug = async (req: Request, res: Response) => {
	try {
		const course = await Course.findOne({ slug: req.params.slug })
			.populate("instructor", "_id name")
			.exec();
		res.json(course);
	} catch (err) {
		console.log(err);
		res.status(400).send("Fetch course errors");
	}
};

export const updateCourseBySlug = async (req: Request, res: Response) => {
	const { slug } = req.params;
	try {
		const updatedCourse: MongoCourse = await Course.findOne({ slug });
		if ((req.user as MongoUser)._id.toString() !== updatedCourse.instructor.toString()) {
			return res.status(400).send("Unauthorized to do this");
		}
		const updateTheCourse: MongoCourse = await Course.findOneAndUpdate({ slug }, req.body, {
			new: true
		}).exec();
		//return updated data to FE

		res.json(updateTheCourse);
	} catch (err) {
		console.log(err);
		res.send("Got some error line:145");
	}
};

export const uploadVideo = async (req: Request, res: Response) => {
	//req.body.image
	//req.files was provided by formible() parser
	//auth -> would like to have current user and isInstructor
	if ((req.user as MongoUser)._id !== req.params.instructorId) {
		return res.sendStatus(401);
	}
	try {
		const { video } = req.files as any;
		//console.log(video);
		if (!video) return res.status(400).send("No video");
		// after upload, file is in /tmp
		const params: PutObjectRequest = {
			Bucket: "tedemy-bucket",
			Key: `${nanoid()}.${video.type.split("/")[1]}`, // nanoid.jpeg Key -> filename in S3
			Body: readFileSync(video.path),
			ACL: "public-read",
			ContentType: `${video.type}` //video/mp4
		};
		//upload to s3
		s3.upload(params, (err: Error, data: S3.ManagedUpload.SendData) => {
			if (err) {
				return res.sendStatus(400);
			} else {
				console.log(data);
				return res.send(data);
			}
		});
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
};

export const removeVideo = async (req: Request, res: Response) => {
	//req.body.video -> file name

	//auth -> would like to have current user and isInstructor
	if ((req.user as MongoUser)._id !== req.params.instructorId) {
		return res.sendStatus(401);
	}
	try {
		const video: ILesson["video"] = req.body;
		console.log(video);
		if (!video) return res.status(400).send("No video");
		// after upload, file is in /tmp
		const params: DeleteObjectRequest = {
			Bucket: video.Bucket,
			Key: video.Key
		};
		//upload to s3
		s3.deleteObject(params, (err: Error, data: S3.DeleteObjectOutput) => {
			if (err) {
				return res.sendStatus(400);
			} else {
				console.log(data);
				return res.send(data);
			}
		});
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
};

export const addLesson = async (req: Request, res: Response) => {
	const { slug, instructorId } = req.params;
	const { title, content, video } = req.body;
	if ((req.user as MongoUser)._id !== instructorId) {
		return res.status(400).send("Unauthorized to do this");
	}
	try {
		const updatedCourse = await Course.findOneAndUpdate(
			{ slug },
			// @ts-ignore  // Known to be complained because optional null
			{ $push: { lessons: { title, content, video, slug: slugify(title) } } },
			{ new: true }
		)
			.populate("instructor", "_id name")
			.exec();
		res.json(updatedCourse);
	} catch (err) {
		console.log(err);
		res.status(500).send("Add lesson failed");
	}
};

export const removeLesson = async (req: Request, res: Response) => {
	const { slug, lessonId } = req.params;
	const updatedCourse: MongoCourse = await Course.findOne({ slug }).exec();
	if ((req.user as MongoUser)._id.toString() !== updatedCourse.instructor.toString()) {
		return res.status(400).send("Unauthorized to do this");
	}
	try {
		const updateCourse = await Course.findByIdAndUpdate(
			updatedCourse._id,
			// @ts-ignore  // Known to be complained because optional null
			{ $pull: { lessons: { _id: lessonId } } }
		).exec();
		res.json(updateCourse);
	} catch (err) {
		console.log(err);
		res.status(500).send("Add lesson failed");
	}
};

export const updateLesson = async (req: Request, res: Response) => {
	//console.log(req.body);
	const { slug, instructorId } = req.params;
	const { _id, title, content, video, free_preview } = req.body;
	const course = await Course.findOne({ slug }).select("instructor").exec();
	if (course.instructor._id.toString() !== instructorId.toString()) {
		return res.status(400).send("Unauthorized to do this");
	}

	try {
		const updateCourse = await Course.updateOne(
			{ "lessons._id": _id },
			{
				$set: {
					"lessons.$.title": title,
					"lessons.$.content": content,
					"lessons.$.video": video,
					"lessons.$.free_preview": free_preview
				}
			},
			{ new: true }
		).exec();

		res.json(updateCourse);
	} catch (err) {
		console.log(err);
		res.status(500).send("Update lesson failed");
	}
};

export const handleCoursePublish = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { publishStatus } = req.body;
	if (!id) return res.json("Need course ID");
	if (!publishStatus) return res.json("Need to know what to do");

	const course = await Course.findById(id).select("instructor").exec();
	if ((req.user as MongoUser)._id !== course.instructor._id.toString()) {
		return res.status(400).send("Unauthorized to do this");
	}
	const published = publishStatus === "true";
	try {
		const result = await Course.findByIdAndUpdate(id, { published: published });
		res.json(result);
	} catch (err) {
		console.log(err);
		res.status(500).send("Publish course failed");
	}
};

export const getCourses = async (req: Request, res: Response) => {
	const allCourses = await Course.find({ published: true })
		.populate("instructor", "_id name")
		.exec();
	res.json(allCourses);
};

export const checkEnrollment = async (req: Request, res: Response) => {
	try {
		const { courseId } = req.params;
		//find courses of tyhe currrently logged in user
		const user = await User.findById((req?.user as MongoUser)._id).exec();
		//check if course id is found in the user courses array
		let ids: string[] = [];
		//mongoose string does not restricted to string
		if (user && user.course) {
			for (let i = 0; i < user.courses.length; i++) {
				ids.push(user.courses[i].toString());
			}
			return res.json({
				status: ids.includes(courseId),
				course: await Course.findById(courseId).exec()
			});
		}
		res.json({ status: ids.includes(courseId), course: [] });
	} catch (error) {
		console.log(error);
		res.json(error);
	}
};
