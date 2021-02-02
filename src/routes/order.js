import express from "express";
import { requireSignin, userMiddleware } from "../common-middleware/index.js";
import { addOrder, getOrder, getOrders } from "../controller/order.js";

const router = express.Router();

router.post("/addOrder", requireSignin, userMiddleware, addOrder);
router.get("/getOrders", requireSignin, userMiddleware, getOrders);
router.post("/getOrder", requireSignin, userMiddleware, getOrder);

export default router;
