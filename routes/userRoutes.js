import express from "express";

import {
  register,
  authenticate,
  confirmAccount,
  forgotPassword,
  checkToken,
  newPassword,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/", register);
router.post("/login", authenticate);

router.post("/forgot-password", forgotPassword);

router.get("/confirm/:token", confirmAccount);

router.route("/forgot-password/:token").get(checkToken).post(newPassword);

export default router;
