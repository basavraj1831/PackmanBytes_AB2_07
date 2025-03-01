import React, { useContext, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setUser } from "../redux/user/userSlice";

const EmailVerify = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const inputRefs = useRef([]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const otpArray = inputRefs.current.map((e) => e.value);
      const otp = otpArray.join("");

      const response = await fetch(
        `http://localhost:3000/api/auth/verify-email`,
        {
          method: "post",
          headers: { "Content-type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ otp }),
        }
      );

      const data = await response.json();
      if (data.success) {
        localStorage.removeItem("emailVerificationRequired");
        dispatch(setUser(data.user));
        navigate('/');
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
        toast.error(error.message);
    }
  };

  useEffect(() => {
    const verificationRequired = localStorage.getItem(
      "emailVerificationRequired"
    );

    if (!verificationRequired) {
      navigate('/');
    }
    const handleUnload = () => {
      localStorage.removeItem("emailVerificationRequired");
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      

      <form
        className="bg-red-300 p-8 rounded-lg shadow-lg w-96 text-sm"
        onSubmit={onSubmitHandler}
      >
        <h1 className="text-black text-2xl font-semibold text-center mb-4">
          Email Verify OTP
        </h1>
        <p className="text-center mb-6 text-gray-700">
          Enter the 6-digit code sent to your email id.
        </p>
        <div className="flex justify-between mb-8" onPaste={handlePaste}>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                type="text"
                maxLength="1"
                key={index}
                required
                className="w-12 h-12 bg-[#c20e2f] text-white text-center text-xl rounded-md"
                ref={(e) => (inputRefs.current[index] = e)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
        </div>
        <button className="w-full py-3 bg-gradient-to-r from-red-500 to-red-900 rounded-full text-white">
          Verify Email
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;
