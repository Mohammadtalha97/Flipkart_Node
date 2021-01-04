import express from "express";
import {
  adminMiddleware,
  requireSignin,
} from "../../common-middleware/index.js";
import { initialData } from "../../controller/admin/initialData.js";

const router = express.Router();

router.post("/initialData", requireSignin, adminMiddleware, initialData);

export default router;
