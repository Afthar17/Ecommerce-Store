// Desc: Controller for user authentication

import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { redis } from "../lib/redis.js";

const generateToken = (id) => {
  const accessToken = jwt.sign({ id }, process.env.ACCESS_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ id }, process.env.REFRESH_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refresh_token:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  );
};

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true, //prevent XSS attacks cross site scripting
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", //prevent CSRF attack cross site request forgery,
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, //prevent XSS attacks cross site scripting
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", //prevent CSRF attack cross site request forgery,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const signUp = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).json("please provide name, email and password");
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).json("User already exists");
  }

  const user = await User.create({ name, email, password });

  const { accessToken, refreshToken } = generateToken(user._id);
  await storeRefreshToken(user._id, refreshToken);

  setCookies(res, accessToken, refreshToken);

  res.status(201).send({
    email,
    id: user._id,
    name,
    role: user.role,
  });
});

export const login = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.comparePassword(password))) {
      const { accessToken, refreshToken } = generateToken(user._id);
      await storeRefreshToken(user._id, refreshToken);
      setCookies(res, accessToken, refreshToken);

      res.json({
        email,
        id: user._id,
        name: user.name,
        role: user.role,
      });
    } else {
      res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.log("error in login", error.message);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
});

export const logout = asyncHandler(async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
      await redis.del(`refresh_token:${decoded.id}`);
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("error in logout", error.message);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
});

// this function will refresh the access token
export const refreshToken = asyncHandler(async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const checkStoredToken = await redis.get(`refresh_token:${decoded.id}`);
    if (checkStoredToken !== refreshToken) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const accessToken = jwt.sign(
      { id: decoded.id },
      process.env.ACCESS_SECRET,
      { expiresIn: "15m" }
    );
    res.cookie("acessToken", accessToken, {
      httpOnly: true, //prevent XSS attacks cross site scripting
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict", //prevent CSRF attack cross site request forgery,
      maxAge: 15 * 60 * 1000,
    });
    res.json({ message: "Access token refreshed successfully" });
  } catch (error) {
    console.log("error in refreshToken", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export const getUserProfile = asyncHandler(async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json(user);
  } catch (error) {
    console.log("error in getUserProfile", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
