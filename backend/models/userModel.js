import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    cartData: { type: Object, default: {} },

    otp: { type: Number },
    otpExpiry: { type: Date },
    role: { type: String, default: "user" },
    isVerified: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordExpiry: Date
  
  },
  { minimize: false },
  { timestamps: true }
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;
