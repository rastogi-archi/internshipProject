import { Route, Routes, useLocation } from "react-router-dom";
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
  const { isAuthenticated } = useSelector(state => state.auth);

  return (
    <>
      {/* Conditionally render Navbar */}
      {location.pathname !== "/login" && location.pathname !== "/register" && <Navbar />}


      <Routes>
        <Route path="/" element={
          <UserHome />
        } />
        <Route path="/admin" element={
          <AdminHome />
        } />
         {!isAuthenticated && (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </>
        )}
        <Route path="/admin/add" element={
          <AddNewCoupon />
        } />
        <Route path="/admin/update/:id" element={
          <EditCoupon />
        } />
      </Routes>

      <Toaster />
    </>
  );
}

export default App;
