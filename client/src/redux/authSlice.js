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
    async (formData) => {
        try {
            const response = await axios.post(
                "https://internship-project-backend-ak09.onrender.com/api/auth/login",
                formData,
                {
                    withCredentials: true
                }
            )
            return response.data;
        } catch (error) {
            return (error.response?.data);
        }
    }
)

export const logoutAdmin = createAsyncThunk(
    "/auth/logout",
    async () => {
        const response = await axios.post(
            "https://internship-project-backend-ak09.onrender.com/api/auth/logout",
            {},
            {
                withCredentials: true
            }
        )
        return response.data.message;
    }
)

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
                state.user = action.payload.success ? action.payload.user : null;
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
