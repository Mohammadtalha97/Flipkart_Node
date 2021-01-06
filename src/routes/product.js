import express from "express";

import { adminMiddleware, requireSignin } from "../common-middleware/index.js";
import {
  createProduct,
  getProductBySlug,
  getProductDetailsById,
} from "../controller/product.js";

import multer from "multer";
import path from "path";
import shortid from "shortid";
// import pkg from "../../../flipkart/flipkart-clone/src/redux/actions/index.js";
// const { getProductDetailsById } = pkg;

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

router.get("/products/:slug", getProductBySlug);
router.get("/product/:productId", getProductDetailsById);

export default router;
