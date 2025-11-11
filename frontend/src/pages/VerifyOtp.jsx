// VerifyOtp.jsx
import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";

const VerifyOtp = () => {
  const { backendUrl, settoken, navigate } = useContext(ShopContext);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const pendingEmail = localStorage.getItem("pendingEmail");
    if (!pendingEmail) {
      // If no pending email, send user back to signup
      navigate("/signup");
    } else {
      setEmail(pendingEmail);
    }
  }, []);

  const submitOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${backendUrl}/api/user/verify-otp`, {
        email,
        otp
      });

      if (res.data.success) {
        // Save token and navigate home
        // settoken(res.data.token);
        // localStorage.setItem("token", res.data.token);
        localStorage.removeItem("pendingEmail");
        toast.success("Email verified! Please Login.");
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong");
    }
  };

  const resend = async () => {
    try {
      const res = await axios.post(`${backendUrl}/api/user/resend-otp`, { email });
      if (res.data.success) {
        toast.success("OTP resent. Check your email.");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={submitOtp} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Verify your email</h2>
        <p className="text-sm text-gray-600 mb-6">Enter the 4-digit code sent to <strong>{email}</strong></p>

        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          type="text"
          maxLength={6}
          className="w-full px-4 py-3 border rounded-md mb-4"
          placeholder="Enter OTP"
          required
        />

        <div className="flex gap-3">
          <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded-md">Verify</button>
          <button type="button" onClick={resend} className="flex-1 border border-gray-300 py-2 rounded-md">Resend OTP</button>
        </div>
      </form>
    </div>
  );
};

export default VerifyOtp;
