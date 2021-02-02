import express from "express";

import {
  adminMiddleware,
  requireSignin,
} from "../../common-middleware/index.js";

import updateOrder from "../../controller/admin/order.admin.js";

const router = express.Router();

router.post("/order/update", requireSignin, adminMiddleware, updateOrder);

export default router;
