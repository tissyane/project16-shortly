import express from "express";
import {
  deleteSession,
  signIn,
  signUp,
} from "../controllers/auth.controller.js";
import { checkEmail, isUser } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/schema.middleware.js";

import { validateUser } from "../middlewares/user.middleware.js";
import { signInSchema, signUpSchema } from "../schemas/userAuth.schema.js";

const router = express.Router();

router.post("/signup", validateSchema(signUpSchema), checkEmail, signUp);
router.post("/signin", validateSchema(signInSchema), isUser, signIn);
router.delete("/logout", validateUser, deleteSession);

export default router;
