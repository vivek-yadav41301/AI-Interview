import React from "react";
import { RiRobot2Fill } from "react-icons/ri";
import { HiSparkles } from "react-icons/hi2";
import { motion } from "motion/react";
import { FcGoogle } from "react-icons/fc";
import { auth, provider } from "../utils/firebase";
import { signInWithPopup } from "firebase/auth";
import axios from 'axios'
import { useDispatch } from "react-redux";
import { setUserData } from "../reduxe/userSlice";
function Auth({isModel=false}) {
  const dispatch=useDispatch()
   const handleGoogleAuth =async ()=>{
    try
    {
     const response=await signInWithPopup(auth,provider)
     console.log(response)
     const User=response.user;
     let name=User.displayName
     let email=User.email
     const result=await axios.post(import.meta.env.VITE_SERVER_URL+"/api/auth/google",
      {
        name,email
      },
      {
        withCredentials:true
      }
     )
    dispatch(setUserData(result.data))
      

    }catch(err){
      console.log(err)
          dispatch(setUserData(null))
      
    }
   }
  return (
    <div className={`w-full ${isModel?"py-4":"min-h-screen rounded-xl bg-orange-50 flex items-center justify-center py-20 px-6"}`}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.05 }}
        className={`w-full ${isModel?"max-w-md p-8 rounded-3xl":"max-w-lg p-12 rounded-[32px]"}   bg-white shadow-2xl border border-gray-200`}
      >
        {/* Logo */} 
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="border-4 text-red-600 border-red-400 p-2 rounded-lg">
            <RiRobot2Fill size={14} />
          </div>
          <h1 className="font-semibold text-lg">InterviewIQ</h1>
        </div>

        {/* Heading */}
        <h1 className="text-2xl md:text-3xl font-semibold text-center leading-snug mb-4">
          Continue with{" "}
          <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full inline-flex items-center gap-2">
            <HiSparkles />
            AI Smart Interview
          </span>
        </h1>

        {/* Description */}
        <p className="text-gray-500 text-center text-sm md:text-base leading-relaxed mb-8">
          Sign in to start AI-powered mock interviews, track your progress, and
          unlock detailed performance insights.
        </p>

        {/* ======================================================
            JWT AUTHENTICATION (COMING SOON)
            Uncomment this section when implementing JWT Login
        ======================================================= */}

        {/*
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 outline-none focus:border-black"
        />

        <input
          type="password"
          placeholder="Enter your password"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-5 outline-none focus:border-black"
        />

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full bg-black text-white py-3 rounded-full font-medium"
        >
          Login
        </motion.button>

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-4 text-gray-500 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>
        */}

        {/* Google Authentication */}
        <motion.button onClick={handleGoogleAuth}
          whileHover={{ opacity: 0.9, scale: 1.03 }}
          whileTap={{ opacity: 1, scale: 0.98 }}
          className="w-full flex items-center justify-center py-3 gap-3 bg-black text-white rounded-full shadow-xl"
        >
          <FcGoogle size={20} />
          Continue with Google
        </motion.button>
      </motion.div>
    </div>
  );
}

export default Auth;