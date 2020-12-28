import express from "express";
import path from "path";
import shortid from "shortid";
import multer from "multer";
import { adminMiddleware, requireSignin } from "../common-middleware/index.js";
import { addCategory, getCategories } from "../controller/category.js";

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
  "/category/create",
  requireSignin,
  adminMiddleware,
  upload.single("categoryImage"),
  addCategory
);
router.get("/category/getCategory", getCategories);

export default router;
