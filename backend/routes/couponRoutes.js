import express from "express";
import { protectRoute } from "../middlewares/authMiddleware.js";
import {
  getAllCoupons,
  validateCoupon,
} from "../controllers/couponController.js";

const router = express.Router();

router.get("/", protectRoute, getAllCoupons);
router.post("/validate", protectRoute, validateCoupon);

export default router;
