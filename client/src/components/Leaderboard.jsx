import React, { useEffect, useState } from "react";
import axios from "axios";
import goldMedal from "../assets/goldmedal.png";
import silverMedal from "../assets/silvermedal.png";
import bronzeMedal from "../assets/bronzemedal.png";

const Leaderboard = () => {
  const [donorResponses, setDonorResponses] = useState([]);

  useEffect(() => {
    // Fetch donors from the backend
    const fetchLeaderDonors = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/donor/donors/leaderboard");
        setDonorResponses(response.data.donors); // Store top 10 donors
      } catch (error) {
        console.error("Error fetching donors:", error);
      }
    };

    fetchLeaderDonors();
  }, []);

  // Function to get badge image
  const getBadgeImage = (index) => {
    if (index === 0) return goldMedal; // Gold
    if (index === 1) return silverMedal; // Silver
    if (index === 2) return bronzeMedal; // Bronze
    return null;
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">Leaderboard Of Donors</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-gray-700 text-sm md:text-base">
              <th className="px-4 py-3 text-left">Index</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">No. of Blood Donations</th>
              <th className="px-4 py-3 text-left">Badge</th>
            </tr>
          </thead>
          <tbody>
            {donorResponses.map((donor, index) => (
              <tr key={index} className="border-b border-gray-200 text-sm md:text-base">
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3">{donor.name}</td>
                <td className="px-4 py-3">{donor.donateCount}</td>
                <td className="px-4 py-3">
                  {getBadgeImage(index) ? (
                    <img src={getBadgeImage(index)} alt="Badge" className="w-6 h-6 md:w-8 md:h-8" />
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
