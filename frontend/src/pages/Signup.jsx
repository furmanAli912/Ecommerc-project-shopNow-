// import React, { useContext, useEffect, useState } from "react";
// import { ShopContext } from "../context/ShopContext";
// import axios from "axios";
// import { toast } from "react-toastify";

// const Signup = () => {
//   const { token, settoken, navigate, backendUrl } = useContext(ShopContext);
//   const [name, setname] = useState("");
//   const [email, setemail] = useState("");
//   const [password, setpassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   const onSubmitHandler = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(`${backendUrl}/api/user/register`, {
//         name,
//         email,
//         password,
//       });

//       if (response.data.success) {
//         settoken(response.data.token);
//         localStorage.setItem("token", response.data.token);
//         toast.success("Account created successfully!");
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       console.log(error.message);
//       toast.error(error.message);
//     }
//   };

//   useEffect(() => {
//     if (token) navigate("/");
//   }, [token]);

//   return (
//     <form
//       onSubmit={onSubmitHandler}
//       className="flex flex-col items-center w-[50%] sm:max-96 m-auto mt-14 gap-4 text-gray-800"
//     >
//       <div className="inline-flex items-center gap-2 mb-2 mt-10">
//         <p className="prata-regular text-3xl">Sign Up</p>
//         <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
//       </div>

//       <input
//         onChange={(e) => setname(e.target.value)}
//         value={name}
//         type="text"
//         className="w-full px-3 py-2 border border-gray-800"
//         placeholder="Name"
//         required
//       />

//       <input
//         onChange={(e) => setemail(e.target.value)}
//         value={email}
//         type="email"
//         className="w-full px-3 py-2 border border-gray-800"
//         placeholder="Email"
//         required
//       />

//       <div className="w-full relative">
//         <input
//           onChange={(e) => setpassword(e.target.value)}
//           value={password}
//           type={showPassword ? "text" : "password"}
//           className="w-full px-3 py-2 border border-gray-800 pr-10"
//           placeholder="Password"
//           required
//         />
//         <span
//           onClick={() => setShowPassword(!showPassword)}
//           className="absolute right-3 top-2.5 text-sm text-gray-600 cursor-pointer select-none"
//         >
//           {showPassword ? "Hide" : "Show"}
//         </span>
//       </div>

//       <div className="w-full flex justify-between text-sm mt-[-8px]">
//         <p
//           onClick={() => navigate("/login")}
//           className="cursor-pointer text-blue-500"
//         >
//           Already have an account? Login
//         </p>
//       </div>

//       <button className="bg-black text-white font-light px-8 py-2 mt-4">
//         Sign Up
//       </button>
//     </form>
//   );
// };

// export default Signup;

import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const Signup = () => {
  const { token, settoken, navigate, backendUrl } = useContext(ShopContext);
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/api/user/register`, {
        name,
        email,
        password,
      });

      // if (response.data.success) {
      //   settoken(response.data.token);
      //   localStorage.setItem("token", response.data.token);
      //   toast.success("Account created successfully!");
      // } else {
      //   toast.error(response.data.message);
      // }
      // in place of above i edit blow code by furman ali
      // Signup.jsx (inside onSubmitHandler)
      if (response.data.success) {
        // don't set token yet; go to OTP page
        localStorage.setItem('pendingEmail', response.data.email || email);
        toast.success("OTP sent. Check your email.");
        navigate("/verify-otp");
      } else {
        toast.error(response.data.message);
      }


    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  // useEffect(() => {
  //   if (token) navigate("/");
  // }, [token]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 to-purple-200">
      <form
        onSubmit={onSubmitHandler}
        className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-8 flex flex-col gap-5"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Create Account 🌟
        </h2>
        <p className="text-center text-gray-500 mb-4">
          Join us and start your journey today
        </p>

        <input
          onChange={(e) => setname(e.target.value)}
          value={name}
          type="text"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 outline-none transition"
          placeholder=" Enter Your full name"
          required
        />

        <input
          onChange={(e) => setemail(e.target.value)}
          value={email}
          type="email"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 outline-none transition"
          placeholder="Email address"
          required
        />

        <div className="relative w-full">
          <input
            onChange={(e) => setpassword(e.target.value)}
            value={password}
            type={showPassword ? "text" : "password"}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 outline-none transition pr-10"
            placeholder="Create password"
            required
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-3 text-sm text-purple-600 cursor-pointer select-none"
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        <p
          onClick={() => navigate("/login")}
          className="text-sm text-purple-600 text-right cursor-pointer hover:underline"
        >
          Already have an account? Login
        </p>

        <button
          type="submit"
          className="mt-3 bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700 transition shadow-md"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
