import express from "express";
import {
  deleteUrl,
  getUrlbyId,
  openUrl,
  shortenUrl,
} from "../controllers/urls.controller.js";
import { validateUrl } from "../middlewares/url.middleware.js";
import { validateUser } from "../middlewares/user.middleware.js";
import { validateSchema } from "../middlewares/schema.middleware.js";
import { urlSchema } from "../schemas/url.schema.js";

const router = express.Router();

router.post(
  "/urls/shorten",
  validateSchema(urlSchema),
  validateUser,
  shortenUrl
);
router.get("/urls/:id", validateUrl, getUrlbyId);
router.get("/urls/open/:shortUrl", validateUrl, openUrl);
router.delete("/urls/:id", validateUrl, validateUser, deleteUrl);

export default router;
