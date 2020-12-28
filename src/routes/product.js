import express from "express";
import multer from "multer";
import path from "path";
import shortid from "shortid";

import { adminMiddleware, requireSignin } from "../common-middleware/index.js";
import { createProduct } from "../controller/product.js";

const router = express.Router();
const __dirname = path.resolve();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname + "\\src", "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

router.post(
  "/product/create",
  requireSignin,
  adminMiddleware,
  upload.array("productPicture"),
  createProduct
);

export default router;
