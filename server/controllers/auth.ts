import User from "../models/user";
import { Request, Response } from "express";
import validator from "validator";
import jwt from "jsonwebtoken";
import { hashPassword, comparePassword } from "../utils/hash";
import { MongoUser } from "../types/User";

//utils
import { nanoid } from "nanoid";

//AWS
import { AWSError, SESV2 } from "aws-sdk";

const awsConfig = {
	assessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REGION,
	apiVersion: process.env.AWS_API_VERSION,
};

export const register = async (req: Request, res: Response) => {
	try {
		const { name, email, password } = req.body;
		//email as unique data should be seen, needs validator
		if (!name) return res.status(400).send("Need a name");
		if (!password || !validator.isStrongPassword(password, { minLength: 8 }))
			return res.status(400).send("Need a strong password");
		if (!validator.isEmail(email))
			return res.status(400).send("Need a valid email");
		let userExisted = await User.findOne({ email }).exec();
		if (userExisted) return res.status(400).send("Email has been used");
		//hashPassword
		const hashedPassword = await hashPassword(password);
		//register
		const user = new User({ name, email, password: hashedPassword });
		await user.save();
		console.log("Saved user", user);
		res.json({ ok: true });
	} catch (err) {
		console.log(err);
		res.status(400).send("Error: " + JSON.stringify(err));
	}
};

export const login = async (req: Request, res: Response) => {
	try {
		if (!req.body) return res.status(400).send("Bad Request");
		const { email, password } = req.body;
		//email as unique data should be seen, needs validator
		const user = await User.findOne({ email }).exec();
		if (!user)
			return res
				.status(406)
				.send("Invalid user name or password, please try again");
		//hashPassword
		const isMatched = await comparePassword(password, user.password);
		if (!isMatched)
			return res
				.status(406)
				.send("Invalid user name or password, please try again");
		//create token
		const token = jwt.sign(
			{ _id: user._id },
			process.env.JWT_SECRET as string,
			{
				expiresIn: "7d",
			}
		);
		// return user and token to client, exclude hashed password -- JWT has undefined somewhere
		user.password = "";
		//send token in cookie which is part of response header
		var expiryDate = new Date(Date.now() + 60 * 24 * 3600000);
		res.cookie("token", token, {
			expires: expiryDate,
			maxAge: 14 * 60 * 60 * 1000,
			httpOnly: true,
			// secure: true,  //secure will only allow https
		});
		//send user as response body
		res.json(user);
	} catch (err) {
		console.log(err);
		res.status(400).send("Error: Try again");
	}
};

export const logout = async (req: Request, res: Response) => {
	try {
		res.clearCookie("token");
		res.json({ message: "Signout successfully" });
	} catch (err) {
		console.log(err);
		res.send("Have some error");
	}
};

export const currentUser = async (req: Request, res: Response) => {
	try {
		const user = await User.findById((req.user as MongoUser)._id)
			.select("-password")
			.exec();
		console.log("Current User found", user);
		res.json({ ok: true }); //save some bandwidth
	} catch (err) {
		console.error(err);
		res.send("Have some error");
	}
};

export const sendTestEmail = (req: Request, res: Response) => {
	const params = {
		FromEmailAddress: process.env.EMAIL_FROM!,
		Destination: {
			ToAddresses: ["awstest135@gmail.com"],
		},
		//Destination:['']
		ReplyToAddresses: [process.env.EMAIL_FROM!],
		Content: {
			Simple: {
				Subject: {
					Charset: "UTF-8",
					Data: `Password reset link`,
				},
				Body: {
					Html: {
						Charset: "UTF-8",
						Data: `
					<html>
					<h1>Reset password link</h1>
					<p>Please use the following link to reset your password</p>
					</html>
					`,
					},
				},
			},
		},
	};
	const ses = new SESV2(awsConfig);

	ses.sendEmail(params, (err: AWSError, data: SESV2.SendEmailResponse) => {
		if (err) console.error(err);
		else {
			console.log(data);
			res.json({ ok: true });
		}
	});
};

export const forgetPassword = async (req: Request, res: Response) => {
	try {
		const { email } = req.body;
		const shortCode = nanoid(8).toUpperCase();
		const user = await User.findOneAndUpdate(
			{ email },
			{ passwordResetCode: shortCode }
		);
		if (!user) return res.status(400).send("User not found");
		//send these as email -- template and ses
		const params = {
			FromEmailAddress: process.env.EMAIL_FROM!,
			Destination: {
				ToAddresses: [email],
			},
			//Destination:['']
			Content: {
				Simple: {
					Subject: {
						Charset: "UTF-8",
						Data: `Password reset link`,
					},
					Body: {
						Html: {
							Charset: "UTF-8",
							Data: `
						<html>
						<h1>Reset password link</h1>
						<p>Please use the following code to reset your password</p>
						<p style="color:red">${shortCode}</p>
						<i>edemy.com</i>
						</html>
						`,
						},
					},
				},
			},
		};
		const ses = new SESV2(awsConfig);

		ses.sendEmail(params, (err: AWSError, data: SESV2.SendEmailResponse) => {
			if (err) console.error(err);
			else {
				console.log(data);
				res.json({ ok: true });
			}
		});
	} catch (err) {
		console.error(err);
		res.status(400).send("Encountered Errors");
	}
};

export const resetPassword = async (req: Request, res: Response) => {
	try {
		const { email, code, newPassword } = req.body;
		console.table({ email, code, newPassword });
		const newHashedPassword = await hashPassword(newPassword);
		const user = User.findOneAndUpdate(
			{ email, passwordResetCode: code },
			{ password: newHashedPassword, passwordResetCode: "" }
		).exec();
		res.json({ ok: true });
	} catch (err) {
		console.error(err);
		res.status(400).json("Please try again");
	}
};
