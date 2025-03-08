import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhoneAlt, FaTint, FaUser, FaCircle, FaEnvelope } from 'react-icons/fa';
import { useFetch } from '../hooks/useFetch';
import BloodBankLocator from './BloodBankLocator';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

function DonorsNearby() {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [donors, setDonors] = useState([]);
  const [acceptedDonors, setAcceptedDonors] = useState([]);
  const [request, setRequest] = useState(null);
  const [requestStatus, setRequestStatus] = useState("Pending");
  const [donorLocations, setDonorLocations] = useState({});
  const { data: userData, loading: userLoading, error: userError } = useFetch(
    user?.user?._id ? `http://localhost:3000/api/user/get-user/${user.user._id}` : null,
    {
      method: "get",
      credentials: "include",
    }
  );

  useEffect(() => {
    const fetchRequestAndDonors = async () => {
      if (userData && !userLoading) {
        try {
          const email = userData?.user?.email;
          const response = await fetch(`http://localhost:3000/api/receiver/latest-request-by-user/${email}`, {
            method: "get",
            credentials: "include",
          });
          const responseText = await response.text();
          const data = JSON.parse(responseText);
          if (response.ok) {
            setRequest(data.request);
            setDonors(data.donors);
            setAcceptedDonors(data.acceptedDonors);
            setRequestStatus(data.requestStatus);
          } else {
            throw new Error(data.message || 'Failed to fetch request and donors');
          }
        } catch (error) {
          console.error('Error fetching request and donors:', error);
        }
      }
    };

    fetchRequestAndDonors();
  }, [userData, userLoading]);

  useEffect(() => {
    const fetchDonorLocations = async () => {
      try {
        const updatedLocations = {};
        for (const donor of acceptedDonors) {
          const response = await fetch(`http://localhost:3000/api/donor/email/${donor.email}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const data = await response.json();
          if (data.success && data.donor.location) {
            updatedLocations[donor.email] = {
              latitude: data.donor.location.coordinates[1],
              longitude: data.donor.location.coordinates[0],
            };
          }
        }
        setDonorLocations(updatedLocations);
      } catch (error) {
        console.error('Error fetching donor locations:', error);
      }
    };

    if (acceptedDonors.length > 0) {
      fetchDonorLocations();
      const intervalId = setInterval(fetchDonorLocations, 3000); 
      return () => clearInterval(intervalId);
    }
  }, [acceptedDonors]);

  useEffect(() => {
    socket.on('locationUpdated', (data) => {
      setDonorLocations(prevLocations => ({
        ...prevLocations,
        [data.email]: {
          latitude: data.latitude,
          longitude: data.longitude,
        },
      }));
    });

    return () => {
      socket.off('locationUpdated');
    };
  }, []);

  const mapCenter = request ? [request.location.coordinates[1], request.location.coordinates[0]] : [0, 0];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Blood Donors & Blood Banks
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with nearby blood donors and locate blood banks in your area
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {request && (
            <div className="mb-12 bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Blood Request</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <FaUser className="text-gray-500" />
                  <p className="font-medium">{request.name}</p>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <FaTint className="text-gray-500" />
                  <p className="font-medium">{request.bloodGroup}</p>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <FaMapMarkerAlt className="text-gray-500" />
                  <p className="font-medium">{request.city}, {request.state}</p>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <FaPhoneAlt className="text-gray-500" />
                  <p className="font-medium">{request.phone}</p>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <FaEnvelope className="text-gray-500" />
                  <p className="font-medium">{request.email}</p>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <FaCircle className="text-gray-500" />
                  <p className="font-medium">Request Status: {requestStatus}</p>
                </div>
              </div>
            </div>
          )}

          {acceptedDonors.length > 0 && (
            <div className="mb-12 bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Accepted Blood Donors</h2>
              <div className="space-y-4">
                {acceptedDonors.map(donor => (
                  <div key={donor._id} className="space-y-4">
                    <div className="flex items-center gap-3 text-gray-600">
                      <FaUser className="text-gray-500" />
                      <p className="font-medium">{donor.name}</p>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <FaTint className="text-gray-500" />
                      <p className="font-medium">{donor.bloodGroup}</p>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <FaMapMarkerAlt className="text-gray-500" />
                      <p className="font-medium">{donor.city}, {donor.state}</p>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <FaPhoneAlt className="text-gray-500" />
                      <p className="font-medium">{donor.phone}</p>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <FaEnvelope className="text-gray-500" />
                      <p className="font-medium">{donor.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Track Donors and Receiver</h2>
            <p className="text-gray-600">Real-time tracking of donors and receiver on the map</p>
          </div>

          {request && (
            <MapContainer center={mapCenter} zoom={13} style={{ height: "500px", width: "100%" }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[request.location.coordinates[1], request.location.coordinates[0]]}>
                <Popup>
                  <div>
                    <h3>{request.name}</h3>
                    <p>{request.city}, {request.state}</p>
                  </div>
                </Popup>
              </Marker>
              {acceptedDonors.map(donor => (
                <Marker key={donor._id} position={[donorLocations[donor.email]?.latitude || donor.location.coordinates[1], donorLocations[donor.email]?.longitude || donor.location.coordinates[0]]}>
                  <Popup>
                    <div>
                      <h3>{donor.name}</h3>
                      <p>{donor.city}, {donor.state}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>

        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Available Blood Donors</h2>
            <p className="text-gray-600">Find blood donors near you who are ready to help</p>
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
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      <FaCircle className="text-xs" />
                      <span className="text-sm font-medium">
                        {donor?.status === "Available" ? "Not Available" : 'Available'}
                      </span>
                    </div>
                  </div>

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
                    <div className="flex items-center gap-3 text-gray-600">
                      <div className="bg-gray-100 p-2 rounded-lg">
                        <FaEnvelope className="text-gray-500" />
                      </div>
                      <p className="font-medium">{donor.email}</p>
                    </div>
                  </div>
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
                We couldn't find any blood donors in your area at the moment. Please check back later or try searching in blood banks below.
              </p>
            </div>
          )}
        </div>

        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Find Blood Banks</h2>
            <p className="text-gray-600">Search for blood banks and check blood availability in your area</p>
          </div>
          <BloodBankLocator />
        </div>
      </div>
    </div>
  );
}

export default DonorsNearby;