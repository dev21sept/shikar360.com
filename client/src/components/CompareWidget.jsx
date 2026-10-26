import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, X, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CompareWidget = () => {
  const { compareList, removeFromCompare, clearCompare } = useAuth();
  const navigate = useNavigate();

  const handleCompare = () => {
    if (compareList.length < 2) {
      alert('Please select at least 2 colleges to compare.');
      return;
    }
    const ids = compareList.map(c => c.slug || c.id).join(',');
    navigate(`/compare?ids=${ids}`);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between h-full">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-xl font-extrabold text-slate-900">
            Compare Colleges / Universities
          </h3>
          <Link 
            to="/compare" 
            className="text-xs font-semibold text-[#1a56db] hover:underline"
          >
            View All
          </Link>
        </div>

        {/* Subtext + Clear All */}
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-50 text-xs text-slate-500">
          <span>Choose 2 to 4 colleges / universities to compare</span>
          {compareList.length > 0 && (
            <button 
              onClick={clearCompare}
              className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Mini Cards Container */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {compareList.map((college) => (
            <div 
              key={college.id}
              className="relative p-3 rounded-xl border border-gray-100 bg-white hover:border-blue-200 transition-all flex flex-col items-center text-center group"
            >
              {/* Remove X Button */}
              <button
                onClick={() => removeFromCompare(college.id)}
                className="absolute top-2 right-2 text-gray-300 hover:text-red-500 transition-colors p-0.5 rounded-full hover:bg-gray-100"
                title="Remove"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* Logo / Badge */}
              <div className="w-12 h-12 rounded-lg p-1 bg-white border border-gray-100 mb-2 flex items-center justify-center overflow-hidden shadow-xs">
                {college.logoUrl ? (
                  <img 
                    src={college.logoUrl} 
                    alt={college.name} 
                    className="w-full h-full object-cover rounded" 
                  />
                ) : (
                  <div className="w-full h-full bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center">
                    {college.name.substring(0, 2).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Name */}
              <h4 className="text-xs font-bold text-slate-900 mb-0.5 line-clamp-1">
                {college.name}
              </h4>

              {/* Location */}
              <p className="text-[10px] text-slate-400 mb-1.5 line-clamp-1">
                {college.city}, {college.state}
              </p>

              {/* Star Rating */}
              <div className="flex items-center space-x-1 text-[10px] font-semibold text-slate-700 mb-2">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>{college.rating || '4.2'}/5</span>
                <span className="text-slate-400 font-normal">({college.reviewCount || '512'})</span>
              </div>

              {/* View Details Link */}
              <Link 
                to={`/colleges/${college.slug || college.id}`}
                className="text-[11px] font-semibold text-[#1a56db] hover:underline mt-auto"
              >
                View Details
              </Link>
            </div>
          ))}

          {/* Empty slot placeholder if less than 3 */}
          {compareList.length < 3 && (
            <button
              onClick={() => navigate('/colleges')}
              className="p-3 rounded-xl border border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50/20 transition-all flex flex-col items-center justify-center text-center min-h-[140px] text-gray-400 hover:text-blue-600"
            >
              <Plus className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">+ Add College</span>
            </button>
          )}
        </div>
      </div>

      {/* Compare Now Full-Width Button */}
      <button
        onClick={handleCompare}
        className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-[#1a56db] hover:bg-[#1545b3] text-white transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
      >
        <span>Compare Now</span>
      </button>
    </div>
  );
};

export default CompareWidget;
