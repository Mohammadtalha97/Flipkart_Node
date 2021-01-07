import express from "express";

import { requireSignin, userMiddleware } from "../common-middleware/index.js";
import { addItemToCart, getCartItems } from "../controller/cart.js";

const router = express.Router();

router.post(
  "/user/cart/addToCart",
  requireSignin,
  userMiddleware,
  addItemToCart
);

router.post("/user/getCartItems", requireSignin, userMiddleware, getCartItems);

export default router;
