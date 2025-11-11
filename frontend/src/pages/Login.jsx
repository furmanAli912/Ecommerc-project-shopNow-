// import React, { useContext, useEffect, useState } from "react";
// import { ShopContext } from "../context/ShopContext";
// import axios from "axios";
// import { toast } from "react-toastify";

// const Login = () => {
//   const [currentState, setcurrentState] = useState("Login");
//   const { token, settoken, navigate, backendUrl } = useContext(ShopContext);
//   const [name, setname] = useState("");
//   const [password, setpassword] = useState("");
//   const [email, setemail] = useState("");
//   const [showPassword, setShowPassword] = useState(false); // 👈 added state

//   const onSubmitHandler = async (e) => {
//     e.preventDefault();
//     try {
//       if (currentState === "Sign Up") {
//         const response = await axios.post(backendUrl + "/api/user/register", {
//           name,
//           email,
//           password,
//         });
//         if (response.data.success) {
//           settoken(response.data.token);
//           localStorage.setItem("token", response.data.token);
//         } else {
//           toast.error(response.data.message);
//         }
//       } else {
//         const response = await axios.post(backendUrl + "/api/user/login", {
//           email,
//           password,
//         });
//         if (response.data.success) {
//           settoken(response.data.token);
//           localStorage.setItem("token", response.data.token);
//         } else {
//           toast.error(response.data.message);
//         }
//       }
//     } catch (error) {
//       console.log(error.message);
//       toast.error(error.message);
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       navigate("/");
//     }
//   }, [token]);

//   return (
//     <form
//       onSubmit={onSubmitHandler}
//       className="flex flex-col items-center w-[50%] sm:max-96 m-auto mt-14 gap-4 text-gray-800"
//     >
//       <div className="inline-flex items-center gap-2 mb-2 mt-10">
//         <p className="prata-regular text-3xl">{currentState}</p>
//         <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
//       </div>

//       {currentState === "Login" ? (
//         ""
//       ) : (
//         <input
//           onChange={(e) => setname(e.target.value)}
//           value={name}
//           type="text"
//           className="w-full px-3 py-2 border border-gray-800"
//           placeholder="Name"
//           required
//         />
//       )}

//       <input
//         onChange={(e) => setemail(e.target.value)}
//         value={email}
//         type="email"
//         className="w-full px-3 py-2 border border-gray-800"
//         placeholder="Email"
//         required
//       />

//       {/* Password field with toggle */}
//       <div className="w-full relative">
//         <input
//           onChange={(e) => setpassword(e.target.value)}
//           value={password}
//           type={showPassword ? "text" : "password"} // 👈 toggles visibility
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
//         <p className="cursor-pointer">Forgot your password</p>
//         {currentState === "Login" ? (
//           <p
//             onClick={() => setcurrentState("Sign Up")}
//             className="cursor-pointer"
//           >
//             Create Account
//           </p>
//         ) : (
//           <p
//             onClick={() => setcurrentState("Login")}
//             className="cursor-pointer"
//           >
//             Login here
//           </p>
//         )}
//       </div>

//       <button className="bg-black text-white font-light px-8 py-2 mt-4">
//         {currentState === "Login" ? "Sign In" : "Sign Up"}
//       </button>
//     </form>
//   );
// };

// export default Login;

// from here blow code i edit t for sign in
import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import ForgotPassword from "./ForgetPassword";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const { token, settoken, navigate, backendUrl } = useContext(ShopContext);
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/api/user/login`, {
        email,
        password,
      });

      if (response.data.success) {
        settoken(response.data.token);
        localStorage.setItem("token", response.data.token);
        toast.success("Login successful!");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) navigate("/");
  }, [token]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200">
      <form
        onSubmit={onSubmitHandler}
        className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-8 flex flex-col gap-5"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Welcome Back 👋
        </h2>
        <p className="text-center text-gray-500 mb-4">
          Please sign in to continue
        </p>

        <input
          onChange={(e) => setemail(e.target.value)}
          value={email}
          type="email"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none transition"
          placeholder="Enter your email"
          required
        />

        <div className="relative w-full">
          <input
            onChange={(e) => setpassword(e.target.value)}
            value={password}
            type={showPassword ? "text" : "password"}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none transition pr-10"
            placeholder="Enter your password"
            required
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-3 text-sm text-indigo-600 cursor-pointer select-none"
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        <div className="flex justify-between text-sm text-gray-600">
          <p onClick={() => navigate("/forgot-password")}
          className="cursor-pointer hover:text-indigo-500 transition">
            Forgot password?
          </p>
          <p
            onClick={() => navigate("/signup")}
            className="cursor-pointer text-indigo-600 font-medium hover:underline"
          >
            Create Account
          </p>
        </div>

        <button
          type="submit"
          className="mt-3 bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition shadow-md"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default Login;


 