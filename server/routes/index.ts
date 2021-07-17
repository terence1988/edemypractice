import { Router } from "express";

const router = Router();

// controllers
import {
	register,
	login,
	logout,
	currentUser,
	sendTestEmail,
	forgetPassword,
	resetPassword,
} from "../controllers/auth";

import healthCheck from "../controllers/healthCheck";

import { requireSignin } from "../middleware";

router.get("/api/healthCheck", healthCheck);

router.post("/api/register", register);

router.post("/api/login", login); // 1. check pw, 2. hash pw, 3.save jwt on client -- hash user pw again, compare with hashed pw in db

router.get("/api/logout", logout);

router.get("/api/currentUser", requireSignin, currentUser);
router.get("/api/sendEmails", sendTestEmail);

router.post("/api/forgetPassword", forgetPassword);
router.post("/api/resetPassword", resetPassword);

export default router;
