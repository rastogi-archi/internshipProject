import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { logoutAdmin } from "../redux/authSlice";
import toast from "react-hot-toast";

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            const message = await dispatch(logoutAdmin()).unwrap(); 
            toast.success(message);
            navigate("/login");
        } catch (errorMessage) {
            toast.error(errorMessage);
        }
    };


    return (
        <>
            <nav className="bg-gray-700 text-white fixed w-full shadow-md z-50">
                <div className="container mx-auto flex justify-between items-center p-4">
                    {/* Logo */}
                    
                    <div className="text-2xl font-bold">
                        CouponHub
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="bg-blue-500 px-3 py-2 rounded-lg hover:bg-blue-600 transition flex gap-2 justify-center items-center"
                    >
                        <LogOut className="size-5" />
                        <p>Logout</p>
                    </button>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
