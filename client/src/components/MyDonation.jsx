import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaTint, FaMapMarkerAlt, FaEdit, FaTrash, FaCheckCircle, FaTimesCircle, FaTimes, FaHistory, FaPhone, FaEnvelope } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const MyDonations = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [donorInfo, setDonorInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState('Available');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [donations, setDonations] = useState([]);
  const [editingDonation, setEditingDonation] = useState(null);
  const [deletingDonation, setDeletingDonation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    fetchDonorInfo();
    fetchDonations();
  }, [user.user._id]);

  useEffect(() => {
    const updateLocation = () => {
      if (!navigator.geolocation) {
        console.error("Geolocation is not supported");
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000
      };

      const success = async (position) => {
        const { latitude, longitude } = position.coords;
        console.log('New location detected:', { latitude, longitude });
        
        try {
          // Update location in backend
          const response = await axios.put(`http://localhost:3000/api/donor/update-location/${user.user.email}`, {
            longitude,
            latitude
          }, {
            withCredentials: true
          });

          if (response.data.success) {
            setCurrentLocation({ latitude, longitude });
            setDonorInfo(response.data.donor);
            console.log('Location updated in database:', response.data.donor.location);
          }
        } catch (error) {
          console.error('Error updating location:', error);
        }
      };

      const error = (err) => {
        console.error('Geolocation error:', err);
      };

      // Watch for location changes
      const watchId = navigator.geolocation.watchPosition(success, error, options);

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    };

    if (donorInfo) {
      updateLocation();
    }
  }, [user.user.email, donorInfo]);

  const fetchDonorInfo = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/donor/email/${user.user.email}`, {
        withCredentials: true
      });
      setDonorInfo(response.data.donor);
      if (response.data.donor) {
        setStatus(response.data.donor.status);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching donor info:', error);
      setLoading(false);
    }
  };

  const fetchDonations = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/donations/user/${user.user._id}`, {
        withCredentials: true
      });
      setDonations(response.data.donations || []);
    } catch (error) {
      console.error('Error fetching donations:', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/donor/email/${user.user.email}`, {
        status
      }, {
        withCredentials: true
      });
      toast.success('Donor information updated successfully');
      setIsEditing(false);
      fetchDonorInfo();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating donor information');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/donor/email/${user.user.email}`, {
        withCredentials: true
      });
      toast.success('Donor profile deleted successfully');
      setDonorInfo(null);
      setShowDeleteConfirm(false);
      navigate('/profile');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting donor profile');
    }
  };

  const handleUpdateDonation = async (e, donationId) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/donations/update/${donationId}`, {
        ...editingDonation,
      }, {
        withCredentials: true
      });
      toast.success('Donation updated successfully');
      setEditingDonation(null);
      fetchDonations();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating donation');
    }
  };

  const handleDeleteDonation = async (donationId) => {
    try {
      await axios.delete(`http://localhost:3000/api/donations/delete/${donationId}`, {
        withCredentials: true
      });
      toast.success('Donation deleted successfully');
      setDeletingDonation(null);
      fetchDonations();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting donation');
    }
  };

  const LocationDisplay = () => (
    <div className="space-y-2">
      <p className="text-sm text-gray-500">Current Location</p>
      {donorInfo?.location?.coordinates && (
        <>
          <p className="text-sm text-gray-900">
            Latitude: {donorInfo.location.coordinates[1].toFixed(6)}
          </p>
          <p className="text-sm text-gray-900">
            Longitude: {donorInfo.location.coordinates[0].toFixed(6)}
          </p>
        </>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Donor Profile</h1>
              {donorInfo && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <FaEdit size={16} />
                    <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FaTrash size={16} />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdate} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="Available">Available</option>
                    <option value="Not Available">Not Available</option>
                  </select>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                {donorInfo ? (
                  <>
                    <div className="flex items-center gap-4">
                      <FaTint className="text-2xl text-red-500" />
                      <div>
                        <p className="text-sm text-gray-500">Blood Group</p>
                        <p className="font-semibold text-gray-900">{donorInfo.bloodGroup}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <FaMapMarkerAlt className="text-2xl text-red-500" />
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-semibold text-gray-900">{donorInfo.address}</p>
                        <p className="text-sm text-gray-500">City</p>
                        <p className="font-semibold text-gray-900">{donorInfo.city}</p>
                        <p className="text-sm text-gray-500">District</p>
                        <p className="font-semibold text-gray-900">{donorInfo.district}</p>
                        <p className="text-sm text-gray-500">State</p>
                        <p className="font-semibold text-gray-900">{donorInfo.state}</p>
                        <p className="text-sm text-gray-500">Country</p>
                        <p className="font-semibold text-gray-900">{donorInfo.country}</p>
                        <p className="text-sm text-gray-500 mt-4">Real-time Location</p>
                        <LocationDisplay />
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <FaPhone className="text-2xl text-red-500" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-semibold text-gray-900">{donorInfo.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <FaEnvelope className="text-2xl text-red-500" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-semibold text-gray-900">{donorInfo.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {status === 'Available' ? (
                        <FaCheckCircle className="text-2xl text-green-500" />
                      ) : (
                        <FaTimesCircle className="text-2xl text-red-500" />
                      )}
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <p className={`font-semibold ${status === 'Available' ? 'text-green-600' : 'text-red-600'}`}>
                          {status === 'Available' ? 'Available' : 'Not Available'}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <FaTint className="text-6xl text-red-200 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Not Registered as Donor</h3>
                    <p className="text-gray-500 mb-4">Register as a donor to start helping others.</p>
                    <button
                      onClick={() => navigate('/donor')}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Register as Donor
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Donations Section */}
        {donations.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FaHistory className="text-red-500" />
                Donation History
              </h2>

              <div className="space-y-4">
                {donations.map((donation) => (
                  <div 
                    key={donation._id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    {editingDonation?.id === donation._id ? (
                      <form onSubmit={(e) => handleUpdateDonation(e, donation._id)} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                          <input
                            type="date"
                            value={editingDonation.date.split('T')[0]}
                            onChange={(e) => setEditingDonation({
                              ...editingDonation,
                              date: e.target.value
                            })}
                            className="w-full p-2 border rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                          <input
                            type="text"
                            value={editingDonation.location}
                            onChange={(e) => setEditingDonation({
                              ...editingDonation,
                              location: e.target.value
                            })}
                            className="w-full p-2 border rounded-lg"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingDonation(null)}
                            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">
                            {new Date(donation.date).toLocaleDateString()}
                          </p>
                          <p className="text-gray-600">{donation.location}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingDonation(donation)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <FaEdit size={16} />
                          </button>
                          <button
                            onClick={() => setDeletingDonation(donation)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Donation Confirmation Modal */}
      {deletingDonation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Delete Donation Record</h3>
              <button
                onClick={() => setDeletingDonation(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this donation record? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDeleteDonation(deletingDonation._id)}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setDeletingDonation(null)}
                className="flex-1 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Delete Donor Profile</h3>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete your donor profile? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyDonations;