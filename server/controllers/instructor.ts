import { Request, Response } from "express";
import User from "../models/user";
import Course from "../models/course";
import { MongoUser } from "../types/User";
import Stripe from "stripe";
//const strip = require('stripe')(process.env.STRIPE_SECRET,{apiVersion: "2020-08-27"})
import queryString from "query-string";

const stripe = new Stripe(process.env.STRIPE_SECRET!, {
	apiVersion: "2020-08-27",
});

export const makeInstructor = async (req: Request, res: Response) => {
	try {
		//1. Find user from db
		const user = await User.findById((req.user as MongoUser)._id).exec();
		//2. if user do not have stripe_account_id, then create one
		if (!user.stripe_account_id) {
			const account = await stripe.accounts.create({ type: "express" });
			//console.log("ACCOUNT =>", account.id);
			user.stripe_account_id = account.id;
			user.save();
		}
		//3. Create account link based on account id
		let accountLink = await stripe.accountLinks.create({
			account: user.stripe_account_id,
			refresh_url: process.env.STRIPE_REDIRECT_URL,
			return_url: process.env.STRIPE_REDIRECT_URL,
			type: "account_onboarding",
		});
		//4. Pre-fill any info such as email
		accountLink = Object.assign(accountLink, {
			"stripe_user[email]": user.email,
		});
		// 5. Then send the account link as resp
		res.send(`${accountLink.url}?${queryString.stringify(accountLink)}`);
	} catch (err) {
		console.log(err);
		res.status(500).send("Internl Error, please try again");
	}
};

export const getAccountStatus = async (req: Request, res: Response) => {
	try {
		const user = await User.findById((req.user as MongoUser)._id).exec();
		const account = await stripe.accounts.retrieve(user.stripe_account_id);

		//check charge enabled
		if (!account.charges_enabled) {
			return res.status(401).send("Unauthorized");
		} else {
			const statusUpdated = await User.findByIdAndUpdate(
				user._id,
				{
					stripe_seller: account,

					// @ts-ignore next line seems a type bug
					$addToSet: { role: "Instructor" },
				},
				{ new: true }
			)
				.select("-password")
				.exec();
			res.json(statusUpdated);
		}
	} catch (error) {
		console.log(error);
	}
};

export const currentInstructor = async (req: Request, res: Response) => {
	try {
		let user = await User.findById((req.user as MongoUser)._id)
			.select("-password")
			.exec();
		console.log(user);
		if (!user.role.includes("Instructor")) {
			return res.sendStatus(403);
			//res.sendStatus(403); //equivalent to res.status(403).send('Forbidden')
		} else {
			return res.json({ ok: true });
		}
	} catch (error) {
		console.log(error);
	}
};

export const instructorCourses = async (req: Request, res: Response) => {
	//find courses based on instructor's id and send all courses to the front end
	try {
		const courses = await Course.find({ instructor: (req.user as MongoUser)._id })
			.sort({
				createdAt: -1,
			})
			.exec();
		res.json(courses);
	} catch (err) {
		console.log(err);
	}
};
