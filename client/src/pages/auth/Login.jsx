import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { loginAdmin } from "../../redux/authSlice"
import toast from "react-hot-toast"


const initialState = {
  email: "",
  password: ""
}
const Login = () => {
  const { isLoading } = useSelector(state => state.auth);

  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await dispatch(loginAdmin(formData)).unwrap();
    try {
      if (data?.success) {
        toast.success(data?.message);
        navigate("/");
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  }

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/admin");
  }

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGuestAccess = () => {
    navigate("/")
  }
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-lg w-96">
        <h2 className="text-2xl font-bold text-center">Admin Login</h2>
        <p className="mb-2 text-sm flex gap-1 justify-center">Don't have an account? <Link className="text-blue-500 hover:underline" to="/register">register</Link></p>

        {/* Admin Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 cursor-pointer"
            disabled={isLoading}
            onClick={handleLogin}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center my-4 text-gray-500">OR</div>

        {/* Guest Access Button */}
        <button
          type="button"
          onClick={handleGuestAccess}
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 cursor-pointer"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Continue as Guest"}
        </button>
      </div>
    </div>
  );
};

export default Login;
