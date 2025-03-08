import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSearch, FaSpinner } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const states = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam',
  'Bihar', 'Chandigarh', 'Chhattisgarh', 'Dadra And Nagar Haveli And Daman And Diu',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir',
  'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha',
  'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttarakhand', 'Uttar Pradesh', 'West Bengal'
];

const districtsByState = {
  'Andhra Pradesh': [
    'Alluri Sitharama Raju', 'Anakapalli', 'Anantapur', 'Annamayya', 'Bapatla',
    'Chittoor', 'East Godavari', 'Eluru', 'Guntur', 'Kakinada', 'Konaseema',
    'Krishna', 'Kurnool', 'Nandyal', 'NTR', 'Palnadu', 'Parvathipuram Manyam',
    'Prakasam', 'Srikakulam', 'Sri Potti Sriramulu Nellore', 'Sri Sathya Sai',
    'Tirupati', 'Visakhapatnam', 'Vizianagaram', 'West Godavari', 'Y.S.R.'
  ],
  'Gujarat': [
    'Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch',
    'Bhavnagar', 'Botad', 'Chhota Udaipur', 'Dahod', 'Dang', 'Devbhumi Dwarka',
    'Gandhinagar', 'Gir Somnath', 'Jamnagar', 'Junagadh', 'Kheda', 'Kutch',
    'Mahisagar', 'Mehsana', 'Morbi', 'Narmada', 'Navsari', 'Panchmahal',
    'Patan', 'Porbandar', 'Rajkot', 'Sabarkantha', 'Surat', 'Surendranagar',
    'Tapi', 'Vadodara', 'Valsad'
  ],
  'Karnataka': [
    'Bagalkot', 'Ballari', 'Bangalore Rural', 'Bangalore Urban', 'Belagavi',
    'Bidar', 'Chamarajanagar', 'Chikkaballapura', 'Chikmagalur', 'Chitradurga',
    'Dakshina Kannada', 'Davanagere', 'Dharwad', 'Gadag', 'Hassan', 'Haveri',
    'Kalaburagi', 'Kodagu', 'Kolar', 'Koppal', 'Mandya', 'Mysore', 'Raichur',
    'Ramanagara', 'Shimoga', 'Tumkur', 'Udupi', 'Uttara Kannada', 'Vijayapura',
    'Yadgir'
  ],
  'Maharashtra': [
    'Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Bhandara', 'Bid', 'Buldana',
    'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondiya', 'Hingoli', 'Jalgaon', 'Jalna',
    'Kolhapur', 'Latur', 'Mumbai', 'Mumbai Suburban', 'Nagpur', 'Nanded', 'Nandurbar',
    'Nashik', 'Osmanabad', 'Palghar', 'Parbhani', 'Pune', 'Raigarh', 'Ratnagiri',
    'Sangli', 'Satara', 'Sindhudurg', 'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal'
  ],
  'Tamil Nadu': [
    'Ariyalur', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul',
    'Erode', 'Kanchipuram', 'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai',
    'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai',
    'Ramanathapuram', 'Salem', 'Sivaganga', 'Thanjavur', 'Theni', 'Thoothukudi',
    'Tiruchirappalli', 'Tirunelveli', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai',
    'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar'
  ],
  'Delhi': [
    'Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi', 'North East Delhi',
    'North West Delhi', 'Shahdara', 'South Delhi', 'South East Delhi',
    'South West Delhi', 'West Delhi'
  ],
  'Uttar Pradesh': [
    'Agra', 'Aligarh', 'Allahabad', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya',
    'Azamgarh', 'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki',
    'Bareilly', 'Basti', 'Bhadohi', 'Bijnor', 'Budaun', 'Bulandshahr', 'Chandauli',
    'Chitrakoot', 'Deoria', 'Etah', 'Etawah', 'Faizabad', 'Farrukhabad', 'Fatehpur',
    'Firozabad', 'Gautam Buddha Nagar', 'Ghaziabad', 'Ghazipur', 'Gonda', 'Gorakhpur',
    'Hamirpur', 'Hapur', 'Hardoi', 'Hathras', 'Jalaun', 'Jaunpur', 'Jhansi', 'Kannauj',
    'Kanpur Dehat', 'Kanpur Nagar', 'Kasganj', 'Kaushambi', 'Kushinagar', 'Lakhimpur Kheri',
    'Lalitpur', 'Lucknow', 'Maharajganj', 'Mahoba', 'Mainpuri', 'Mathura', 'Mau',
    'Meerut', 'Mirzapur', 'Moradabad', 'Muzaffarnagar', 'Pilibhit', 'Pratapgarh',
    'Raebareli', 'Rampur', 'Saharanpur', 'Sambhal', 'Sant Kabir Nagar', 'Shahjahanpur',
    'Shamli', 'Shravasti', 'Siddharthnagar', 'Sitapur', 'Sonbhadra', 'Sultanpur',
    'Unnao', 'Varanasi'
  ]
};

function NearbyHospitals() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hospitals, setHospitals] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const user = useSelector((state) => state.user);
  
  useEffect(() => {
    console.log('User data from Redux:', user);
    console.log('User district:', user?.district);
    console.log('User state:', user?.state);
  }, [user]);

  useEffect(() => {
    const mapInstance = L.map('map').setView([20.5937, 78.9629], 5); 
    const markersLayer = L.layerGroup().addTo(mapInstance);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstance);

    setMap(mapInstance);
    setMarkers(markersLayer);

    return () => {
      mapInstance.remove();
    };
  }, []);

  useEffect(() => {
    const autoSearch = async () => {
      const searchLocation = user?.district || user?.state;
      
      if (searchLocation && map && markers) {
        console.log('Searching for location:', searchLocation);
        setSearchQuery(searchLocation);
        const radius = document.getElementById('radius')?.value || '10000';
        
        setLoading(true);
        setError('');
        setHospitals([]);
        markers?.clearLayers();

        try {
          console.log('Making API request for location:', searchLocation);
          const response = await axios.get(`http://localhost:3000/api/hospitals/search?location=${encodeURIComponent(searchLocation)}&radius=${radius}`);
          console.log('API response:', response.data);
          const data = response.data;

          if (data.status === 'success') {
            const newLocation = {
              lat: data.location_searched.coordinates.latitude,
              lng: data.location_searched.coordinates.longitude
            };
            setCurrentLocation(newLocation);
            setHospitals(data.hospitals);

            map?.setView([newLocation.lat, newLocation.lng], 13);

            data.hospitals.forEach(hospital => {
              const marker = L.marker([
                hospital.coordinates.latitude,
                hospital.coordinates.longitude
              ]);

              const popupContent = `
                <div style="min-width: 200px;">
                  <h3 style="margin: 0 0 10px 0; color: #1976d2;">${hospital.name}</h3>
                  ${hospital.healthcare ? `<div style="font-size: 12px; color: #666; margin-bottom: 8px;">${hospital.healthcare}</div>` : ''}
                  ${hospital.operator ? `<div style="font-size: 12px; color: #1976d2; margin-bottom: 8px;">Operated by: ${hospital.operator}</div>` : ''}
                  <div style="margin: 10px 0;">
                    ${hospital.address.street ? `<div>📍 ${hospital.address.street}</div>` : ''}
                    ${hospital.address.housenumber ? `<div>${hospital.address.housenumber}</div>` : ''}
                    ${hospital.address.city ? `<div>🏙️ ${hospital.address.city}</div>` : ''}
                    ${hospital.address.postcode ? `<div>📮 ${hospital.address.postcode}</div>` : ''}
                    ${hospital.phone ? `<div>📞 ${hospital.phone}</div>` : ''}
                  </div>
                  ${hospital.emergency ? '<div style="color: red; margin: 5px 0;">🚨 Emergency Services Available</div>' : ''}
                  <div style="display: flex; gap: 8px; margin-top: 10px;">
                    ${hospital.phone ? `
                      <a href="tel:${hospital.phone.replace(/[^0-9+]/g, '')}" 
                         style="background: #4CAF50; color: white; padding: 5px 10px; text-decoration: none; border-radius: 4px; font-size: 13px;">
                        📞 Call
                      </a>
                    ` : ''}
                    <a href="https://www.google.com/maps/dir/?api=1&destination=${hospital.coordinates.latitude},${hospital.coordinates.longitude}" 
                       target="_blank"
                       style="background: #2196F3; color: white; padding: 5px 10px; text-decoration: none; border-radius: 4px; font-size: 13px;">
                      🗺️ Directions
                    </a>
                  </div>
                </div>
              `;

              marker.bindPopup(popupContent);
              markers?.addLayer(marker);
            });
          } else {
            setError(data.message);
          }
        } catch (error) {
          console.error('Error during hospital search:', error);
          setError('Error searching for hospitals: ' + error.message);
        } finally {
          setLoading(false);
        }
      } else {
        console.log('No location data available or map not initialized');
      }
    };

    autoSearch();
  }, [map, markers, user]);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setError('Please enter a location to search');
      return;
    }

    const radius = document.getElementById('radius').value;
    
    setLoading(true);
    setError('');
    setHospitals([]);
    markers.clearLayers();

    try {
      const response = await axios.get(`http://localhost:3000/api/hospitals/search?location=${encodeURIComponent(searchQuery)}&radius=${radius}`);
      const data = response.data;

      if (data.status === 'success') {
        const newLocation = {
          lat: data.location_searched.coordinates.latitude,
          lng: data.location_searched.coordinates.longitude
        };
        setCurrentLocation(newLocation);
        setHospitals(data.hospitals);

        map.setView([newLocation.lat, newLocation.lng], 13);

        data.hospitals.forEach(hospital => {
          const marker = L.marker([
            hospital.coordinates.latitude,
            hospital.coordinates.longitude
          ]);

          const popupContent = `
            <div style="min-width: 200px;">
              <h3 style="margin: 0 0 10px 0; color: #1976d2;">${hospital.name}</h3>
              ${hospital.healthcare ? `<div style="font-size: 12px; color: #666; margin-bottom: 8px;">${hospital.healthcare}</div>` : ''}
              ${hospital.operator ? `<div style="font-size: 12px; color: #1976d2; margin-bottom: 8px;">Operated by: ${hospital.operator}</div>` : ''}
              <div style="margin: 10px 0;">
                ${hospital.address.street ? `<div>📍 ${hospital.address.street}</div>` : ''}
                ${hospital.address.housenumber ? `<div>${hospital.address.housenumber}</div>` : ''}
                ${hospital.address.city ? `<div>🏙️ ${hospital.address.city}</div>` : ''}
                ${hospital.address.postcode ? `<div>📮 ${hospital.address.postcode}</div>` : ''}
                ${hospital.phone ? `<div>📞 ${hospital.phone}</div>` : ''}
              </div>
              ${hospital.emergency ? '<div style="color: red; margin: 5px 0;">🚨 Emergency Services Available</div>' : ''}
              <div style="display: flex; gap: 8px; margin-top: 10px;">
                ${hospital.phone ? `
                  <a href="tel:${hospital.phone.replace(/[^0-9+]/g, '')}" 
                     style="background: #4CAF50; color: white; padding: 5px 10px; text-decoration: none; border-radius: 4px; font-size: 13px;">
                    📞 Call
                  </a>
                ` : ''}
                <a href="https://www.google.com/maps/dir/?api=1&destination=${hospital.coordinates.latitude},${hospital.coordinates.longitude}" 
                   target="_blank"
                   style="background: #2196F3; color: white; padding: 5px 10px; text-decoration: none; border-radius: 4px; font-size: 13px;">
                  🗺️ Directions
                </a>
              </div>
            </div>
          `;

          marker.bindPopup(popupContent);
          markers.addLayer(marker);
        });
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Error searching for hospitals: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Find Nearby Hospitals</h1>
        
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-1/4 bg-white rounded-lg shadow-lg p-6 ">
            <form onSubmit={handleSearch} className="space-y-6">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="searchQuery">
                  Search Location
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="searchQuery"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter city, area, or landmark..."
                    className="w-full p-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="radius">
                  Search Radius
                </label>
                <select
                  id="radius"
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="5000">5 km radius</option>
                  <option value="10000">10 km radius</option>
                  <option value="15000">15 km radius</option>
                  <option value="20000">20 km radius</option>
                  <option value="25000">25 km radius</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center gap-2 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <FaSearch />
                    Search Hospitals
                  </>
                )}
              </button>
            </form>

            {error && (
              <div className="mt-4 text-center text-red-600">
                {error}
              </div>
            )}

            {hospitals.length > 0 && (
              <div className="mt-4">
                <div className="text-center text-gray-800 font-semibold mb-4">
                  Found {hospitals.length} hospitals
                </div>
                <div className="space-y-4">
                  {hospitals.map((hospital, index) => (
                    <div 
                      key={index}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => {
                        const marker = markers.getLayers().find(layer => 
                          layer.getLatLng().lat === hospital.coordinates.latitude && 
                          layer.getLatLng().lng === hospital.coordinates.longitude
                        );
                        if (marker) {
                          marker.openPopup();
                          map.setView(marker.getLatLng(), 15);
                        }
                      }}
                    >
                      <h3 className="font-semibold text-blue-600">{hospital.name}</h3>
                      {hospital.healthcare && (
                        <p className="text-sm text-gray-600">{hospital.healthcare}</p>
                      )}
                      {hospital.emergency && (
                        <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded mt-1">
                          🚨 Emergency Services
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="w-full lg:w-3/4">
            <div id="map" className="h-[600px] rounded-lg shadow-lg relative z-10"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NearbyHospitals; 