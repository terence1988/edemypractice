import expressJWT from "express-jwt";
import { Request, Response } from "express";
import User from "../models/user";
import { MongoUser } from "../types/User";

export const requireSignin = expressJWT({
	getToken: (req) => req.cookies.token,
	secret: process.env.JWT_SECRET!,
	algorithms: ["HS256"],
});

//getToken callback only takes req to proceed
//as user is encoded, probably needed to get user

export const isInstructor = async (req: Request, res: Response, next: Function) => {
	try {
		const user = await User.findById((req.user as MongoUser)._id).exec();
		if (!user.role.includes("Instructor")) {
			return res.sendStatus(403);
		} else {
			next();
		}
	} catch (err) {
		console.log(err);
		return res.sendStatus(500);
	}
};
