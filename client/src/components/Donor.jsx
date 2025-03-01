import { useState, useEffect } from "react";
import axios from "axios";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaTint, FaCalendar, FaHeartbeat } from 'react-icons/fa';

const DonorRegistration = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    bloodGroup: "",
  });
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
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
            city: data.address.city || data.address.town || data.address.village || "Unknown",
            district: data.address.county || "Unknown",
            state: data.address.state || "Unknown",
            country: data.address.country || "Unknown",
          });
        } else {
          setError("Could not fetch address.");
        }
      } catch (err) {
        setError("Failed to fetch location data.");
      }
    };

    const geoError = (err) => {
      setError(err.code === 1 ? "Please allow location access." : "Cannot get current location.");
    };

    const watcher = navigator.geolocation.watchPosition(success, geoError, options);
    return () => navigator.geolocation.clearWatch(watcher);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.age || !formData.gender || !formData.bloodGroup) {
      setError("Please fill all fields.");
      return;
    }

    if (!location || !address) {
      setError("Cannot send data. Location not available.");
      return;
    }

    const donorData = {
      ...formData,
      age: Number(formData.age),
      location: {
        type: "Point",
        coordinates: [location.longitude, location.latitude],
      },
      city: address.city,
      district: address.district,
      state: address.state,
      country: address.country,
      available: true,
    };

    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/donor/add-donor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(donorData),
      });

      const data = await response.json();
      setLoading(false);

      if (data.success) {
        alert("Donor added successfully!");
        setFormData({ name: "", email: "", phone: "", age: "", gender: "", bloodGroup: "" });
      } else {
        setError(data.message || "Failed to send data.");
      }
    } catch (err) {
      setLoading(false);
      setError("Error sending data to the server.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">
            Blood Donor Registration
          </h2>
          <div className="w-24 h-1 bg-red-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join our life-saving mission by becoming a blood donor today. Your contribution can save lives.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
                  <FaUser className="text-2xl text-red-500" />
                  <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl">
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200 bg-white"
                      required
                    />
                  </div>
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200 bg-white"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200 bg-white"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
                  <FaEnvelope className="text-2xl text-red-500" />
                  <h3 className="text-xl font-bold text-gray-900">Contact Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl">
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200 bg-white"
                      required
                    />
                  </div>
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200 bg-white"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
                  <FaMapMarkerAlt className="text-2xl text-red-500" />
                  <h3 className="text-xl font-bold text-gray-900">Address Details</h3>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl space-y-6">
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={address?.city ?? "Fetching..."}
                      readOnly
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200 bg-white"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">District</label>
                      <input
                        type="text"
                        name="district"
                        value={address?.district ?? "Fetching..."}
                        readOnly
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200 bg-white"
                        required
                      />
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                      <input
                        type="text"
                        name="state"
                        value={address?.state ?? "Fetching..."}
                        readOnly
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200 bg-white"
                        required
                      />
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                      <input
                        type="text"
                        name="country"
                        value={address?.country ?? "Fetching..."}
                        readOnly
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200 bg-white"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
                  <FaHeartbeat className="text-2xl text-red-500" />
                  <h3 className="text-xl font-bold text-gray-900">Medical Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl">
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Blood Group</label>
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200 bg-white"
                      required
                    >
                      <option value="">Select Blood Group</option>
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(group => (
                        <option key={group} value={group}>{group}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    required
                  />
                  <span className="text-sm text-gray-700">
                    I agree to the <a href="#" className="text-red-600 hover:text-red-700">Terms and Conditions</a> and confirm that all provided information is accurate.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <FaTint className="text-xl" />
                  Register as Blood Donor
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Already registered? <a href="#" className="text-red-600 hover:text-red-700 font-medium">Check your donor status</a>
        </div>
      </div>
    </div>
  );
};

export default DonorRegistration;
