import express from "express";
import { createUser } from "../controllers/user.controller.js";
import {
  isUserValidation,
  signUpValidation,
} from "../middlewares/user.middleware.js";

const router = express.Router();

router.post("/signup", signUpValidation, isUserValidation, createUser);

export default router;
