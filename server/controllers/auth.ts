import User from "../models/user";
import { Request, Response } from "express";
import validator from "validator";
import { hashPassword } from "../utils/hash";

const register = async (req: Request, res: Response) => {
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

export default register;
