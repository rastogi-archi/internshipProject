import mongoose from "mongoose";

const claimedBySchema = new mongoose.Schema({
    ip: { type: String, default: null },
    session: { type: String, default: null },
    claimedAt: { type: Date, default: null }
}, { _id: false }); 

const couponSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return this.endDate ? value < this.endDate : true;
            },
            message: "Start date must be before the end date.",
        },
    },
    endDate: {
        type: Date,
        required: true
    },
    couponCode: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
    isClaimed: {
        type: Boolean,
        default: false,
    },
    claimedBy: claimedBySchema,
    lastClaimedAt: {
        type: Date, 
        default: null 
    }
}, { timestamps: true })

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;