import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhoneAlt, FaTint, FaUser } from 'react-icons/fa';
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

  console.log('User data:', userData);

  useEffect(() => {
    const fetchDonors = async () => {
      if (userData && !userLoading) {
        try {
          const email = userData?.user?.email;
          console.log('Fetching donors for email:', email); // Add this line to log the email
          const response = await fetch(`http://localhost:3000/api/receiver/get-latest-request/${email}`, {
            method: "get",
            credentials: "include",
          });
          console.log('Fetched donors response:', response); 
          const responseText = await response.text();
          console.log('Fetched donors response text:', responseText); // Add this line to log the response text
          const data = JSON.parse(responseText);
          console.log('Fetched donors data:', data); // Add this line to log the response
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Donors Nearby</h2>
            {userLoading ? (
              <p className="text-gray-600">Loading...</p>
            ) : userError ? (
              <p className="text-red-600">Error: {userError.message}</p>
            ) : donors.length > 0 ? (
              <div className="space-y-4">
                {donors.map(donor => (
                  <div key={donor._id} className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200">
                    <div className="flex items-center gap-4">
                      <FaUser className="text-red-500 text-2xl" />
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">{donor.name}</h3>
                        <p className="text-gray-600">{donor.bloodGroup}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-4">
                      <FaMapMarkerAlt className="text-gray-400" />
                      <p className="text-gray-600">{donor.city}, {donor.state}</p>
                    </div>
                    <div className="mt-4 flex items-center gap-4">
                      <FaPhoneAlt className="text-gray-400" />
                      <p className="text-gray-600">{donor.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No donors found nearby.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DonorsNearby;