import { Request, Response } from "express";
import { AWSError, S3 } from "aws-sdk";
import crypto from "crypto";
import _ from "lodash";
import { nanoid } from "nanoid";
import { PutObjectRequest } from "aws-sdk/clients/s3";

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
		const type = image.split(";")[0].split("/");
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
