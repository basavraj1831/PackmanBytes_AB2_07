import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaCheckCircle,
  FaTint,
  FaCalendar,
  FaEnvelope,
  FaHistory,
  FaClock,
  FaHeartbeat,
  FaMapMarkerAlt,
  FaPhone,
  FaWeight,
  FaRulerVertical,
  FaVenusMars,
  FaGlobe,
  FaCity,
  FaFlag,
  FaMapMarked,
  FaUserCircle,
  FaHeart,
  FaArrowRight,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import axios from "axios";

const Profile = () => {
  const user = useSelector((state) => state.user);

  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
  });
  const [donations, setDonorDonations] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/user/get-user/${user.user._id}`,
          { withCredentials: true }
        );
        if (response.data.success) {
          setUserProfile(response.data.user);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [user.user._id]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/donor/email/${user.user.email}`,
          { withCredentials: true }
        );
        if (response.data.success) {
          setDonorDonations(response.data.donor.donateCount);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [user.user.email]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div
          className={`bg-white rounded-2xl shadow-xl overflow-hidden border ${
            donations > 0 ? "border-green-100" : "border-red-100"
          }`}
        >
          <div className="relative px-6">
            <div className="flex flex-col items-center pt-16">
              <div className="relative">
                <div
                  className={`
                  w-32 h-32 
                  bg-white 
                  rounded-full 
                  border-4 ${
                    donations > 0 ? "border-green-200" : "border-red-200"
                  }
                  shadow-lg 
                  flex items-center justify-center
                  transform hover:scale-105 transition-all duration-300
                  overflow-hidden
                `}
                >
                  <FaUser className="text-6xl text-gray-400" />
                </div>
                <div
                  className={`absolute -bottom-2 -right-2 w-10 h-10 ${
                    donations > 0 ? "bg-green-100" : "bg-red-100"
                  } rounded-full flex items-center justify-center border-2 border-white`}
                >
                  <FaTint
                    className={`${
                      donations > 0 ? "text-green-600" : "text-red-600"
                    } text-2xl`}
                  />
                </div>
              </div>
              <h1 className="mt-4 text-3xl font-bold text-gray-900">
                {userProfile.fullName || userProfile.name}
              </h1>
              <div
                className={`mt-2 flex items-center gap-2 ${
                  donations > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                <FaCheckCircle />
                <span className="font-medium">
                  {donations > 0 ? "Verified Donor" : "Not Verified Donor"}
                </span>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <FaUserCircle className="text-2xl " />
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="text-lg font-bold text-gray-900">
                        {userProfile.fullName || userProfile.name}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <FaEnvelope className="text-2xl" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-lg font-bold text-gray-900">
                        {userProfile.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;