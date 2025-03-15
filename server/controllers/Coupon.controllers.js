
import Coupon from "../models/Coupon.models.js"; // Ensure you have a Coupon model
import { generateSessionID, getClientIP } from "../utils/ip.js"; // Helper function to get user IP
import { setCookie, getCookie } from "../utils/cookie.js"; // Helper functions for cookie handling

export const addNewCoupon = async (req, res) => {
    const { name, couponCode, startDate, endDate, status } = req.body;

    try {
        // Validate required fields
        if (!name || !couponCode || !startDate || !endDate || !status) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        if (new Date(startDate) >= new Date(endDate)) {
            return res.status(400).json({
                success: false,
                message: "Start date must be before the end date",
            });
        }

        // Check if the coupon code already exists to prevent duplication
        const existingCoupon = await Coupon.findOne({ couponCode });
        if (existingCoupon) {
            return res.status(400).json({
                success: false,
                message: "Coupon code already exists",
            });
        }

        // Create a new coupon in the database
        const newCoupon = new Coupon({
            name,
            couponCode,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            status,
            isClaimed: false,
            claimedBy: null,
        });

        await newCoupon.save();

        return res.status(201).json({
            success: true,
            message: "Coupon added successfully",
            coupon: newCoupon,
        });
    } catch (error) {
        console.error("Error adding coupon:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


export const deleteCoupon = async (req, res) => {
    const { id } = req.params; // Get coupon id from request parameters

    try {
        // Check if the coupon exists
        const coupon = await Coupon.findById(id);

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found.",
            });
        }

        // Delete the coupon
        await Coupon.findByIdAndDelete(id);

        console.log(id)

        return res.status(200).json({
            success: true,
            message: "Coupon deleted successfully.",
            id
        });
    } catch (error) {
        console.error("Error deleting coupon:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
};

export const updateCouponStatus = async (req, res) => {
    const { id } = req.params; // Get coupon ID from request parameters
    const { status } = req.body;

    try {
        // Find and update the coupon
        const updatedCoupon = await Coupon.findByIdAndUpdate(
            id,
            { status }, // Update only the status field
            { new: true }
        );

        if (!updatedCoupon) {
            return res.status(404).json({ success: false, message: "Coupon not found." });
        }

        return res.status(200).json({
            success: true,
            message: "Coupon status updated successfully.",
            coupon: updatedCoupon,
        });
    } catch (error) {
        console.error("Error updating coupon:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};

export const claimCoupon = async (req, res) => {
    try {
        const userIP = req.ip; // Get user IP
        const sessionID = req.cookies?.sessionID || req.headers["user-agent"]; // Identify user

        const cooldownPeriod = 10 * 60 * 1000; // 10 minutes cooldown
        const lastClaim = await Coupon.findOne({
            "claimedBy.ip": userIP,
            "claimedBy.session": sessionID,
            lastClaimedAt: { $gte: new Date(Date.now() - cooldownPeriod) },
        });

        if (lastClaim) {
            return res.status(403).json({
                success: false,
                message: "You have already claimed a coupon. Try again later.",
            });
        }

        // Fetch the oldest unclaimed coupon (round-robin)
        const coupon = await Coupon.findOne({ isClaimed: false, status: "active" }).sort({ createdAt: 1 });

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "No available coupons at the moment.",
            });
        }

        // Mark the coupon as claimed
        coupon.isClaimed = true;
        coupon.claimedBy = { ip: userIP, session: sessionID, claimedAt: new Date() };
        coupon.lastClaimedAt = new Date();
        await coupon.save();

        res.status(200).json({
            success: true,
            message: "Coupon claimed successfully!",
            coupon: {
                name: coupon.name,
                couponCode: coupon.couponCode,
                expiry: coupon.endDate,
            },
        });
    } catch (error) {
        console.error("Error claiming coupon:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
}



export const getAllCoupons = async (req, res) => {
    try {
        // Extract filters from request query parameters
        const { status, isClaimed } = req.query;

        const filters = {};
        if (status) filters.status = status; // Filter by coupon status
        if (isClaimed !== undefined) filters.isClaimed = isClaimed === "true"; // Convert string to boolean

        // Fetch coupons from database with filters
        const coupons = await Coupon.find(filters).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: coupons.length,
            coupons,
        });
    } catch (error) {
        console.error("Error fetching coupons:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


export const updateCoupon = async (req, res) => {
    const { id } = req.params;
    const { name, startDate, endDate, couponCode, status, isClaimed, claimedBy } = req.body;

    try {
        const updatedCoupon = await Coupon.findByIdAndUpdate(
            id,
            { name, startDate, endDate, couponCode, status, isClaimed, claimedBy },
            { new: true, runValidators: true }
        );

        if (!updatedCoupon) {
            return res.status(404).json({ success: false, message: "Coupon not found" });
        }

        res.json({ success: true, message: "Coupon updated successfully", coupon: updatedCoupon });
    } catch (error) {
        console.error("Error updating coupon:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


export const getCouponById = async(req,res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        if (!coupon) {
          return res.status(404).json({ message: "Coupon not found" });
        }
        res.json(coupon);
      } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
      }
}