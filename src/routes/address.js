import express from "express";
const router = express.Router();
import { requireSignin, userMiddleware } from "../common-middleware/index.js";
import { addAddress, getAddress } from "../controller/address.js";

router.post("/user/address/create", requireSignin, userMiddleware, addAddress);

router.post("/user/getaddress", requireSignin, userMiddleware, getAddress);

// router.post("/profile", requireSignin, (req, res) => {
//   res.status(200).json({
//     message: "Profile",
//   });
// });

export default router;
