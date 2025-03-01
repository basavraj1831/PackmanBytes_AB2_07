import { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Donor Registration</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="p-2 border rounded" required />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="p-2 border rounded" required />
          <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="p-2 border rounded" required />
          <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} className="p-2 border rounded" required />
          
          <select name="gender" value={formData.gender} onChange={handleChange} className="p-2 border rounded" required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="p-2 border rounded" required>
            <option value="">Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>

          <p>Latitude: {location?.latitude ?? "Fetching..."}</p>
          <p>Longitude: {location?.longitude ?? "Fetching..."}</p>
          <p>City: {address?.city ?? "Fetching..."}</p>
          <p>District: {address?.district ?? "Fetching..."}</p>
          <p>State: {address?.state ?? "Fetching..."}</p>
          <p>Country: {address?.country ?? "Fetching..."}</p>

          <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" disabled={loading}>
            {loading ? "Submitting..." : "Register as Donor"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
