import express from "express";

import {
  register,
  authenticate,
  confirmAccount,
  forgotPassword,
  checkToken,
  newPassword,
  profile,
  googleLogin,
} from "../controllers/userController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.post("/", register);

router.post("/login", authenticate);

router.post("/googleAuth", googleLogin);

router.post("/forgot-password", forgotPassword);

router.get("/confirm/:token", confirmAccount);

router.route("/forgot-password/:token").get(checkToken).post(newPassword);

router.get("/profile", checkAuth, profile);

export default router;
