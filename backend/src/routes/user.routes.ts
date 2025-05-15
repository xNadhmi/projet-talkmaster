import express from "express";
import { userController } from "../controllers";
import * as authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/register", userController.createUser);
router.get(
  "/:id",
  authMiddleware.authenticateToken,
  userController.getUserById
);
router.post("/login", userController.loginUser);
router.post(
  "/reset-password",
  authMiddleware.authenticateToken,
  userController.resetPassword
);

export default router;
