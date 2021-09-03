import { Router } from "express";
import formidable from "express-formidable";
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

import {
	uploadImage,
	removeImage,
	createCourse,
	updateCourseBySlug,
	getCourseBySlug,
	uploadVideo,
	removeVideo,
	addLesson,
	removeLesson,
} from "../controllers/course";

import {
	makeInstructor,
	getAccountStatus,
	currentInstructor,
	instructorCourses,
} from "../controllers/instructor";

import healthCheck from "../controllers/healthCheck";

import { requireSignin, isInstructor } from "../middleware";

// define routes

router.get("/api/healthCheck", healthCheck);

router.post("/api/register", register);

router.post("/api/login", login); // 1. check pw, 2. hash pw, 3.save jwt on client -- hash user pw again, compare with hashed pw in db

router.get("/api/logout", logout);

router.get("/api/current-user", requireSignin, currentUser);
router.get("/api/send-emails", sendTestEmail);
//instructors
router.post("/api/make-instructor", requireSignin, makeInstructor);
router.post("/api/get-accountStatus", requireSignin, getAccountStatus);
router.get("/api/current-instructor", requireSignin, currentInstructor);
router.get("/api/instructor-courses", requireSignin, instructorCourses);

//courses images and couese
router.post("/api/course", requireSignin, isInstructor, createCourse);
router.get(`/api/course/:slug`, requireSignin, getCourseBySlug);
router.put(`/api/course/:slug`, requireSignin, isInstructor, updateCourseBySlug);
router.put(`/api/course/:slug/:lessonId`, requireSignin, isInstructor, removeLesson);
router.post(`/api/course/lesson/:slug/:instructorId`, requireSignin, isInstructor, addLesson);
router.post(
	"/api/course/video-upload/:instructorId",
	requireSignin,
	isInstructor,
	formidable(),
	uploadVideo
);
router.post("/api/course/video-remove/:instructorId", requireSignin, isInstructor, removeVideo);

router.post("/api/course/upload-image", uploadImage);
router.post("/api/course/remove-image", removeImage);

router.post("/api/forget-password", forgetPassword);
router.post("/api/reset-password", resetPassword);

export default router;
