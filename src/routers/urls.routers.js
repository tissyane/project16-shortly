import express from "express";
import {
  getUrlbyId,
  openUrl,
  shortenUrl,
} from "../controllers/urls.controller.js";
import { validateSchema } from "../middlewares/schema.middleware.js";

import { validateToken } from "../middlewares/user.middleware.js";
import { urlSchema } from "../schemas/url.schema.js";

const router = express.Router();

router.post(
  "/urls/shorten",
  validateSchema(urlSchema),
  validateToken,
  shortenUrl
);
router.get("/urls/:id", getUrlbyId);
router.get("/urls/open/:shortUrl", openUrl);

export default router;
