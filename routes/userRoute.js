import express from "express";
import {
  refreshToken,
  signIn,
  resetPassword,
  signOut,
  signUp,
} from "../controllers/userController.js";
import { verifyToken } from "../middleware/verifyToken.js";

export const userRouter = express.Router()
userRouter.post("/sign-up", signUp)
userRouter.post("/refresh-token", refreshToken);
userRouter.post("/sign-in", signIn)
userRouter.post("/reset-password", verifyToken, resetPassword);
userRouter.post("/sign-out", signOut)