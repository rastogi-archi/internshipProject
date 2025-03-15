import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addNewCoupon } from "../../redux/couponSlice";
import toast from "react-hot-toast";

const AddNewCoupon = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector((state) => state.coupon.isLoading);

  const [formData, setFormData] = useState({
    name: "",
    couponCode: "",
    startDate: "",
    endDate: "",
    status: "active",
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Input validation
    if (!formData.name || !formData.couponCode || !formData.startDate || !formData.endDate) {
      toast.error("All fields are required.");
      return;
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      toast.error("Start date must be before the end date.");
      return;
    }

    try {
      const response = await dispatch(addNewCoupon(formData));

      if (response.payload && response.payload.success) {
        toast.success("Coupon added successfully!");
        navigate("/admin"); // Redirect back to dashboard
      } else {
        toast.error(response.payload?.message || "Error adding coupon.");
      }
    } catch (error) {
      toast.error("Error adding coupon.");
    }
  };

  return (
    <div className="mx-auto p-6">
      <div className="mt-20">
        <h1 className="text-3xl font-bold">Add New Coupon</h1>
        <button
          onClick={() => navigate("/admin")}
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Back to Dashboard
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-lg rounded-lg space-y-4 max-w-lg mx-auto">
        <div>
          <label className="block font-semibold">Coupon Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Coupon Code:</label>
          <input
            type="text"
            name="couponCode"
            value={formData.couponCode}
            onChange={handleChange}
            className="w-full p-2 border rounded uppercase"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Start Date:</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">End Date:</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Status:</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          disabled={isLoading}
        >
          {isLoading ? "Adding Coupon..." : "Add Coupon"}
        </button>
      </form>
    </div>
  );
};

export default AddNewCoupon;