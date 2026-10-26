import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppTab from '../components/WhatsAppTab';
import CounsellingModal from '../components/CounsellingModal';
import AuthModal from '../components/AuthModal';
import CityModal from '../components/CityModal';
import { Search, Filter, Star, MapPin, Award, CheckCircle2, Heart, Scale } from 'lucide-react';
import { getColleges } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CollegesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialType = searchParams.get('type') || '';
  const initialCategory = searchParams.get('category') || '';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedType, setSelectedType] = useState(initialType);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedState, setSelectedState] = useState('');
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);

  const { wishlist, toggleWishlist, addToCompare, compareList, setCounsellingModalOpen } = useAuth();

  useEffect(() => {
    fetchData();
  }, [searchTerm, selectedType, selectedCategory, selectedState]);

  const fetchData = async () => {
    setLoading(true);
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (selectedType) params.universityType = selectedType;
    if (selectedCategory) params.category = selectedCategory;
    if (selectedState) params.state = selectedState;

    const res = await getColleges(params);
    if (res && res.success && res.colleges) {
      setColleges(res.colleges);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col font-sans">
      <Header />
      <WhatsAppTab />

      <div className="bg-white border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
            Top Colleges &amp; Universities in India &amp; Abroad
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Compare verified fees, placements, NIRF rankings, and cutoffs for 2,500+ top institutions.
          </p>

          {/* Search bar inside directory */}
          <div className="mt-4 max-w-xl flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 shadow-xs">
            <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by college name, city or state..."
              className="w-full bg-transparent text-xs sm:text-sm focus:outline-none text-slate-800 placeholder-slate-400"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Filters Sidebar */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-6 h-fit">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <span className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                <Filter className="w-4 h-4 text-[#1a56db]" />
                <span>Filters</span>
              </span>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedType('');
                  setSelectedCategory('');
                  setSelectedState('');
                }}
                className="text-xs text-blue-600 hover:underline"
              >
                Reset All
              </button>
            </div>

            {/* University Type Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Institution Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">All Types</option>
                <option value="Autonomous">Autonomous / IIT / NIT</option>
                <option value="Deemed">Deemed University</option>
                <option value="Private">Private University</option>
                <option value="Central">Central University</option>
              </select>
            </div>

            {/* State Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">State / Region</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">All States</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Punjab">Punjab</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Delhi">Delhi NCR</option>
              </select>
            </div>

            {/* Counselling Lead Box */}
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 text-center">
              <p className="text-xs font-bold text-blue-900 mb-1">Need Admission Advice?</p>
              <p className="text-[11px] text-blue-700 mb-3">Speak with a dedicated counsellor for free.</p>
              <button
                onClick={() => setCounsellingModalOpen(true)}
                className="w-full py-2 bg-[#1a56db] text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs"
              >
                Get Guidance
              </button>
            </div>
          </div>

          {/* Colleges Listing */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 pb-2">
              <span>Showing <strong>{colleges.length}</strong> Institutions</span>
              <span className="text-slate-400">Verified by UGC / AICTE / NIRF</span>
            </div>

            {loading ? (
              <div className="py-20 text-center text-sm text-slate-400">Loading institutions...</div>
            ) : colleges.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl text-center border border-gray-100">
                <p className="text-sm font-semibold text-slate-700 mb-2">No institutions match your filters.</p>
                <button
                  onClick={() => { setSearchTerm(''); setSelectedType(''); setSelectedState(''); }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              colleges.map((college) => {
                const isWishlisted = wishlist.some(item => item.id === college.id);
                const isCompared = compareList.some(item => item.id === college.id);

                return (
                  <div
                    key={college.id}
                    className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row gap-5 items-start justify-between"
                  >
                    {/* Left: Logo & Info */}
                    <div className="flex gap-4 items-start">
                      <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 p-1.5 shrink-0 overflow-hidden shadow-xs">
                        {college.logoUrl ? (
                          <img src={college.logoUrl} alt={college.name} className="w-full h-full object-cover rounded" />
                        ) : (
                          <div className="w-full h-full bg-blue-100 text-blue-700 font-bold text-base flex items-center justify-center rounded">
                            {college.name.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/colleges/${college.slug}`}
                            className="text-base sm:text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors"
                          >
                            {college.name}
                          </Link>
                          {college.isVerified && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                              Verified
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-3 text-xs text-slate-500">
                          <span className="flex items-center">
                            <MapPin className="w-3.5 h-3.5 text-gray-400 mr-1" />
                            {college.city}, {college.state}
                          </span>
                          <span>•</span>
                          <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-medium">
                            {college.universityType}
                          </span>
                          {college.nirfRanking && (
                            <>
                              <span>•</span>
                              <span className="text-amber-700 font-medium">NIRF #{college.nirfRanking}</span>
                            </>
                          )}
                        </div>

                        <div className="flex items-center space-x-4 pt-2 text-xs">
                          <div className="flex items-center text-amber-500 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                            <span>{college.rating || '4.5'}/5</span>
                            <span className="text-slate-400 font-normal ml-1">({college.reviewCount || '500'})</span>
                          </div>
                          {college.averagePackage && (
                            <span className="text-slate-600">
                              Avg Package: <strong>{college.averagePackage}</strong>
                            </span>
                          )}
                          {college.highestPackage && (
                            <span className="text-slate-600 hidden sm:inline">
                              Highest: <strong>{college.highestPackage}</strong>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleWishlist(college)}
                          className={`p-2 rounded-lg border transition-colors ${
                            isWishlisted
                              ? 'bg-red-50 text-red-500 border-red-200'
                              : 'bg-gray-50 text-gray-400 hover:text-red-500 border-gray-200'
                          }`}
                          title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                        >
                          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500' : ''}`} />
                        </button>

                        <button
                          onClick={() => addToCompare(college)}
                          className={`p-2 rounded-lg border transition-colors ${
                            isCompared
                              ? 'bg-blue-50 text-blue-600 border-blue-200'
                              : 'bg-gray-50 text-gray-400 hover:text-blue-600 border-gray-200'
                          }`}
                          title="Add to Compare"
                        >
                          <Scale className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/colleges/${college.slug}`}
                          className="px-3.5 py-2 text-xs font-semibold text-[#1a56db] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => setCounsellingModalOpen(true)}
                          className="px-3.5 py-2 text-xs font-semibold text-white bg-[#1a56db] hover:bg-[#1545b3] rounded-lg transition-colors shadow-xs"
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })
            )}

          </div>

        </div>
      </div>

      <Footer />
      <CounsellingModal />
      <AuthModal />
      <CityModal />
    </div>
  );
};

export default CollegesPage;
