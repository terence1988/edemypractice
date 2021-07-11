import expressJWT from "express-jwt";

export const requireSignin = expressJWT({
	getToken: (req) => req.cookies.token,
	secret: process.env.JWT_SECRET!,
	algorithms: ["HS256"],
});

//getToken callback only takes req to proceed
