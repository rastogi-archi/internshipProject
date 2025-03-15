import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from "axios"

const initialState = {
    isLoading: false,
    isAuthenticated: false,
    user: null
}

export const registerAdmin = createAsyncThunk(
    "/auth/register",
    async (formData) => {
        try {
            const response = await axios.post(
                "https://internship-project-backend-ak09.onrender.com/api/auth/register",
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


export const loginAdmin = createAsyncThunk(
    "/auth/login",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "https://internship-project-backend-ak09.onrender.com/api/auth/login",
                formData,
                { withCredentials: true }
            );

            if (response.data.success) {
                // Store authentication state
                localStorage.setItem("isAuthenticated", "true");
                localStorage.setItem("user", JSON.stringify(response.data.user));
                return response.data;
            } else {
                return rejectWithValue(response.data.message || "Login failed");
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Login request failed");
        }
    }
);


export const logoutAdmin = createAsyncThunk(
    "/auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            await axios.post(
                "https://internship-project-backend-ak09.onrender.com/api/auth/logout",
                {},
                { withCredentials: true }
            );

            localStorage.removeItem("isAuthenticated");
            localStorage.removeItem("user");

            return true;
        } catch (error) {
            return rejectWithValue("Logout failed");
        }
    }
);

export const AuthSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerAdmin.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(registerAdmin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(registerAdmin.rejected, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(loginAdmin.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loginAdmin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.isAuthenticated = action.payload.success;
            })
            .addCase(loginAdmin.rejected, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(logoutAdmin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            });
    }
})

export default AuthSlice.reducer
