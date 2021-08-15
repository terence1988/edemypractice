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

import { uploadImage, removeImage, createCourse } from "../controllers/course";

import { makeInstructor, getAccountStatus, currentInstructor } from "../controllers/instructor";

import healthCheck from "../controllers/healthCheck";

import { requireSignin, isInstructor } from "../middleware";

router.get("/api/healthCheck", healthCheck);

router.post("/api/register", register);

router.post("/api/login", login); // 1. check pw, 2. hash pw, 3.save jwt on client -- hash user pw again, compare with hashed pw in db

router.get("/api/logout", logout);

router.get("/api/currentUser", requireSignin, currentUser);
router.get("/api/sendEmails", sendTestEmail);

router.post("/api/makeInstructor", requireSignin, makeInstructor);
router.post("/api/getAccountStatus", requireSignin, getAccountStatus);
router.get("/api/currentInstructor", requireSignin, currentInstructor);

//courses images and couese
router.post("/api/course", requireSignin, isInstructor, createCourse);

router.post("/api/course/upload-image", uploadImage);
router.post("/api/course/remove-image", removeImage);

router.post("/api/forgetPassword", forgetPassword);
router.post("/api/resetPassword", resetPassword);

export default router;
