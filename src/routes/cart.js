import express from "express";

import { requireSignin, userMiddleware } from "../common-middleware/index.js";
import { addItemToCart } from "../controller/cart.js";

const router = express.Router();

router.post(
  "/user/cart/addToCart",
  requireSignin,
  userMiddleware,
  addItemToCart
);

export default router;
