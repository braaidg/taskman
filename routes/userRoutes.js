import express from "express";

import {
  register,
  authenticate,
  confirmAccount,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/", register);
router.post("/login", authenticate);
router.get("/confirm/:token", confirmAccount);

export default router;
