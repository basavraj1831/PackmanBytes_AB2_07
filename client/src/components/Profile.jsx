
import React, { useState, useEffect } from 'react';
import { FaUser, FaEdit, FaTint, FaCalendar, FaEnvelope, FaHistory, FaClock, FaCheckCircle, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    bloodGroup: 'O+',
    lastDonation: '2024-02-15',
    donationsCount: 5,
    joinedDate: '2023-01-01',
    nextEligibleDate: '2024-06-15',
    status: 'Active Donor'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || 'profile'
  );
  const [donors, setDonors] = useState([]);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
  };

  const handleLogout = () => {
    // Add your logout logic here
    // For example: clear local storage, reset auth state, etc.
    navigate('/');
  };

  useEffect(() => {
    if (location.state?.activeTab) {
      window.history.replaceState({}, document.title);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'donorList') {
      // Fetch donors when the donorList tab is active
      const fetchDonors = async () => {
        try {
          const response = await axios.get('http://localhost:3000/api/donor/donors');
          setDonors(response.data.donors || []);
        } catch (error) {
          console.error('Error fetching donors:', error);
        }
      };
      fetchDonors();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {location.state?.activeTab === 'donorList' ? (
          <DonorList donors={donors} />
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              {/* Header Banner */}
              <div className="bg-gradient-to-r from-red-600 to-red-700 h-32 relative">
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg flex items-center gap-2 backdrop-blur-sm transition-all duration-200"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
              
              {/* Profile Info */}
              <div className="relative px-6 -mt-16">
                <div className="flex flex-col items-center">
                  {/* Avatar */}
                  <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                    <FaUser className="text-5xl text-red-600" />
                  </div>
                  
                  {/* Name and Status */}
                  <h1 className="mt-4 text-3xl font-bold text-gray-900">{userProfile.name}</h1>
                  <div className="mt-2 flex items-center gap-2 text-green-600">
                    <FaCheckCircle />
                    <span>{userProfile.status}</span>
                  </div>
                  
                  {/* Edit Button */}
                  <button
                    onClick={handleEdit}
                    className="absolute top-0 right-4 bg-white text-red-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-50 transition-colors shadow-md"
                  >
                    <FaEdit /> {isEditing ? 'Cancel' : 'Edit Profile'}
                  </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-red-600 font-semibold">Blood Group</p>
                        <h3 className="text-3xl font-bold text-red-700">{userProfile.bloodGroup}</h3>
                      </div>
                      <FaTint className="text-4xl text-red-500 opacity-80" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-600 font-semibold">Total Donations</p>
                        <h3 className="text-3xl font-bold text-blue-700">{userProfile.donationsCount}</h3>
                      </div>
                      <FaHistory className="text-4xl text-blue-500 opacity-80" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-600 font-semibold">Next Eligible</p>
                        <h3 className="text-xl font-bold text-green-700">
                          {new Date(userProfile.nextEligibleDate).toLocaleDateString()}
                        </h3>
                      </div>
                      <FaClock className="text-4xl text-green-500 opacity-80" />
                    </div>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
                  {isEditing ? (
                    <form onSubmit={handleSave} className="space-y-6">
                      <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Full Name</label>
                          <input
                            type="text"
                            value={userProfile.name}
                            onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Email</label>
                          <input
                            type="email"
                            value={userProfile.email}
                            disabled
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                          />
                          <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
                      >
                        Save Changes
                      </button>
                    </form>
                  ) : (
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
                          <p className="font-medium">{new Date(userProfile.joinedDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 