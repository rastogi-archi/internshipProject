import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { getCouponById, updateCoupon } from "../../redux/couponSlice";

const EditCoupon = () => {
  const { id } = useParams(); // Get coupon ID from URL
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { coupon, isLoading } = useSelector((state) => state.coupon);

  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    couponCode: "",
    status: "",
  });

  // Fetch coupon when component mounts
  useEffect(() => {
    dispatch(getCouponById(id));
  }, [dispatch, id]);

  // Update form data when coupon is available
  useEffect(() => {
    if (coupon && coupon._id === id) {
      setFormData({
        name: coupon.name || "",
        startDate: coupon.startDate ? coupon.startDate.split("T")[0] : "",
        endDate: coupon.endDate ? coupon.endDate.split("T")[0] : "",
        couponCode: coupon.couponCode || "",
        status: coupon.status || "active",
      });
    }
  }, [coupon, id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateCoupon({ id, data: formData }))
      .unwrap()
      .then(() => {
        toast.success("Coupon updated successfully!");
        navigate("/admin"); // Redirect back to admin home
      })
      .catch(() => toast.error("Error updating coupon."));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-8 mt-20">
        <h1 className="text-3xl font-semibold text-gray-800 mb-2 text-center">Edit Coupon</h1>

        {isLoading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium">Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-300"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Start Date:</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-300"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">End Date:</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-300"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Coupon Code:</label>
              <input
                type="text"
                name="couponCode"
                value={formData.couponCode}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-300"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Status:</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-300"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Update Coupon
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditCoupon;
