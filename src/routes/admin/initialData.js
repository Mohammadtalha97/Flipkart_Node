import express from "express";
import { initialData } from "../../controller/admin/initialData.js";

const router = express.Router();

router.post("/initialData", initialData);

export default router;
