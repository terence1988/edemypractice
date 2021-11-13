import { Request, Response } from "express";
import { AWSError, S3 } from "aws-sdk";
import crypto from "crypto"; //node crypto
import { nanoid } from "nanoid";
import { DeleteObjectRequest, PutObjectRequest } from "aws-sdk/clients/s3";
import slugify from "slugify";
import { readFileSync } from "fs";
import Stripe from "stripe";
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

//old undefined error
const stripe = new Stripe(process?.env?.STRIPE_SECRET!, { apiVersion: "2020-08-27" });

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
		if (user && user.courses) {
			for (let i = 0; i < user.courses.length; i++) {
				ids.push(user.courses[i].toString());
			}
			return res.json({
				status: ids.includes(courseId),
				course: await Course.findById(courseId).exec()
			});
		}
		console.log(ids);
		res.json({ status: ids.includes(courseId), course: [] });
	} catch (error) {
		console.log(error);
		res.json(error);
	}
};

export const freeEnrollment = async (req: Request, res: Response) => {
	try {
		//check if course is free or paid
		const course = await Course.findById(req.params.courseId).exec();
		if (course.paid.toString() === "paid") return;

		const result = await User.findByIdAndUpdate(
			(req?.user as MongoUser)._id,
			{
				$addToSet: { courses: course._id }
				//adds a value to an array unless the value is already present,
			},
			{ new: true }
		).exec();
		return res.json({
			message: `You have enrolled the course`,
			course
		});
	} catch (err) {
		console.log("free enrollment err", err);
		return res.status(400).send(`Enrollment create failed`);
	}
};

export const paidEnrollment = async (req: Request, res: Response) => {
	//session id => stripe checkout process
	// success / fail
	try {
		const course = await Course.findById(req.params.courseId).populate("instructor").exec();
		if (course.paid.toString(0) === "free") return;

		// application fee 30%
		const fee = (course.price * 30) / 100;
		//create stripe session
		//1. session to stripe

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: [
				{
					name: course.name,
					amount: Math.round(Number(course.price.toFixed(2)) * 100),
					currency: "usd",
					quantity: 1
				}
			],
			//charge buyer and transfer the remaining balance to seller (after fee)
			payment_intent_data: {
				application_fee_amount: Math.round(Number(fee.toFixed(2)) * 100),
				transfer_data: {
					destination: course.instructor.stripe_account_id
				}
			},
			cancel_url: `${process.env.STRIPE_CANCEL_URL}`,
			//redirect url when success
			success_url: `${process.env.STRIPE_SUCESS_URL}/${course._id}`
		});
		console.log(`Session Id ==>`, session.id);

		//we store session info when we send request to stripe to process the payment for network issues and etc.
		await User.findByIdAndUpdate((req.user as MongoUser)._id, { stripeSession: session }).exec();

		return res.send(session.id);
	} catch (err) {
		console.log(err);
		return res.send(err)
	}
};
