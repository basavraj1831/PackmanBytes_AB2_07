
import { FaTimes, FaEdit, FaCheckCircle, FaUser } from 'react-icons/fa'
import { useState, useEffect } from 'react'

function Update({ isOpen, onClose, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showSaveMessage, setShowSaveMessage] = useState(false);
  const [formData, setFormData] = useState({
    name: 'John Doe',
    bloodType: 'O+',
    age: '28',
    contact: '+1234567890',
    location: 'New York, NY',
    email: 'johndoe@example.com',
    gender: 'Male'
  });

  useEffect(() => {
    if (!isOpen) {
      setIsEditing(false);
      setShowSaveMessage(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = () => {
    if (isEditing) {
      onUpdate(formData);
      setIsEditing(false);
      setShowSaveMessage(true);
      setTimeout(() => {
        setShowSaveMessage(false);
      }, 3000);
    } else {
      setIsEditing(true);
    }
  };

  const renderField = (key, value) => {
    if (isEditing) {
      if (key === 'location' || key === 'email') {
        return (
          <input
            type="text"
            value={value}
            disabled
            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-500"
          />
        );
      }
      if (key === 'gender') {
        return (
          <select
            name={key}
            value={value}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        );
      }
      return (
        <input
          type="text"
          name={key}
          value={value}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      );
    }
    return <p className="text-gray-800 font-medium px-4 py-2">{value}</p>;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-3 rounded-full">
              <FaUser className="text-red-600 text-xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Donor Details
              </h2>
              {isEditing && (
                <p className="text-sm text-red-500">Editing Mode</p>
              )}
              {showSaveMessage && (
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <FaCheckCircle />
                  Changes saved successfully!
                </p>
              )}
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <div className="space-y-4">
          {Object.entries(formData).map(([key, value]) => (
            <div key={key} className="space-y-1">
              <label className="text-sm text-gray-600 font-medium capitalize block">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              {renderField(key, value)}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium rounded-lg hover:bg-gray-100"
          >
            Close
          </button>
          <button
            onClick={handleUpdate}
            className={`px-6 py-2 text-white rounded-lg font-medium transition-all
              ${isEditing 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-red-600 hover:bg-red-700'
              }`}
          >
            {isEditing ? 'Save Changes' : 'Edit Details'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Update; 