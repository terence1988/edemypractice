import { Request, Response } from "express";
import { AWSError, S3 } from "aws-sdk";
import crypto from "crypto"; //node crypto
import { nanoid } from "nanoid";
import { PutObjectRequest } from "aws-sdk/clients/s3";
import slugify from "slugify";

import Course from "../models/course";
import { MongoCourse } from "../types/Course";
import { MongoUser } from "../types/User";

const awsConfig = {
	assessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REGION,
	apiVersion: process.env.AWS_API_VERSION,
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
		console.log(type);
		const params: PutObjectRequest = {
			Bucket: "tedemy-bucket",
			Key: `${nanoid()}.${type}`, // nanoid.jpeg Key -> filename in S3
			Body: base64Image,
			ACL: "public-read",
			ContentType: `image/${type}`,
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
	}
};

export const removeImage = async (req: Request, res: Response) => {
	console.log(req.body);
	res.send({ ok: true });
	try {
		const { image } = req.body;
		if (!image) return res.status(400).send("No image");

		//image params from client ????
		const params: PutObjectRequest = {
			Bucket: image.Bucket,
			Key: image.Key,
		};

		s3.deleteObject(params, (err, data) => {
			if (err) {
				console.log(err);
				res.sendStatus(400);
			}
			res.send({ ok: true });
		});
	} catch (err) {
		console.log(err);
	}
};

// React for beginners
// react-for-beginners --> slug is auto generated (?) via slugify or something in this format
export const createCourse = async (req: Request, res: Response) => {
	try {
		const alreadyExist = await Course.findOne({
			slug: slugify((req.body as MongoCourse).name.toLowerCase()),
		});
		if (alreadyExist) return res.status(400).send("Title has been used");

		//mongoDB will save things in lowercases
		const course = await new Course({
			slug: slugify((req.body as MongoCourse).name),
			instructor: (req.user as MongoUser)._id,
			...req.body,
		}).save();
		res.json(course);
	} catch (err) {
		console.log(err);
		return res.status(400).send("Course Creat error, try again");
	}
};
