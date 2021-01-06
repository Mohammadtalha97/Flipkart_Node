import express from "express";
import {
  adminMiddleware,
  requireSignin,
  upload,
} from "../../common-middleware/index.js";
import { createPage, getPage } from "../../controller/admin/page.js";

const router = express.Router();

router.post(
  "/page/create",
  upload.fields([{ name: "banners" }, { name: "products" }]),
  requireSignin,
  adminMiddleware,
  createPage
);

router.get("/page/:category/:type", getPage);

export default router;
