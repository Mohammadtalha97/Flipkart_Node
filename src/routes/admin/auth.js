import express from "express";
// import { requireSignin } from "../../common-middleware/index.js";

import { signin, signup, signout } from "../../controller/admin/auth.js";
import {
  isRequestValidated,
  validateSigninRequest,
  validateSignupRequest,
} from "../../validators/auth.js";

const router = express.Router();

router.post("/admin/signup", validateSignupRequest, isRequestValidated, signup);

router.post("/admin/signin", validateSigninRequest, isRequestValidated, signin);

router.post("/admin/signout", signout);

export default router;
