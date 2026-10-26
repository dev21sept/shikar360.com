import React from 'react';
import { X, MapPin, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CityModal = () => {
  const { cityModalOpen, setCityModalOpen, selectedCity, setSelectedCity } = useAuth();

  if (!cityModalOpen) return null;

  const cities = [
    'Indore',
    'Bhopal',
    'Delhi NCR',
    'Mumbai',
    'Pune',
    'Bengaluru',
    'Hyderabad',
    'Jaipur',
    'Chandigarh',
    'Ahmedabad',
    'Kolkata',
    'Lucknow',
    'Chennai',
    'Nagpur',
    'Dehradun',
    'Patna'
  ];

  const handleSelect = (city) => {
    setSelectedCity(city);
    setCityModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-red-500 fill-red-500" />
            <h3 className="text-base font-bold text-slate-900">Select Your Preferred City</h3>
          </div>
          <button
            onClick={() => setCityModalOpen(false)}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cities Grid */}
        <div className="p-5 max-h-80 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {cities.map((city) => {
              const isSelected = selectedCity === city;
              return (
                <button
                  key={city}
                  onClick={() => handleSelect(city)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold text-left transition-all ${
                    isSelected
                      ? 'bg-blue-50 text-[#1a56db] border border-blue-200'
                      : 'bg-gray-50 text-slate-700 hover:bg-gray-100 border border-transparent'
                  }`}
                >
                  <span>{city}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#1a56db]" />}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CityModal;
