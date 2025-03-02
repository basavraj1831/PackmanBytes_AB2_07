import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhoneAlt, FaTint, FaUser, FaCircle } from 'react-icons/fa';
import { useFetch } from '../hooks/useFetch';

function DonorsNearby() {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [donors, setDonors] = useState([]);
  const { data: userData, loading: userLoading, error: userError } = useFetch(
    user?.user?._id ? `http://localhost:3000/api/user/get-user/${user.user._id}` : null,
    {
      method: "get",
      credentials: "include",
    }
  );

  useEffect(() => {
    const fetchDonors = async () => {
      if (userData && !userLoading) {
        try {
          const email = userData?.user?.email;
          const response = await fetch(`http://localhost:3000/api/receiver/get-latest-request/${email}`, {
            method: "get",
            credentials: "include",
          });
          const responseText = await response.text();
          const data = JSON.parse(responseText);
          if (response.ok) {
            setDonors(data.donors);
          } else {
            throw new Error(data.message || 'Failed to fetch donors');
          }
        } catch (error) {
          console.error('Error fetching donors:', error);
        }
      }
    };

    fetchDonors();
  }, [userData, userLoading]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Available Blood Donors
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find blood donors near you who are ready to help save lives
          </p>
        </div>

        {userLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        ) : userError ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600">Error: {userError.message}</p>
          </div>
        ) : donors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donors.map(donor => (
              <div 
                key={donor._id} 
                className="bg-white rounded-2xl shadow-xl p-6 transform transition-all duration-300 hover:scale-105"
              >
                {/* Donor Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-red-100 p-3 rounded-full">
                      <FaUser className="text-red-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{donor.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <FaTint className="text-red-500" />
                        <span className="text-gray-600 font-medium">{donor.bloodGroup}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                    donor.status === 'Available' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    <FaCircle className="text-xs" />
                    <span className="text-sm font-medium">
                      {donor.status === 'Available' ? 'Not Available' : ' Available'}
                    </span>
                  </div>
                </div>

                {/* Donor Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="bg-gray-100 p-2 rounded-lg">
                      <FaMapMarkerAlt className="text-gray-500" />
                    </div>
                    <p className="font-medium">{donor.city}, {donor.state}</p>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="bg-gray-100 p-2 rounded-lg">
                      <FaPhoneAlt className="text-gray-500" />
                    </div>
                    <p className="font-medium">{donor.phone}</p>
                  </div>
                </div>

                {/* Contact Button */}
                
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-2xl mx-auto">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTint className="text-gray-400 text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Donors Found</h3>
            <p className="text-gray-600">
              We couldn't find any blood donors in your area at the moment. Please check back later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DonorsNearby;