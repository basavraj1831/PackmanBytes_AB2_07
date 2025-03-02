import { useState, useEffect } from 'react';
import { FaSearch, FaMapMarkerAlt, FaTint, FaHospital, FaPhone, FaExternalLinkAlt } from 'react-icons/fa';
import { districtsByState } from '../data/districtData';

// Import state and district mappings
const stateCodes = {
    'Andaman and Nicobar Islands': '35',
    'Andhra Pradesh': '28',
    'Arunachal Pradesh': '12',
    'Assam': '18',
    'Bihar': '10',
    'Chandigarh': '94',
    'Chhattisgarh': '22',
    'Dadra And Nagar Haveli And Daman And Diu': '25',
    'Delhi': '97',
    'Goa': '30',
    'Gujarat': '24',
    'Haryana': '96',
    'Himachal Pradesh': '92',
    'Jammu and Kashmir': '91',
    'Jharkhand': '20',
    'Karnataka': '29',
    'Kerala': '32',
    'Ladakh': '37',
    'Lakshadweep': '31',
    'Madhya Pradesh': '23',
    'Maharashtra': '27',
    'Manipur': '14',
    'Meghalaya': '17',
    'Mizoram': '15',
    'Nagaland': '13',
    'Odisha': '21',
    'Puducherry': '34',
    'Punjab': '93',
    'Rajasthan': '98',
    'Sikkim': '11',
    'Tamil Nadu': '33',
    'Telangana': '36',
    'Tripura': '16',
    'Uttarakhand': '95',
    'Uttar Pradesh': '99',
    'West Bengal': '19'
};

const bloodGroups = {
    'AB-Ve': '18',
    'AB+Ve': '17',
    'A-Ve': '12',
    'A+Ve': '11',
    'B-Ve': '14',
    'B+Ve': '13',
    'Oh-VE': '23',
    'Oh+VE': '22',
    'O-Ve': '16',
    'O+Ve': '15',
    'All Blood Groups': 'all'
};

const bloodComponents = {
    'Whole Blood': '11',
    'Single Donor Platelet': '14',
    'Single Donor Plasma': '18',
    'Sagm Packed Red Blood Cells': '28',
    'Random Donor Platelets': '23',
    'Platelet Rich Plasma': '16',
    'Platelet Concentrate': '20',
    'Plasma': '19',
    'Packed Red Blood Cells': '12',
    'Leukoreduced Rbc': '30',
    'Irradiated RBC': '29',
    'Fresh Frozen Plasma': '13',
    'Cryoprecipitate': '17',
    'Cryo Poor Plasma': '21'
};

const BloodBankLocator = () => {
    const [selectedState, setSelectedState] = useState('-1');
    const [districts, setDistricts] = useState({});
    const [selectedDistrict, setSelectedDistrict] = useState('-1');
    const [selectedBloodGroup, setSelectedBloodGroup] = useState('-1');
    const [selectedComponent, setSelectedComponent] = useState('-1');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (selectedState !== '-1') {
            // Load districts for selected state
            const stateDistricts = districtsByState[selectedState] || {};
            setDistricts(stateDistricts);
            setSelectedDistrict('-1');
        }
    }, [selectedState]);

    const handleSearch = async () => {
        if (selectedState === '-1') {
            setError('Please select a state');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Construct URL with the exact format
            const url = `https://eraktkosh.mohfw.gov.in/BLDAHIMS/bloodbank/nearbyBB.cnt?hmode=GETNEARBYSTOCKDETAILS&stateCode=${selectedState}&districtCode=${selectedDistrict !== '-1' ? selectedDistrict : 'all'}&bloodGroup=${selectedBloodGroup !== '-1' ? selectedBloodGroup : 'all'}&bloodComponent=${selectedComponent !== '-1' ? selectedComponent : '11'}`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            // Transform the data into our required format
            const transformedResults = data.data.map(([id, details, type, availability, lastUpdated, category]) => {
                // Split details into parts (name, address, contact)
                const [name, address, contact] = details.split('<br/>');
                
                // Extract phone, fax, and email from contact
                const contactInfo = contact.split(',').map(info => info.trim());
                const phone = contactInfo[0].replace('Phone: ', '');
                
                return {
                    id,
                    name,
                    address,
                    phone,
                    type,
                    availability: availability.replace(/<[^>]*>/g, ''), // Remove HTML tags
                    lastUpdated,
                    category
                };
            });

            setResults(transformedResults);
        } catch (err) {
            setError('Failed to fetch blood bank data. Please try again later.');
            console.error('Error fetching blood banks:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* State Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select State
                        </label>
                        <select
                            value={selectedState}
                            onChange={(e) => setSelectedState(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                            <option value="-1">Select State</option>
                            {Object.entries(stateCodes).map(([state, code]) => (
                                <option key={code} value={code}>
                                    {state}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* District Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select District
                        </label>
                        <select
                            value={selectedDistrict}
                            onChange={(e) => setSelectedDistrict(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                            <option value="-1">Select District</option>
                            {Object.entries(districts).map(([district, code]) => (
                                <option key={code} value={code}>
                                    {district}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Blood Group Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Blood Group
                        </label>
                        <select
                            value={selectedBloodGroup}
                            onChange={(e) => setSelectedBloodGroup(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                            <option value="-1">Select Blood Group</option>
                            {Object.entries(bloodGroups).map(([group, code]) => (
                                <option key={code} value={code}>
                                    {group}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Blood Component Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Blood Component
                        </label>
                        <select
                            value={selectedComponent}
                            onChange={(e) => setSelectedComponent(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                            <option value="-1">Select Component</option>
                            {Object.entries(bloodComponents).map(([component, code]) => (
                                <option key={code} value={code}>
                                    {component}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {error && (
                    <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="mt-8 flex justify-center">
                    <button
                        onClick={handleSearch}
                        disabled={loading}
                        className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Searching...
                            </>
                        ) : (
                            <>
                                <FaSearch />
                                Search Blood Banks
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Results Table */}
            {results.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Blood Bank
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Contact
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Availability
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Last Updated
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {results.map((bloodBank) => (
                                    <tr key={bloodBank.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                                                        <FaHospital className="text-red-600" />
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {bloodBank.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {bloodBank.address}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                {bloodBank.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-900">
                                                <FaPhone className="mr-2 text-gray-400" />
                                                {bloodBank.phone}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                {bloodBank.availability}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(bloodBank.lastUpdated).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* No Results Message */}
            {!loading && results.length === 0 && selectedState !== '-1' && (
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                    <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaHospital className="text-gray-400 text-2xl" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No Blood Banks Found</h3>
                    <p className="text-gray-600">
                        We couldn't find any blood banks matching your criteria. Try adjusting your search filters.
                    </p>
                </div>
            )}
        </div>
    );
};

export default BloodBankLocator; 