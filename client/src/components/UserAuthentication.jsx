import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

const UserAuthentication = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(!user?.isLoggedIn);

  if (!user || !user.isLoggedIn) {
    return (
      <div className="relative">
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-red-50 p-6 rounded-lg shadow-lg w-80 text-center">
              <p className="text-red-700 font-semibold">
                To access this section, please login first.
              </p>
              <button
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg"
                onClick={() => {setShowPopup(false); navigate('/')}}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return <Outlet />;
};

export default UserAuthentication;
