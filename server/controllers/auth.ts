import User from "../models/user";
import { Request, Response } from "express";
import validator from "validator";
import jwt from "jsonwebtoken";
import { hashPassword, comparePassword } from "../utils/hash";
import bcrypt from "bcrypt";

export const register = async (req: Request, res: Response) => {
	try {
		const { name, email, password } = req.body;
		//email as unique data should be seen, needs validator
		if (!name) return res.status(400).send("Need a name");
		if (!password || !validator.isStrongPassword(password, { minLength: 8 }))
			return res.status(400).send("Need a strong password");
		if (!validator.isEmail(email)) return res.status(400).send("Need a valid email");
		let userExisted = await User.findOne({ email }).exec();
		if (userExisted) return res.status(400).send("Email has been used");
		//hashPassword
		const hashedPassword = await hashPassword(password);
		//register
		const user = new User({ name, email, password: hashedPassword });
		await user.save();
		console.log("Saved user", user);
		return res.json({ ok: true });
	} catch (err) {
		console.log(err);
		return res.status(400).send("Error: " + JSON.stringify(err));
	}
};

export const login = async (req: Request, res: Response) => {
	try {
		if (!req.body) return res.status(400).send("Bad Request");
		const { email, password } = req.body;
		//email as unique data should be seen, needs validator
		const user = await User.findOne({ email }).exec();
		if (!user) return res.status(406).send("Invalid user name or password, please try again");
		//hashPassword
		const isMatched = await comparePassword(password, user.password);
		if (!isMatched) return res.status(406).send("Invalid user name or password, please try again");
		//create token
		const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET!, { expiresIn: "7d" });
		// return user and token to client, exclude hashed password -- JWT has undefined somewhere
		user.password = "";
		//send token in cookie which is part of response header
		console.log(user);
		res.cookie("token", token, {
			httpOnly: true,
			// secure: true,  //secure will only allow https
		});
		//send user as response body
		res.json(user);
	} catch (err) {
		console.log(err);
		return res.status(400).send("Error: Try again");
	}
};
