import express from "express";
import { signup, signin } from "../controller/auth.js";
import {
  validateSignupRequest,
  isRequestValidated,
  validateSigninRequest,
} from "../validators/auth.js";
const router = express.Router();

router.post("/signup", validateSignupRequest, isRequestValidated, signup);

router.post("/signin", validateSigninRequest, isRequestValidated, signin);

// router.post("/profile", requireSignin, (req, res) => {
//   res.status(200).json({
//     message: "Profile",
//   });
// });

export default router;
