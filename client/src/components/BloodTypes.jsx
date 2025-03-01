import { useState } from 'react';
import { FaTint, FaExchangeAlt, FaInfoCircle, FaCheck, FaTimes, FaHeartbeat, FaChartPie } from 'react-icons/fa';

function BloodTypes() {
  const [selectedType, setSelectedType] = useState(null);

  const bloodTypes = [
    {
      type: "A+",
      canReceiveFrom: ["A+", "A-", "O+", "O-"],
      canDonateTo: ["A+", "AB+"],
      percentage: "30%",
      description: "Type A+ blood contains A antigens on red blood cells and + Rh factor. It's the second most common blood type."
    },
    {
      type: "A-",
      canReceiveFrom: ["A-", "O-"],
      canDonateTo: ["A+", "A-", "AB+", "AB-"],
      percentage: "6%",
      description: "Type A- blood contains A antigens but lacks the Rh factor. It's relatively rare and highly valuable for donations."
    },
    {
      type: "B+",
      canReceiveFrom: ["B+", "B-", "O+", "O-"],
      canDonateTo: ["B+", "AB+"],
      percentage: "8%",
      description: "Type B+ blood contains B antigens and + Rh factor. It's less common but vital for specific patient populations."
    },
    {
      type: "B-",
      canReceiveFrom: ["B-", "O-"],
      canDonateTo: ["B+", "B-", "AB+", "AB-"],
      percentage: "2%",
      description: "Type B- blood contains B antigens but lacks the Rh factor. It's one of the rarer blood types."
    },
    {
      type: "AB+",
      canReceiveFrom: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      canDonateTo: ["AB+"],
      percentage: "3%",
      description: "Type AB+ is the universal recipient, able to receive blood from all types. However, it can only donate to AB+ recipients."
    },
    {
      type: "AB-",
      canReceiveFrom: ["A-", "B-", "AB-", "O-"],
      canDonateTo: ["AB+", "AB-"],
      percentage: "1%",
      description: "Type AB- is one of the rarest blood types. It can receive from all negative blood types and donate to both AB types."
    },
    {
      type: "O+",
      canReceiveFrom: ["O+", "O-"],
      canDonateTo: ["A+", "B+", "AB+", "O+"],
      percentage: "38%",
      description: "Type O+ is the most common blood type. It's particularly important as it can donate to all positive blood types."
    },
    {
      type: "O-",
      canReceiveFrom: ["O-"],
      canDonateTo: ["All Blood Types"],
      percentage: "7%",
      description: "Type O- is the universal donor, able to donate to all blood types. It's critical for emergency situations."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 pt-20">
      {/* Header Section with Rainbow Gradient - Adjusted spacing */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-20 mb-16">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute w-72 h-72 -top-24 -left-24 bg-blue-400 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute w-72 h-72 -bottom-24 -right-24 bg-purple-400 rounded-full opacity-20 blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center p-2 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
              <FaHeartbeat className="text-xl animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Understanding Blood Types
            </h1>
            <p className="text-lg opacity-90 max-w-2xl mx-auto leading-relaxed">
              Learn about different blood types, compatibility, and the importance of knowing your type for saving lives.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content with Adjusted Sizing - Removed negative margin */}
      <div className="container mx-auto px-4">
        {/* Blood Types Grid with Larger Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {bloodTypes.map((blood) => (
            <div
              key={blood.type}
              className={`group bg-white rounded-xl shadow-md transition-all duration-300 cursor-pointer hover:shadow-lg 
                ${selectedType?.type === blood.type 
                  ? 'ring-2 ring-purple-500 transform scale-105' 
                  : 'hover:transform hover:scale-105'}`}
              onClick={() => setSelectedType(blood)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-purple-100 rounded-full animate-ping opacity-75"></div>
                      <FaTint className={`text-2xl relative z-10 transition-colors duration-300 
                        ${selectedType?.type === blood.type ? 'text-purple-600' : 'text-purple-500'}`} />
                    </div>
                    <span className="text-4xl font-bold text-gray-800">{blood.type}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <FaChartPie className="text-purple-400 mb-1 text-lg" />
                    <span className="text-sm font-medium text-gray-500">{blood.percentage}</span>
                  </div>
                </div>
                <p className="text-gray-600 text-base line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
                  {blood.description}
                </p>
                <div className="h-1 w-full bg-gradient-to-r from-purple-100 to-pink-50 rounded-full mt-4 
                  transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Compatibility Details with Rainbow Theme */}
        {selectedType && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-12 animate-fadeIn">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <FaExchangeAlt className="text-white text-lg" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Blood Type {selectedType.type} Compatibility
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Receive From Section */}
              <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-lg p-4 border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FaCheck className="text-teal-500" />
                  Can Receive From:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedType.canReceiveFrom.map((type) => (
                    <span
                      key={type}
                      className="px-3 py-1.5 bg-teal-100/70 text-teal-700 rounded-full text-sm font-medium 
                        flex items-center gap-1.5 hover:bg-teal-100 transition-colors duration-300"
                    >
                      <FaTint className="text-teal-500" />
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              {/* Donate To Section */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FaTint className="text-purple-500" />
                  Can Donate To:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedType.canDonateTo.map((type) => (
                    <span
                      key={type}
                      className="px-3 py-1.5 bg-purple-100/70 text-purple-700 rounded-full text-sm font-medium 
                        flex items-center gap-1.5 hover:bg-purple-100 transition-colors duration-300"
                    >
                      <FaHeartbeat className="text-purple-500" />
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Additional Information with Rainbow Theme */}
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-6 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <FaInfoCircle className="text-white text-lg" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Important Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "Universal Donor",
                icon: <FaTint className="text-indigo-500" />,
                description: "O- blood type is the universal donor, meaning it can be given to patients of all blood types."
              },
              {
                title: "Universal Recipient",
                icon: <FaHeartbeat className="text-purple-500" />,
                description: "AB+ blood type is the universal recipient, able to receive blood from all blood types."
              },
              {
                title: "Rh Factor",
                icon: <FaInfoCircle className="text-pink-500" />,
                description: "The + or - after your blood type refers to the Rh factor, which is important for transfusion compatibility."
              }
            ].map((info, index) => (
              <div key={index} 
                className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm hover:shadow transition-shadow duration-300 
                  border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center">
                    {info.icon}
                  </div>
                  <h3 className="font-semibold text-gray-800">{info.title}</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{info.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BloodTypes; 