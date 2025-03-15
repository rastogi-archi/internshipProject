import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"
import toast from "react-hot-toast"
import { deleteCoupon, getAllCoupons, updateCouponStatus } from "../../redux/couponSlice";

const AdminHome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { coupons, isLoading } = useSelector((state) => state.coupon);

  // Fetch coupons from backend
  useEffect(() => {
    dispatch(getAllCoupons())
  }, [dispatch]);

  // Toggle Coupon Availability (Active/Inactive)
  const toggleCouponStatus = async (id, status) => {
    dispatch(updateCouponStatus({ id, data: { status: status === "active" ? "inactive" : "active" } }))
      .unwrap()
      .then(() => toast.success("Coupon status updated!"))
      .catch(() => toast.error("Error updating status."));
  };

  // update coupon
  const handleUpdateCoupon = (id) => {
    navigate(`/admin/update/${id}`);
  }

  // Delete Coupon
  const handleDeleteCoupon = async (id) => {
    dispatch(deleteCoupon(id))
      .unwrap()
      .then(() => toast.success("Coupon deleted successfully."))
      .catch(() => toast.error("Failed to delete."));
  };

  return (
    <>
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 mt-20">Admin Dashboard</h1>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => navigate("/admin/add")}
        >
        Add New Coupon
      </button>

      {isLoading ? (
        <p>Loading coupons...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Code</th>
                <th className="p-2 border">Start Date</th>
                <th className="p-2 border">End Date</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Actions</th>
                <th className="p-2 border">Claimed By</th>
              </tr>
            </thead>
            <tbody>
              {coupons.length > 0 ? (
                coupons.map((coupon) => (
                    <tr key={coupon._id} className="text-center">
                    <td className="p-2 border">{coupon.name}</td>
                    <td className="p-2 border">{coupon.couponCode}</td>
                    <td className="p-2 border">{new Date(coupon.startDate).toLocaleDateString()}</td>
                    <td className="p-2 border">{new Date(coupon.endDate).toLocaleDateString()}</td>
                    <td className="p-2 border">
                    <span
                        className={`px-2 py-1 rounded ${
                          coupon.status === "active"
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {coupon.status}
                      </span>
                    </td>
                    <td className="p-2 border space-x-2">
                      <button
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                        onClick={() => toggleCouponStatus(coupon._id, coupon.status)}
                        >
                        Toggle
                      </button>
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                        onClick={() => handleUpdateCoupon(coupon._id)}
                        >
                        Update
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded"
                        onClick={() => handleDeleteCoupon(coupon._id)}
                        >
                        Delete
                      </button>
                    </td>
                    <td className="p-2 border space-x-0">
                      {coupon.claimedBy?.ip || coupon.claimedBy?.session || "Not Claimed"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-2 text-center">
                    No coupons available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
      </>
  );
};

export default AdminHome;
