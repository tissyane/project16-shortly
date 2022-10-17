import express from "express";
import { getUsersUrls } from "../controllers/users.controller.js";
import { validateUser } from "../middlewares/user.middleware.js";

const router = express.Router();

router.get("/users/me", validateUser, getUsersUrls);

export default router;
