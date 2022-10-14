import express from "express";
import {
  createUser,
  deleteSession,
  logIn,
} from "../controllers/user.controller.js";
import validateSchema from "../middlewares/schema.middleware.js";
import {
  checkEmail,
  isLoggedUser,
  isUser,
} from "../middlewares/user.middleware.js";
import { signInSchema, signUpSchema } from "../schemas/userAuth.schema.js";

const router = express.Router();

router.post("/signup", validateSchema(signUpSchema), checkEmail, createUser);
router.post("/signin", validateSchema(signInSchema), isUser, logIn);
router.delete("/logout", isLoggedUser, deleteSession);

export default router;
