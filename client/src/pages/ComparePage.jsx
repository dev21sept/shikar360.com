import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppTab from '../components/WhatsAppTab';
import CounsellingModal from '../components/CounsellingModal';
import AuthModal from '../components/AuthModal';
import CityModal from '../components/CityModal';
import { Star, X, Check, ArrowRight, Plus, Award, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getColleges } from '../services/api';

const ComparePage = () => {
  const [searchParams] = useSearchParams();
  const { compareList, removeFromCompare, addToCompare, setCounsellingModalOpen } = useAuth();
  const [availableColleges, setAvailableColleges] = useState([]);

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    const res = await getColleges();
    if (res && res.success && res.colleges) {
      setAvailableColleges(res.colleges);
    }
  };

  const parameters = [
    { key: 'location', label: 'City & State', render: (c) => `${c.city}, ${c.state}` },
    { key: 'type', label: 'University Type', render: (c) => c.universityType || 'Private' },
    { key: 'rating', label: 'Student Rating', render: (c) => `★ ${c.rating || 4.2}/5 (${c.reviewCount || 400})` },
    { key: 'nirf', label: 'NIRF Ranking', render: (c) => c.nirfRanking ? `#${c.nirfRanking}` : 'Ranked top 100' },
    { key: 'avgPackage', label: 'Average Package', render: (c) => c.averagePackage || '₹7.5 LPA' },
    { key: 'highPackage', label: 'Highest Package', render: (c) => c.highestPackage || '₹50+ LPA' },
    { key: 'approvals', label: 'Accreditations', render: (c) => 'UGC Recognized, NAAC A+' },
    { key: 'btechFee', label: 'B.Tech Annual Fee', render: (c) => '₹2.45 Lakhs / yr' },
    { key: 'mbaFee', label: 'MBA Annual Fee', render: (c) => '₹3.25 Lakhs / yr' },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col font-sans">
      <Header />
      <WhatsAppTab />

      <div className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
            Compare Top Universities &amp; Colleges Side by Side
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Make informed decisions by evaluating fee structures, placement reports, NIRF rankings, and verified accreditations.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {compareList.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 max-w-lg mx-auto shadow-sm">
            <h3 className="text-base font-bold text-slate-800 mb-2">No Colleges Selected for Comparison</h3>
            <p className="text-xs text-slate-500 mb-6">Select 2 to 4 colleges from our database to compare side-by-side.</p>
            <Link
              to="/colleges"
              className="px-5 py-2.5 bg-[#1a56db] text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm inline-flex items-center space-x-2"
            >
              <span>Browse Colleges Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="p-4 w-48 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Comparison Metric
                    </th>
                    {compareList.map((col) => (
                      <th key={col.id} className="p-4 min-w-[220px] align-top">
                        <div className="relative flex flex-col items-center text-center">
                          <button
                            onClick={() => removeFromCompare(col.id)}
                            className="absolute -top-1 -right-1 text-gray-300 hover:text-red-500 p-1 rounded-full hover:bg-gray-100"
                            title="Remove from comparison"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          
                          <div className="w-14 h-14 rounded-xl bg-white border border-gray-100 p-1 mb-2 overflow-hidden shadow-xs">
                            <img src={col.logoUrl || 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=120'} alt={col.name} className="w-full h-full object-cover rounded" />
                          </div>
                          <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{col.name}</h4>
                          <span className="text-[10px] text-slate-400">{col.city}, {col.state}</span>

                          <button
                            onClick={() => setCounsellingModalOpen(true)}
                            className="mt-3 px-3.5 py-1.5 bg-[#1a56db] text-white text-[11px] font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-xs w-full"
                          >
                            Apply Now
                          </button>
                        </div>
                      </th>
                    ))}
                    {compareList.length < 4 && (
                      <th className="p-4 min-w-[180px] align-middle text-center">
                        <Link
                          to="/colleges"
                          className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 hover:border-blue-300 rounded-xl text-gray-400 hover:text-blue-600 transition-all"
                        >
                          <Plus className="w-6 h-6 mb-1" />
                          <span className="text-xs font-semibold">+ Add College</span>
                        </Link>
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {parameters.map((param, index) => (
                    <tr key={param.key} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}>
                      <td className="p-4 font-bold text-slate-700 whitespace-nowrap bg-gray-50/50">
                        {param.label}
                      </td>
                      {compareList.map((col) => (
                        <td key={col.id} className="p-4 text-slate-700 text-center font-medium">
                          {param.render(col)}
                        </td>
                      ))}
                      {compareList.length < 4 && <td className="p-4"></td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Footer />
      <CounsellingModal />
      <AuthModal />
      <CityModal />
    </div>
  );
};

export default ComparePage;
