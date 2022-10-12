import express from "express";
import { createUser, logIn } from "../controllers/user.controller.js";
import {
  signInValidation,
  signUpValidation,
} from "../middlewares/user.middleware.js";

const router = express.Router();

router.post("/signup", signUpValidation, createUser);
router.post("/signin", signInValidation, logIn);

export default router;
