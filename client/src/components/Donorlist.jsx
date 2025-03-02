

import React, { useState } from 'react';
import { FaTint, FaCheck, FaTimes, FaSearch, FaFilter, FaMapMarkerAlt, FaUser, FaPhoneAlt } from 'react-icons/fa';

const DonorList = ({ donors: externalDonors }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('all');
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // Dummy data combined with external donors
  const dummyDonors = [
    {
      _id: '1',
      name: 'Rahul Sharma',
      email: 'rahul.s@gmail.com',
      phone: '+91 98765 43210',
      bloodGroup: 'A+',
      city: 'Mumbai',
      district: 'Mumbai Central',
      available: true,
    },
    {
      _id: '2',
      name: 'Priya Patel',
      email: 'priya.p@gmail.com',
      phone: '+91 87654 32109',
      bloodGroup: 'O-',
      city: 'Delhi',
      district: 'South Delhi',
      available: true,
    },
    {
      _id: '3',
      name: 'Amit Kumar',
      email: 'amit.k@gmail.com',
      phone: '+91 76543 21098',
      bloodGroup: 'B+',
      city: 'Bangalore',
      district: 'Koramangala',
      available: false,
    },
    {
      _id: '4',
      name: 'Sneha Reddy',
      email: 'sneha.r@gmail.com',
      phone: '+91 65432 10987',
      bloodGroup: 'AB+',
      city: 'Hyderabad',
      district: 'Gachibowli',
      available: true,
    },
    {
      _id: '5',
      name: 'Arjun Singh',
      email: 'arjun.s@gmail.com',
      phone: '+91 54321 09876',
      bloodGroup: 'O+',
      city: 'Chennai',
      district: 'T Nagar',
      available: true,
    },
    {
      _id: '6',
      name: 'Meera Iyer',
      email: 'meera.i@gmail.com',
      phone: '+91 43210 98765',
      bloodGroup: 'A-',
      city: 'Pune',
      district: 'Kothrud',
      available: false,
    }
  ];

  // Combine external donors with dummy data
  const allDonors = [...(externalDonors || []), ...dummyDonors];

  const filteredDonors = allDonors.filter(donor => {
    const matchesSearch = donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donor.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBloodGroup = selectedBloodGroup === 'all' || donor.bloodGroup === selectedBloodGroup;
    return matchesSearch && matchesBloodGroup;
  });

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-white">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <FaTint className="text-white" />
          Available Blood Donors
        </h2>
        <p className="mt-2 text-red-100">Find and connect with blood donors in your area</p>
      </div>

      {/* Search and Filter Section */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1 w-full">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search donors by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setIsFilterVisible(!isFilterVisible)}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <FaFilter />
            Filter by Blood Group
          </button>
        </div>

        {/* Filter Options */}
        {isFilterVisible && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl animate-fadeIn">
            <select
              value={selectedBloodGroup}
              onChange={(e) => setSelectedBloodGroup(e.target.value)}
              className="w-full md:w-48 rounded-lg border border-gray-200 p-2.5 focus:border-red-500 focus:ring-2 focus:ring-red-200"
            >
              <option value="all">All Blood Groups</option>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Donor Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Blood Group
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact Number
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDonors.map((donor) => (
              <tr key={donor._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                      <FaUser className="text-red-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{donor.name}</div>
                      <div className="text-sm text-gray-500">{donor.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    {donor.bloodGroup}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <FaMapMarkerAlt className="text-red-400 mr-2" />
                    <span>{donor.city}, {donor.district}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                    donor.available 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {donor.available ? <FaCheck className="text-xs" /> : <FaTimes className="text-xs" />}
                    {donor.available ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <FaPhoneAlt className="text-red-500 transform rotate-90" />
                    <span className="text-sm text-gray-900">{donor.phone}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {(!filteredDonors || filteredDonors.length === 0) && (
          <div className="text-center py-12">
            <div className="text-red-500 text-5xl mb-4">
              <FaTint className="mx-auto" />
            </div>
            <p className="text-gray-500 text-lg mb-2">No donors found</p>
            <p className="text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Table Footer */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          Showing {filteredDonors.length} of {allDonors.length} donors
        </div>
      </div>
    </div>
  );
};

export default DonorList; 