import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SOSButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [hospitalName, setHospitalName] = useState("");
  const [bloodGroups, setBloodGroups] = useState([]);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  useEffect(() => {
    setIsOpen(true);
    setBloodGroups(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]);
  }, []);

  const handleSubmit = async () => {
    if (!hospitalName || !selectedBloodGroup || !contactNumber) {
      alert("Please fill in all fields: hospital name, blood group, and contact number.");
      return;
    }

    const requestData = {
      hospital: hospitalName,
      bloodGroup: selectedBloodGroup,
      phone: contactNumber,
    };

    try {
      const response = await fetch("http://localhost:3000/api/receiver/sos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("SOS request submitted successfully!");
        setIsOpen(false);
        navigate("/");
      } else {
        throw new Error(data.message || "Failed to submit request");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl w-96">
            <h2 className="text-xl font-semibold mb-4 text-center">SOS Request</h2>

            {/* Hospital Name Input */}
            <label className="block text-sm font-medium text-gray-700">Hospital Name</label>
            <input
              type="text"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter hospital name"
            />

            {/* Contact Number Input */}
            <label className="block mt-4 text-sm font-medium text-gray-700">Contact Number</label>
            <input
              type="tel"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              className="w-full px-3 py-2 border rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter your contact number"
            />

            {/* Blood Group Selection */}
            <label className="block mt-4 text-sm font-medium text-gray-700">Select Blood Group</label>
            <select
              value={selectedBloodGroup}
              onChange={(e) => setSelectedBloodGroup(e.target.value)}
              className="w-full px-3 py-2 border rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="" disabled>Select Blood Group</option>
              {bloodGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>

            {/* Buttons */}
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate("/");
                }}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SOSButton;