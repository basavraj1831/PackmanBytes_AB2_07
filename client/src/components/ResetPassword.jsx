import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import mail_icon from "../assets/mail_icon.svg";
import lock_icon from "../assets/lock_icon.svg";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState(0);
  const [isOtpSubmited, setIsOtpSubmited] = useState(false);
  const [error, setError] = useState("");

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

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3000/api/auth/send-reset-otp`,
        {
          method: "post",
          headers: { "Content-type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();

      if (data.success) {
        setIsEmailSent(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
        toast.error(error.message);
    }
  };

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((e) => e.value);
    setOtp(otpArray.join(""));
    setIsOtpSubmited(true);
  };

  const onSubmitNewPassword = async (e) => {
    // e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3000/api/auth/reset-password`,
        {
          method: "post",
          headers: { "Content-type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, otp, newPassword }),
        }
      );
      const data = await response.json();
      if (data.success) {
        localStorage.removeItem("resetPasswordVerificationRequired");
        toast.success(data.message);
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);}
  };

  useEffect(() => {
    const verificationRequired = localStorage.getItem(
      "resetPasswordVerificationRequired"
    );

    if (!verificationRequired) {
      navigate('/');
    }
    const handleUnload = () => {
      localStorage.removeItem("resetPasswordVerificationRequired");
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      
      {!isEmailSent && (
        <form
          className="bg-red-300 p-8 rounded-lg shadow-lg w-96 text-sm"
          onSubmit={onSubmitEmail}
        >
          <h1 className="text-black text-2xl font-semibold text-center mb-4">
            Reset Password
          </h1>
          <p className="text-center mb-6 text-gray-700">
            Enter your registered email address.
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#c20e2f]">
            <img src={mail_icon} alt="" className="w-3 h-3" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="bg-transparent outline-none text-indigo-300"
              type="email"
              placeholder="Email id"
              required
            />
          </div>
          <button className="w-full py-2.5 bg-gradient-to-r from-red-500 to-red-900 rounded-full mt-3 text-white">
            Submit
          </button>
        </form>
      )}
      {!isOtpSubmited && isEmailSent && (
        <form
          className="bg-red-300 p-8 rounded-lg shadow-lg w-96 text-sm"
          onSubmit={onSubmitOtp}
        >
          <h1 className="text-black text-2xl font-semibold text-center mb-4">
            Reset Password OTP
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
          <button className="w-full py-2.5 bg-gradient-to-r from-red-500 to-red-900 rounded-full text-white">
            Submit
          </button>
        </form>
      )}
      {isEmailSent && isOtpSubmited && (
        <form
          className="bg-red-300 p-8 rounded-lg shadow-lg w-96 text-sm"
          onSubmit={(e) => {
            e.preventDefault();
            if (newPassword.length < 8) {
              setError("Password must be at least 8 characters long.");
              return;
            }
            onSubmitNewPassword();
          }}
        >
          <h1 className="text-black text-2xl font-semibold text-center mb-4">
            New Password
          </h1>
          <p className="text-center mb-6 text-gray-700">
            Enter the new password below.
          </p>
          <div className="mb-2 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#c20e2f]">
            <img src={lock_icon} alt="" className="w-3 h-3" />
            <input
              onChange={(e) => {
                setNewPassword(e.target.value);
                setError(""); // Clear error when user types
              }}
              value={newPassword}
              className="bg-transparent outline-none text-indigo-300"
              type="password"
              placeholder="Password"
              required
            />
          </div>
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}{" "}
          {/* Error Message */}
          <button className="w-full py-2.5 bg-gradient-to-r from-red-500 to-red-900 rounded-full mt-3 text-white">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
