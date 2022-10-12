import express from "express";
import {
  createUser,
  deleteSession,
  logIn,
} from "../controllers/user.controller.js";
import {
  checkEmail,
  isLoggedUser,
  isUser,
} from "../middlewares/user.middleware.js";
import {
  signInSchemaValidation,
  signUpSchemaValidation,
} from "../middlewares/userSchemas.middleware.js";

const router = express.Router();

router.post("/signup", signUpSchemaValidation, checkEmail, createUser);
router.post("/signin", signInSchemaValidation, isUser, logIn);
router.delete("/logout", isLoggedUser, deleteSession);

export default router;
