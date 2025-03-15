import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminHome from "./pages/admin/AdminHome";
import AddNewCoupon from "./pages/coupon/AddNewCoupon";
import UserHome from "./pages/user/UserHome";
import Navbar from "./components/Navbar";
import EditCoupon from "./pages/coupon/EditCoupon";
import { useSelector } from "react-redux";

function App() {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  // Helper function to check if the user is authenticated
  const isAuthenticated = user !== null;
  const isAdmin = user?.role === "admin";

  return (
    <>
      {/* Conditionally render Navbar */}
      {location.pathname !== "/login" && location.pathname !== "/register" && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />

        {/* Protected User Routes */}
        <Route path="/" element={isAuthenticated ? <UserHome /> : <Navigate to="/login" />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={isAuthenticated && isAdmin ? <AdminHome /> : <Navigate to="/login" />} />
        <Route path="/admin/add" element={isAuthenticated && isAdmin ? <AddNewCoupon /> : <Navigate to="/login" />} />
        <Route path="/admin/update/:id" element={isAuthenticated && isAdmin ? <EditCoupon /> : <Navigate to="/login" />} />
      </Routes>

      <Toaster />
    </>
  );
}

export default App;
