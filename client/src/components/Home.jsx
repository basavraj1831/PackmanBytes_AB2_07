import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaTint, FaUserPlus, FaHandHoldingHeart, FaSearch, 
  FaFilter, FaMapMarkerAlt, FaClock, FaHospital, FaPhoneAlt,
  FaCalendarAlt, FaBell, FaArrowRight
} from 'react-icons/fa';
import { useSelector } from 'react-redux';

function Home() {

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 pt-20">
      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl shadow-sm p-1 inline-flex">
            <button
              onClick={() => setActiveTab('donors')}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'donors'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Available Donors
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'requests'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md'
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
                className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
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
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
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
                    className="w-full rounded-lg border border-gray-200 p-2.5 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
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
                    className="w-full rounded-lg border border-gray-200 p-2.5 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
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
              
              {/* Donor Cards */}
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {filterDonors(donorResponses).map(donor => (
                  <div key={donor._id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-purple-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-800 text-lg">{donor.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                          <FaMapMarkerAlt className="text-purple-400" />
                          <span>{donor.district}, {donor.city}</span>
                          <span className="text-gray-300">•</span>
                          <span>{donor.state}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <FaCalendarAlt className="text-purple-400" />
                            Age: {donor.age}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaTint className="text-purple-400" />
                            {donor.gender}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <FaPhoneAlt className="text-purple-400" />
                            Phone: {donor.phone}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="bg-purple-100 text-purple-600 px-4 py-2 rounded-full text-sm font-medium">
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
                        className="text-purple-600 text-sm font-medium flex items-center gap-2 hover:text-purple-700"
                      >
                        {expandedDonor === donor._id ? 'Show Less' : 'View Details'}
                        <FaArrowRight className={`transition-transform ${
                          expandedDonor === donor._id ? 'rotate-90' : ''
                        }`} />
                      </button>
                      <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center gap-2">
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

              {/* Request Cards */}
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {filterRequests(receiverRequests).map(request => (
                  <div key={request._id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-purple-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-800 text-lg">{request.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                          <FaMapMarkerAlt className="text-purple-400" />
                          <span>{request.district}, {request.city}</span>
                          <span className="text-gray-300">•</span>
                          <span>{request.state}</span>
                        </div>
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs font-medium">
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
                              <FaPhoneAlt className="text-purple-400" />
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
                      <button className="bg-purple-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
                        <FaTint />
                        Donate Now
                      </button>
                      <button className="bg-white text-purple-600 border border-purple-200 px-6 py-2 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors flex items-center justify-center gap-2">
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

      {/* Statistics Section */}
      <div className="bg-gradient-to-b from-white to-slate-50 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-16">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-red-50 to-white">
              <div className="text-4xl font-bold text-red-600 mb-2">150+</div>
              <div className="text-gray-600">Active Donors</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-red-50 to-white">
              <div className="text-4xl font-bold text-red-600 mb-2">50+</div>
              <div className="text-gray-600">Successful Matches</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-red-50 to-white">
              <div className="text-4xl font-bold text-red-600 mb-2">24/7</div>
              <div className="text-gray-600">Support Available</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-red-50 to-white">
              <div className="text-4xl font-bold text-red-600 mb-2">100%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* New Call to Action Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Ready to Save Lives?</h2>
          <div className="flex justify-center gap-6">
            <button className="bg-white text-purple-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-lg hover:shadow-xl">
              Become a Donor
            </button>
            <button className="bg-purple-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-purple-600 transition-colors duration-300 shadow-lg hover:shadow-xl">
              Request Blood
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;