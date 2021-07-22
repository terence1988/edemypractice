import { Request, Response } from "express";
import User from "../models/user";
import { MongoUser } from "../types/User";
import Stripe from "stripe";
//const strip = require('stripe')(process.env.STRIPE_SECRET,{apiVersion: "2020-08-27"})
import queryString from "query-string";

const stripe = new Stripe(process.env.STRIPE_SECRET, {
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
