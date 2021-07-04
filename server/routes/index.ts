import { Router } from "express";

const router = Router();

// controllers
import register from "../controllers/auth";
import login from "../controllers/auth";

router.post("/register", register);

router.post("/login", login); // 1. check pw, 2. hash pw, 3.save jwt on client -- hash user pw again, compare with hashed pw in db

export default router;
