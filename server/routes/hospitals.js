import express from 'express';
import axios from 'axios';

const router = express.Router();

async function getCoordinates(placeName) {
    try {
        const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(placeName)}&format=json&limit=1`;
        
        const response = await axios.get(nominatimUrl, {
            headers: {
                'User-Agent': 'Hospital-Finder/1.0' 
            }
        });

        if (response.data && response.data.length > 0) {
            const location = response.data[0];
            return {
                latitude: parseFloat(location.lat),
                longitude: parseFloat(location.lon),
                display_name: location.display_name
            };
        } else {
            throw new Error(`Location '${placeName}' not found`);
        }
    } catch (error) {
        throw new Error(`Failed to get coordinates: ${error.message}`);
    }
}

async function findNearbyHospitals(location, radius = 5000) {
    try {
        let searchCoords;
        let locationName;
        
        if (typeof location === 'string') {
            const coords = await getCoordinates(location);
            searchCoords = {
                latitude: coords.latitude,
                longitude: coords.longitude
            };
            locationName = coords.display_name;
        } else {
            searchCoords = {
                latitude: location.latitude || location.lat,
                longitude: location.longitude || location.lon
            };
            locationName = 'Custom Location';
        }
        
        const overpassUrl = 'https://overpass-api.de/api/interpreter';
        
        const query = `[out:json][timeout:25];
(
  node["amenity"="hospital"](around:${radius},${searchCoords.latitude},${searchCoords.longitude});
  way["amenity"="hospital"](around:${radius},${searchCoords.latitude},${searchCoords.longitude});
  relation["amenity"="hospital"](around:${radius},${searchCoords.latitude},${searchCoords.longitude});
);
out body;
>;
out skel qt;`;

        const response = await axios.post(overpassUrl, query);
        
        const hospitals = response.data.elements
            .filter(element => element.tags?.name && element.tags.name !== 'Unknown')
            .map(element => {
                return {
                    name: element.tags.name,
                    type: element.type,
                    coordinates: {
                        latitude: element.lat || element.center?.lat,
                        longitude: element.lon || element.center?.lon
                    },
                    address: {
                        street: element.tags?.['addr:street'],
                        housenumber: element.tags?.['addr:housenumber'],
                        city: element.tags?.['addr:city'],
                        postcode: element.tags?.['addr:postcode']
                    },
                    emergency: element.tags?.emergency === 'yes',
                    phone: element.tags?.phone,
                    website: element.tags?.website,
                    healthcare: element.tags?.healthcare,
                    operator: element.tags?.operator,
                    opening_hours: element.tags?.opening_hours
                };
            })
            .filter(hospital => hospital.coordinates.latitude && hospital.coordinates.longitude);

        return {
            status: 'success',
            count: hospitals.length,
            location_searched: {
                name: locationName,
                coordinates: searchCoords,
                radius_meters: radius
            },
            hospitals: hospitals
        };

    } catch (error) {
        throw new Error(`Failed to find hospitals: ${error.message}`);
    }
}

router.get('/search', async (req, res) => {
    try {
        const { location, radius } = req.query;
        
        if (!location) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'Location parameter is required' 
            });
        }

        const searchRadius = parseInt(radius) || 5000;
        if (searchRadius < 1000 || searchRadius > 50000) {
            return res.status(400).json({
                status: 'error',
                message: 'Radius must be between 1000 and 50000 meters'
            });
        }

        const result = await findNearbyHospitals(location, searchRadius);
        res.json(result);
    } catch (error) {
        res.status(500).json({ 
            status: 'error', 
            message: error.message 
        });
    }
});

export { router as hospitalsRouter }; 