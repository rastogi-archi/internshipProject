import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminHome from "./pages/admin/AdminHome";
import AddNewCoupon from "./pages/coupon/AddNewCoupon";
import UserHome from "./pages/user/UserHome";
import Navbar from "./components/Navbar";
import EditCoupon from "./pages/coupon/EditCoupon";
import CheckAuth from "./components/CheckAuth"

function App() {
  const location = useLocation();

  return (
    <>
      {/* Conditionally render Navbar */}
      {location.pathname !== "/login" && location.pathname !== "/register" && <Navbar />}

      <Routes>
        <Route path="/" element={
          <CheckAuth>
            <UserHome />
          </CheckAuth>
        } />
        <Route path="/login" element={
          <CheckAuth>
            <Login />
          </CheckAuth>
        } />
        <Route path="/register" element={
          <CheckAuth>
            <Register />
          </CheckAuth>
        } />
        <Route path="/admin" element={
          <CheckAuth>
            <AdminHome />
          </CheckAuth>
        } />
        <Route path="/admin/add" element={
          <CheckAuth>
            <AddNewCoupon />
          </CheckAuth>
        } />
        <Route path="/admin/update/:id" element={
          <CheckAuth>
            <EditCoupon />
          </CheckAuth>
        } />
      </Routes>

      <Toaster />
    </>
  );
}

export default App;
