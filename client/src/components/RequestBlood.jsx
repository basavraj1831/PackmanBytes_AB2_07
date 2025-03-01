import { useState, useEffect } from 'react';
import { FaTint, FaMapMarkerAlt, FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaVenusMars, FaHospital, FaCity, FaGlobe, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function RequestBlood() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    bloodGroup: '',
    hospital: '',
    city: '',
    district: '',
    state: '',
    country: '',
  });

  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (!navigator.geolocation) {
      setSubmitStatus({ type: 'error', message: 'Geolocation is not supported by your browser.' });
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 2000,
    };

    const success = async (pos) => {
      const { latitude, longitude } = pos.coords;
      setLocation({ latitude, longitude });

      // Fetch address
      try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
        const { data } = await axios.get(url);

        if (data.address) {
          setAddress({
            city: data.address.city || data.address.town || data.address.village || 'Unknown',
            district: data.address.county || 'Unknown',
            state: data.address.state || 'Unknown',
            country: data.address.country || 'Unknown',
          });
        } else {
          setSubmitStatus({ type: 'error', message: 'Could not fetch address.' });
        }
      } catch (err) {
        setSubmitStatus({ type: 'error', message: 'Failed to fetch location data.' });
      }
    };

    const geoError = (err) => {
      setSubmitStatus({ type: 'error', message: err.code === 1 ? 'Please allow location access.' : 'Cannot get current location.' });
    };

    const watcher = navigator.geolocation.watchPosition(success, geoError, options);
    return () => navigator.geolocation.clearWatch(watcher);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    if (!location || !address) {
      setSubmitStatus({ type: 'error', message: 'Cannot send data. Location not available.' });
      setIsSubmitting(false);
      return;
    }

    const requestData = {
      ...formData,
      location: {
        type: 'Point',
        coordinates: [location.longitude, location.latitude],
      },
      city: address.city,
      district: address.district,
      state: address.state,
      country: address.country,
    };

    try {
      const response = await fetch('http://localhost:3000/api/receiver/add-receiver', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/near', { state: { donors: data.donors } });
      } else {
        throw new Error(data.message || 'Failed to submit request');
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Failed to submit request. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-500 py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Request Blood</h1>
          <p className="text-lg md:text-xl opacity-90 mb-8">
            Your request will be shared with our network of donors. We'll help you find the right match quickly.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center gap-3">
              <FaHospital className="text-2xl text-red-300" />
              <div className="text-left">
                <div className="text-sm opacity-75">Step 1</div>
                <div className="font-medium">Fill Details</div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center gap-3">
              <FaTint className="text-2xl text-red-300" />
              <div className="text-left">
                <div className="text-sm opacity-75">Step 2</div>
                <div className="font-medium">Submit Request</div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center gap-3">
              <FaPhone className="text-2xl text-red-300" />
              <div className="text-left">
                <div className="text-sm opacity-75">Step 3</div>
                <div className="font-medium">Get Connected</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 -mt-20 relative z-10 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                    <FaUser className="text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <div className="relative">
                      <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-200 focus:border-red-500 transition-all"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-200 focus:border-red-500 transition-all"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <div className="relative">
                      <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-200 focus:border-red-500 transition-all"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        required
                        min="0"
                        max="120"
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-200 focus:border-red-500 transition-all"
                        placeholder="Enter your age"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <div className="relative">
                      <FaVenusMars className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-200 focus:border-red-500 transition-all appearance-none"
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                    <div className="relative">
                      <FaTint className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-200 focus:border-red-500 transition-all appearance-none"
                      >
                        <option value="">Select blood group</option>
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(group => (
                          <option key={group} value={group}>{group}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                    <FaMapMarkerAlt className="text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Location Details</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <div className="relative">
                      <FaCity className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="city"
                        value={address?.city ?? 'Fetching...'}
                        readOnly
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-200 focus:border-red-500 transition-all"
                        placeholder="Enter city"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="district"
                        value={address?.district ?? 'Fetching...'}
                        readOnly
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-200 focus:border-red-500 transition-all"
                        placeholder="Enter district"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="state"
                        value={address?.state ?? 'Fetching...'}
                        readOnly
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-200 focus:border-red-500 transition-all"
                        placeholder="Enter state"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <div className="relative">
                      <FaGlobe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="country"
                        value={address?.country ?? 'Fetching...'}
                        readOnly
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-200 focus:border-red-500 transition-all"
                        placeholder="Enter country"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-3 rounded-xl font-semibold
                    ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:from-red-700 hover:to-red-600'}
                    transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FaTint />
                      Submit Blood Request
                      <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>

              {/* Status Message */}
              {submitStatus.message && (
                <div className={`p-4 rounded-lg animate-fadeIn ${
                  submitStatus.type === 'success' 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {submitStatus.message}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
              <FaPhone className="text-red-500 text-2xl mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">24/7 Support</h3>
              <p className="text-gray-600">Our team is available round the clock to assist you with your blood request.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
              <FaTint className="text-red-500 text-2xl mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Quick Response</h3>
              <p className="text-gray-600">We prioritize urgent blood requests and work to find donors quickly.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
              <FaMapMarkerAlt className="text-red-500 text-2xl mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Wide Network</h3>
              <p className="text-gray-600">Access to a large network of verified blood donors across the region.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestBlood;