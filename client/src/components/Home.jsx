

import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaTint, FaUserPlus, FaHandHoldingHeart, FaSearch, 
  FaFilter, FaMapMarkerAlt, FaClock, FaHospital, FaPhoneAlt,
  FaCalendarAlt, FaBell, FaArrowRight, FaUsers, FaAward, FaPhone, FaEnvelope, FaFacebook, FaTwitter, FaInstagram, FaLinkedin
} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function Home() {
  const user = useSelector((state) => state.user);

  console.log(user);

  const [activeTab, setActiveTab] = useState('donors');
  const [donorSearchTerm, setDonorSearchTerm] = useState('');
  const [requestSearchTerm, setRequestSearchTerm] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [expandedDonor, setExpandedDonor] = useState(null);
  const [expandedRequest, setExpandedRequest] = useState(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [donorResponses, setDonorResponses] = useState([]);
  const [receiverRequests, setReceiverRequests] = useState([]);

  useEffect(() => {
    // Fetch donors from the backend
    const fetchDonors = async () => {
      try {
        console.log('Fetching donors...');
        const response = await axios.get('http://localhost:3000/api/donor/donors');
        console.log('Donors fetched:', response.data.donors);
        setDonorResponses(response.data.donors || []);
      } catch (error) {
        console.error('Error fetching donors:', error);
      }
    };

    // Fetch receivers from the backend
    const fetchReceivers = async () => {
      try {
        console.log('Fetching receivers...');
        const response = await axios.get('http://localhost:3000/api/receiver');
        console.log('Receivers fetched:', response.data.receivers);
        setReceiverRequests(response.data.receivers || []);
      } catch (error) {
        console.error('Error fetching receivers:', error);
      }
    };

    fetchDonors();
    fetchReceivers();
  }, []);

  // Filter functions
  const filterDonors = (donors) => {
    return donors.filter(donor => {
      const searchTermLower = donorSearchTerm.toLowerCase();
      const matchesSearch = 
        (donor.name?.toLowerCase().includes(searchTermLower)) ||
        (donor.city?.toLowerCase().includes(searchTermLower)) ||
        (donor.district?.toLowerCase().includes(searchTermLower));
      
      const matchesBloodGroup = selectedBloodGroup === 'all' || donor.bloodGroup === selectedBloodGroup;
      const matchesLocation = selectedLocation === 'all' || 
        donor.city?.toLowerCase() === selectedLocation.toLowerCase() ||
        donor.district?.toLowerCase() === selectedLocation.toLowerCase();
      
      return matchesSearch && matchesBloodGroup && matchesLocation;
    });
  };

  const filterRequests = (requests) => {
    return requests.filter(request => {
      const searchTermLower = requestSearchTerm.toLowerCase();
      const matchesSearch = 
        (request.name?.toLowerCase().includes(searchTermLower)) ||
        (request.city?.toLowerCase().includes(searchTermLower)) ||
        (request.hospital?.toLowerCase().includes(searchTermLower)) ||
        (request.district?.toLowerCase().includes(searchTermLower));
      
      const matchesBloodGroup = selectedBloodGroup === 'all' || request.bloodGroup === selectedBloodGroup;
      const matchesLocation = selectedLocation === 'all' || 
        request.city?.toLowerCase() === selectedLocation.toLowerCase() ||
        request.district?.toLowerCase() === selectedLocation.toLowerCase();
      
      return matchesSearch && matchesBloodGroup && matchesLocation;
    });
  };

  // Add this function to get unique locations
  const getUniqueLocations = () => {
    const locations = new Set();
    
    donorResponses.forEach(donor => {
      if (donor.city) locations.add(donor.city);
      if (donor.district) locations.add(donor.district);
    });
    
    receiverRequests.forEach(request => {
      if (request.city) locations.add(request.city);
      if (request.district) locations.add(request.district);
    });
    
    return Array.from(locations).sort();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* New Hero Section */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <svg
              className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
              fill="currentColor"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polygon points="50,0 100,0 50,100 0,100" />
            </svg>

            <div className="relative pt-6 px-4 sm:px-6 lg:px-8"></div>

            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Every Drop of Blood</span>
                  <span className="block text-red-600">Can Save a Life</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  "The blood you donate gives someone another chance at life. One day that someone may be a close relative, a friend, a loved one—or even you."
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      to="/donor"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 md:py-4 md:text-lg md:px-10"
                    >
                      Donate Now
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      to="/request"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-red-600 bg-red-100 hover:bg-red-200 md:py-4 md:text-lg md:px-10"
                    >
                      Request Blood
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1776&q=80"
            alt="Blood Donation"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl shadow-sm p-1 inline-flex">
            <button
              onClick={() => setActiveTab('donors')}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'donors'
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Available Donors
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'requests'
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Blood Requests
            </button>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {activeTab === 'donors' ? 'Find Blood Donors' : 'Search Blood Requests'}
              </h2>
              <button
                onClick={() => setIsFilterVisible(!isFilterVisible)}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
              >
                <FaFilter />
                Filters
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={activeTab === 'donors' ? "Search donors by name or location..." : "Search requests by hospital or location..."}
                value={activeTab === 'donors' ? donorSearchTerm : requestSearchTerm}
                onChange={(e) => activeTab === 'donors' ? setDonorSearchTerm(e.target.value) : setRequestSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Filter Options */}
            {isFilterVisible && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                  <select
                    value={selectedBloodGroup}
                    onChange={(e) => setSelectedBloodGroup(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 p-2.5 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  >
                    <option value="all">All Blood Groups</option>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 p-2.5 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  >
                    <option value="all">All Locations</option>
                    {getUniqueLocations().map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Donors Section */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <FaUserPlus className="text-red-500" />
                  Available Donors
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{filterDonors(donorResponses).length} donors</span>
                </div>
              </div>
              
              {/* Donor Cards with Enhanced Scrollbar */}
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {filterDonors(donorResponses).map(donor => (
                  <div key={donor._id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-red-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-800 text-lg">{donor.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                          <FaMapMarkerAlt className="text-red-400" />
                          <span>{donor.district}, {donor.city}</span>
                          <span className="text-gray-300">•</span>
                          <span>{donor.state}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <FaCalendarAlt className="text-red-400" />
                            Age: {donor.age}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaTint className="text-red-400" />
                            {donor.gender}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <FaPhoneAlt className="text-red-400" />
                            Phone: {donor.phone}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-medium">
                          {donor.bloodGroup}
                        </div>
                        <div className={`text-sm ${donor.available ? 'text-green-500' : 'text-gray-500'}`}>
                          {donor.available ? 'Available' : 'Unavailable'}
                        </div>
                      </div>
                    </div>
                    
                    {expandedDonor === donor._id && (
                      <div className="mt-4 pt-4 border-t border-gray-100 animate-fadeIn">
                        <h4 className="font-semibold text-gray-800 mb-2">Contact Information</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <p>Email: {donor.email}</p>
                            <p>Phone: {donor.phone}</p>
                          </div>
                          <div>
                            <p>Location: {donor.district}, {donor.city}</p>
                            <p>State: {donor.state}, {donor.country}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4 flex items-center justify-between">
                      <button 
                        onClick={() => setExpandedDonor(expandedDonor === donor._id ? null : donor._id)}
                        className="text-red-600 text-sm font-medium flex items-center gap-2 hover:text-red-700"
                      >
                        {expandedDonor === donor._id ? 'Show Less' : 'View Details'}
                        <FaArrowRight className={`transition-transform ${
                          expandedDonor === donor._id ? 'rotate-90' : ''
                        }`} />
                      </button>
                      <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2">
                        <FaPhoneAlt />
                        Contact
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Receivers Section */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <FaHandHoldingHeart className="text-red-500" />
                  Blood Requests
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{filterRequests(receiverRequests).length} requests</span>
                </div>
              </div>

              {/* Request Cards with Enhanced Scrollbar */}
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {filterRequests(receiverRequests).map(request => (
                  <div key={request._id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-red-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-800 text-lg">{request.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                          <FaMapMarkerAlt className="text-red-400" />
                          <span>{request.district}, {request.city}</span>
                          <span className="text-gray-300">•</span>
                          <span>{request.state}</span>
                        </div>
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-medium">
                              {request.bloodGroup}
                            </span>
                            <span className="text-gray-500">•</span>
                            <span className="text-gray-600">Age: {request.age}</span>
                            <span className="text-gray-500">•</span>
                            <span className="text-gray-600">{request.gender}</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            Posted: {new Date(request.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <FaPhoneAlt className="text-red-400" />
                              Phone: {request.phone}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {expandedRequest === request._id && (
                      <div className="mt-4 pt-4 border-t border-gray-100 animate-fadeIn">
                        <h4 className="font-semibold text-gray-800 mb-2">Contact Information</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <p>Email: {request.email}</p>
                            <p>Phone: {request.phone}</p>
                          </div>
                          <div>
                            <p>Location: {request.district}, {request.city}</p>
                            <p>State: {request.state}, {request.country}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <button className="bg-red-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                        <FaTint />
                        Donate Now
                      </button>
                      <button className="bg-white text-red-600 border border-red-200 px-6 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
                        <FaPhoneAlt />
                        Contact
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Our Impact Section */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Impact</h2>
            <div className="w-20 h-1 bg-red-500 mx-auto mb-4"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Together, we're making a difference in saving lives through blood donation. Here's our impact so far.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
                <FaHandHoldingHeart className="text-3xl text-red-500" />
              </div>
              <h3 className="text-4xl font-bold text-gray-900 text-center mb-2">5000+</h3>
              <p className="text-gray-600 text-center">Lives Saved</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
                <FaUsers className="text-3xl text-red-500" />
              </div>
              <h3 className="text-4xl font-bold text-gray-900 text-center mb-2">10000+</h3>
              <p className="text-gray-600 text-center">Active Donors</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
                <FaHospital className="text-3xl text-red-500" />
              </div>
              <h3 className="text-4xl font-bold text-gray-900 text-center mb-2">50+</h3>
              <p className="text-gray-600 text-center">Partner Hospitals</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
                <FaAward className="text-3xl text-red-500" />
              </div>
              <h3 className="text-4xl font-bold text-gray-900 text-center mb-2">98%</h3>
              <p className="text-gray-600 text-center">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* About Section */}
            <div>
              <h3 className="text-xl font-bold mb-4">About Us</h3>
              <p className="text-gray-400 mb-4">
                We are dedicated to connecting blood donors with those in need, making the process of blood donation easier and more accessible.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/donor" className="text-gray-400 hover:text-red-500 transition-colors">Donate Blood</Link>
                </li>
                <li>
                  <Link to="/request" className="text-gray-400 hover:text-red-500 transition-colors">Request Blood</Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-400 hover:text-red-500 transition-colors">About Us</Link>
                </li>
                <li>
                  <Link to="/learn" className="text-gray-400 hover:text-red-500 transition-colors">Blood Types</Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-400">
                  <FaPhone className="text-red-500" />
                  <span>+1 234 567 8900</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <FaEnvelope className="text-red-500" />
                  <span>contact@blooddonation.com</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <FaMapMarkerAlt className="text-red-500" />
                  <span>123 Main Street, City, Country</span>
                </li>
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-xl font-bold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors">
                  <FaFacebook className="text-xl" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors">
                  <FaTwitter className="text-xl" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors">
                  <FaInstagram className="text-xl" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors">
                  <FaLinkedin className="text-xl" />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 pt-8 mt-8 text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} Blood Donation. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;