import React, { useState, useEffect } from 'react';
import { FaUser, FaCheckCircle, FaTint, FaCalendar, FaEnvelope, FaHistory, FaClock } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Profile = () => {
  const user = useSelector((state) => state.user);

  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    bloodGroup: '',
    status: '',
    donationsCount: 0,
    nextEligibleDate: '',
    joinedDate: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/user/get-user/${user.user._id}`, { withCredentials: true });
        if (response.data.success) {
          setUserProfile(response.data.user);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, [user.user._id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="relative px-6 -mt-16">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                <FaUser className="text-5xl text-red-600" />
              </div>

              <h1 className="mt-4 text-3xl font-bold text-gray-900">{userProfile.name}</h1>
              <div className="mt-2 flex items-center gap-2 text-green-600">
                <FaCheckCircle />
                <span>{userProfile.status}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-red-100 rounded-xl p-6">
                <p className="text-red-600 font-semibold">Blood Group</p>
                <h3 className="text-3xl font-bold text-red-700">{userProfile.bloodGroup}</h3>
              </div>
              <div className="bg-blue-100 rounded-xl p-6">
                <p className="text-blue-600 font-semibold">Total Donations</p>
                <h3 className="text-3xl font-bold text-blue-700">{userProfile.donationsCount}</h3>
              </div>
              <div className="bg-green-100 rounded-xl p-6">
                <p className="text-green-600 font-semibold">Next Eligible</p>
                <h3 className="text-xl font-bold text-green-700">
                  {userProfile.nextEligibleDate ? new Date(userProfile.nextEligibleDate).toLocaleDateString() : 'N/A'}
                </h3>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gray-50 rounded-xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                  <FaEnvelope className="text-xl text-red-600" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{userProfile.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <FaCalendar className="text-xl text-red-600" />
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="font-medium">
                      {userProfile.joinedDate ? new Date(userProfile.joinedDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-4">
                <FaClock className="text-xl text-red-600" />
                <div>
                  <p className="text-sm text-gray-500">Next Eligible Donation</p>
                  <p className="font-medium">
                    {userProfile.nextEligibleDate ? new Date(userProfile.nextEligibleDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-4">
                <FaHistory className="text-xl text-red-600" />
                <div>
                  <p className="text-sm text-gray-500">Donation History</p>
                  <p className="font-medium">{userProfile.donationsCount} donations</p>
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
