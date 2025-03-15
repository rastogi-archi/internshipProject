import { configureStore } from '@reduxjs/toolkit'
import AuthReducer from "../redux/authSlice.js"
import CouponReducer from "../redux/couponSlice.js"

export const store = configureStore({
    reducer: {
        auth : AuthReducer,
        coupon : CouponReducer
    },
})