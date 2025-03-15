import express from "express";
import { addNewCoupon, claimCoupon, deleteCoupon, getAllCoupons, getCouponById, updateCoupon, updateCouponStatus } from "../controllers/Coupon.controllers.js";
import { authMiddleware } from "../middlewares/Auth.middlewares.js";

const router = express.Router();

router.post("/admin/add", addNewCoupon);
router.get("/all", getAllCoupons);
router.get("/coupon/getCouponById/:id", getCouponById)
router.post("/claim", authMiddleware,claimCoupon);
router.delete("/admin/delete/:id", deleteCoupon);
router.put("/admin/toggleStatus/:id", updateCouponStatus);
router.put("/admin/update/:id", updateCoupon);

export default router;