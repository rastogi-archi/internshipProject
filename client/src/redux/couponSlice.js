import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from "axios"


const initialState = {
    coupons: [],
    isLoading: false
}

export const addNewCoupon = createAsyncThunk(
    "/admin/coupon/add",
    async (formData) => {
        try {
            const response = await axios.post(
                "https://internship-project-backend-ak09.onrender.com/api/coupon/admin/add",
                formData,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            return response.data;
        } catch (error) {
            return (error.response?.data);
        }
    }
)



export const getAllCoupons = createAsyncThunk(
    "/coupon/all",
    async () => {
        try {
            const response = await axios.get(
                "https://internship-project-backend-ak09.onrender.com/api/coupon/all",
            )
            return response.data;
        } catch (error) {
            return (error.response?.data);
        }
    }
)


export const claimCoupon = createAsyncThunk(
    "coupon/claim",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.post("https://internship-project-backend-ak09.onrender.com/api/coupon/claim");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);


export const deleteCoupon = createAsyncThunk(
    "/admin/coupon/delete",
    async (id) => {
        try {
            const response = await axios.delete(
                `https://internship-project-backend-ak09.onrender.com/api/coupon/admin/delete/${id}`,
            )
            return id;
        } catch (error) {
            return (error.response?.data);
        }
    }
)


export const updateCouponStatus = createAsyncThunk(
    "/admin/coupon/toggleStatus",
    async ({ id, data }) => {
        try {
            const response = await axios.put(
                `https://internship-project-backend-ak09.onrender.com/api/coupon/admin/toggleStatus/${id}`,
                data
            )
            return response.data;
        } catch (error) {
            return (error.response?.data);
        }
    }
)

export const getCouponById = createAsyncThunk("/coupon/getCouponById", async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`https://internship-project-backend-ak09.onrender.com/api/coupon/getCouponById/${id}`);
      return response.data; // Return the coupon data
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch coupon");
    }
  });


export const updateCoupon = async (id, updatedData) => {
    try {
      const response = await axios.put(`https://internship-project-backend-ak09.onrender.com/api/coupon/admin/update/${id}`, updatedData);
      console.log("Updated Coupon:", response.data);
    } catch (error) {
      console.error("Error updating coupon:", error.response?.data || error.message);
    }
  };

export const CouponSlice = createSlice({
    name: 'coupon',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(addNewCoupon.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addNewCoupon.fulfilled, (state, action) => {
                state.isLoading = false;
                state.coupons.push(action.payload.coupon);
            })
            .addCase(addNewCoupon.rejected, (state, action) => {
                state.isLoading = false;
            })

            .addCase(getAllCoupons.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllCoupons.fulfilled, (state, action) => {
                state.isLoading = false;
                state.coupons = action.payload.coupons;
            })
            .addCase(getAllCoupons.rejected, (state, action) => {
                state.isLoading = false;
            })

            .addCase(claimCoupon.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(claimCoupon.fulfilled, (state, action) => {
                state.isLoading = false;
                state.coupons = state.coupons.map((coupon) =>
                    coupon.couponCode === action.payload.coupon.couponCode
                        ? { ...coupon, isClaimed: true }
                        : coupon
                );
            })
            .addCase(claimCoupon.rejected, (state, action) => {
                state.isLoading = false;
            })
            .addCase(getCouponById.pending, (state) => {
                state.isLoading = true;
              })
              .addCase(getCouponById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.coupons = action.payload;
              })
              .addCase(getCouponById.rejected, (state, action) => {
                state.isLoading = false;
              })
            .addCase(deleteCoupon.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteCoupon.fulfilled, (state, action) => {
                state.isLoading = false;
                state.coupons = state.coupons.filter(coupon => coupon._id !== action.payload);
            })
            .addCase(deleteCoupon.rejected, (state, action) => {
                state.isLoading = false;
            })

            .addCase(updateCouponStatus.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateCouponStatus.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.coupons.findIndex(coupon => coupon._id === action.payload.coupon._id);
                if (index !== -1) {
                    state.coupons[index] = action.payload.coupon;
                }
            })
            .addCase(updateCouponStatus.rejected, (state, action) => {
                state.isLoading = false;
            });
    }
})

export default CouponSlice.reducer
