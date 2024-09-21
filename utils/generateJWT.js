import jwt from "jsonwebtoken";
import { UserModel } from "../models/userModel.js";

export const generateJWT = async (res, userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "3d",
  });

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET_KEY,
    { expiresIn: "9d" }
  );


  await UserModel.findByIdAndUpdate(userId, {
    refreshToken,
    refreshTokenExpiresAt: Date.now() + 9 * 24 * 60 * 60 * 1000
  })

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 3 * 24 * 60 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 9 * 24 * 60 * 60 * 1000,
  });

  return { accessToken, refreshToken };
}