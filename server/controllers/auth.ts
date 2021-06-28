import User from "../models/user";
import { Request, Response } from "express";
import validator from "validator";

export const register = async (req: Request, res: Response) => {
	try {
		const { name, email, password } = req.body;
		//email as unique data should be seen, needs validator
		if (!name) return res.status(400).send("Need a name");
		if (!password || validator.isStrongPassword(password, { minLength: 8 }))
			return res.status(400).send("Need a strong email");
		if (!validator.isEmail(email)) return res.status(400).send("Need an email");
	} catch (err) {
		console.log(err);
		return res.status(400).send("Error" + JSON.stringify(err));
	}
};
