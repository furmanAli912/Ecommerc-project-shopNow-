import express from "express";
import {
  loginUser,
  registerUser,
  verifyOtp,
   resendOtp,
   forgotPassword,
   resetPassword,
  adminLogin,
  
} from "../controller/UserController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);
userRouter.post('/verify-otp', verifyOtp);
userRouter.post('/resend-otp', resendOtp);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post("/reset-password/:token", resetPassword);


// userRouter.get("/:id", getUserById);
// userRouter.put("/:id", updateUser);


export default userRouter;
