import validator from "validator";
import bcrypt from "bcrypt";
import crypto from 'crypto';
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import { sendEMail } from "../config/email.js";
import {sendEMailForResetPass} from "../config/email.js"
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

//new  route for user register added by furman ali
// controllers/userController.js (registerUser)
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const exist = await userModel.findOne({ email });

    // 🧠 Case 1: User exists but not verified — resend OTP
    if (exist && !exist.isVerified) {
      const otp = Math.floor(1000 + Math.random() * 9000);
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

      exist.otp = otp;
      exist.otpExpiry = otpExpiry;
      await exist.save();

      // Resend verification email
      sendEMail({
        to: exist.email,
        name: exist.name,
        otp,
        subject: "Email Verification (Resent)",
        html: `<p>Your new verification code is <strong>${otp}</strong>. It will expire in 10 minutes.</p>`
      });

      return res.json({
        success: true,
        message: "Account exists but not verified. New OTP sent to your email.",
        email: exist.email
      });
    }

    // 🧠 Case 2: User exists and already verified
    if (exist && exist.isVerified) {
      return res.json({ success: false, message: "user already exist please login" });
    }

    // 🧠 Case 3: New user
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "enter valid email" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "enter strong password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = Math.floor(1000 + Math.random() * 9000);
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
      role,
      otp,
      otpExpiry,
      isVerified: false
    });

    // Send email
    sendEMail({
      to: newUser.email,
      name: newUser.name,
      otp,
      subject: "Email Verification",
      html: `<p>Your verification code is <strong>${otp}</strong>. It will expire in 10 minutes.</p>`
    });

    return res.json({
      success: true,
      message: "OTP sent to your email. Verify to complete registration.",
      email: newUser.email
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};


// Verify OTP
// controllers/userController.js (verifyOtp)
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.json({ success: false, message: "Email and OTP required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // if (user.isVerified) {
    //   return res.json({ success: true, message: "User already verified" });
    // }

    // if (!user.otp || !user.otpExpiry) {
    //   return res.json({ success: false, message: "No OTP found. Please request a new OTP." });
    // }

    if (new Date() > new Date(user.otpExpiry)) {
      return res.json({ success: false, message: "OTP expired. Please request a new OTP." });
    }

    if (Number(otp) !== Number(user.otp)) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    // OTP correct -> verify user
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // create token and return it
    // const token = createToken(user._id);
    return res.json({ success: true, message: "Verified"});
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Resend otp 
// controllers/userController.js (resendOtp)
const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.json({ success: false, message: "Email required" });

    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: "User not found" });

    // if (user.isVerified) return res.json({ success: false, message: "User already verified" });

    const otp = Math.floor(1000 + Math.random() * 9000);
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    sendEMail({
      to: user.email,
      name: user.name,
      otp,
      subject: "Resent: Email Verification",
      html: `<p>Your new verification code is <strong>${otp}</strong>. It will expire in 10 minutes.</p>`
    });

    return res.json({ success: true, message: "OTP resent" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

//Route for user login
// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await userModel.findOne({ email });
//     if (!user) {
//       return res.json({ success: false, message: "user does not exist" });
//     }
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (isMatch) {
//       const token = createToken(user._id);
//       res.json({ success: true, token });
//     } else {
//       res.json({ success: false, message: "invalid crediential" });
//     }
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };
// this blow login user created by furman ali

// Route for user login

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "user does not exist ! Create Account First" });
    }

    // 🚨 Check if email is verified
    // if (!user.isVerified) {
    //   return res.json({
    //     success: false,
    //     message: "Email not verified. Please verify your email first."
    //   });
    // }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = createToken(user._id);

      // ✅ added user info here
      res.json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } else {
      res.json({ success: false, message: "invalid crediential" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


// Route for user register
// const registerUser = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // checking user already exist or not
//     const exist = await userModel.findOne({ email });
//     if (exist) {
//       return res.json({ success: false, message: "user already exist" });
//     }

//     // validating email
//     if (!validator.isEmail(email)) {
//       return res.json({ success: false, message: "enter valid email" });
//     }
//     if (password.length < 8) {
//       return res.json({ success: false, message: "enter strong password" });
//     }

//     // hashing user password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const newUser = new userModel({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     const user = await newUser.save();
//     const token = createToken(user._id);

//     // ✅ added user info here
//     res.json({
//       success: true,
//       token,
//       user: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//       },
//     });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };


// Route for admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "invalid crediential" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};



// forget and reset password can be added here by furman ali
// POST /api/user/forgot-password

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.json({ success: false, message: "Email is required" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found. Please create an account." });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash and store in DB
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpiry = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    // Frontend URL (no email in URL for better security)
    const frontendBase = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${frontendBase}/reset-password/${resetToken}`;

    // Send reset email
    await sendEMailForResetPass({
      to: user.email,
      name: user.name || "User",
      subject: "Password Reset Request",
      html: `
        <p>Hello ${user.name || "User"},</p>
        <p>You requested a password reset. Click below to set a new password. This link expires in 1 hour.</p>
        <a href="${resetUrl}" 
           style="display:inline-block; padding:10px 15px; background:#4F46E5; color:#fff; border-radius:6px; text-decoration:none;">Reset Password</a>
        <p>If you didn’t request this, you can safely ignore this email.</p>
      `,
    });

    return res.json({
      success: true,
      message: "Reset link sent to your email. Please check your inbox.",
    });
  } catch (error) {
    console.error("forgotPassword error:", error);
    return res.json({ success: false, message: error.message });
  }
};




// POST /api/user/reset-password

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token) {
      return res.json({ success: false, message: "Token missing in request" });
    }

    if (!password || password.length < 6) {
      return res.json({ success: false, message: "Password must be at least 6 characters" });
    }

    // Hash the token to compare with stored hashed value
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with valid (non-expired) token
    const user = await userModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.json({ success: false, message: "Invalid or expired token" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;

    await user.save();

    return res.json({
      success: true,
      message: "Password has been reset successfully. Please login now.",
    });
  } catch (error) {
    console.error("resetPassword error:", error);
    return res.json({ success: false, message: error.message });
  }
};







export { loginUser, registerUser,verifyOtp, resendOtp,forgotPassword, resetPassword,  adminLogin };




