import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { claimCoupon } from "../../redux/couponSlice";

const COOLDOWN_PERIOD =  10 * 60 * 1000; // 10 minutes

const UserHome = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.coupon);
  const [isCooldownActive, setIsCooldownActive] = useState(false);
  const [claimedCoupon, setClaimedCoupon] = useState(null);

  useEffect(() => {
    const lastClaimTime = localStorage.getItem("lastClaimTime");
    const savedCoupon = localStorage.getItem("claimedCoupon");

    if (lastClaimTime) {
      const elapsedTime = Date.now() - parseInt(lastClaimTime, 10);
      if (elapsedTime < COOLDOWN_PERIOD) {
        setIsCooldownActive(true);
        if (savedCoupon) {
          setClaimedCoupon(JSON.parse(savedCoupon));
        }

        // Schedule cooldown expiry
        setTimeout(() => {
          setIsCooldownActive(false);
          setClaimedCoupon(null);
          localStorage.removeItem("claimedCoupon"); // Remove coupon after cooldown expires
        }, COOLDOWN_PERIOD - elapsedTime);
      }
    }
  }, []);

  const handleClaimCoupon = async () => {
    if (isCooldownActive) {
      toast.error("Please wait before claiming another coupon.");
      return;
    }

    dispatch(claimCoupon())
      .unwrap()
      .then((res) => {
        toast.success(res.message || "Coupon claimed successfully!");
        setClaimedCoupon(res.coupon);
        localStorage.setItem("lastClaimTime", Date.now().toString());
        localStorage.setItem("claimedCoupon", JSON.stringify(res.coupon));
        setIsCooldownActive(true);

        // Schedule removal after cooldown ends
        setTimeout(() => {
          setIsCooldownActive(false);
          setClaimedCoupon(null);
          localStorage.removeItem("claimedCoupon");
        }, COOLDOWN_PERIOD);
      })
      .catch(() => toast.error("Error claiming coupon. Try again later."));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-10 w-full max-w-md text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Claim Your Coupon</h1>
        <p className="text-gray-600 mt-2">Get exclusive deals with a single click!</p>

        <button
          className={`mt-6 w-full px-6 py-3 text-white font-semibold rounded-lg transition-all ${
            isCooldownActive || isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
          }`}
          onClick={handleClaimCoupon}
          disabled={isCooldownActive || isLoading}
        >
          {isCooldownActive ? "Please Wait..." : isLoading ? "Processing..." : "Claim Coupon"}
        </button>

        {isCooldownActive && (
          <p className="text-red-500 text-sm mt-3" aria-live="polite">
            You need to wait before claiming another coupon.
          </p>
        )}

        {/* Show coupon details even if cooldown is active */}
        {claimedCoupon && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg text-gray-700 text-left">
            <h2 className="text-lg font-semibold">🎉 Coupon Details:</h2>
            <p><strong>Name:</strong> {claimedCoupon.name}</p>
            <p><strong>Code:</strong> <span className="text-green-600 font-bold">{claimedCoupon.couponCode}</span></p>
            <p><strong>Expiry Date:</strong> {new Date(claimedCoupon.expiry).toLocaleDateString()}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserHome;
