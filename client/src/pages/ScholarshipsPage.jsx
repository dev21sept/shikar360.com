import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppTab from '../components/WhatsAppTab';
import CounsellingModal from '../components/CounsellingModal';
import AuthModal from '../components/AuthModal';
import CityModal from '../components/CityModal';
import { Search, Award, Calendar, ExternalLink, Gift } from 'lucide-react';
import { getScholarships } from '../services/api';
import { useAuth } from '../context/AuthContext';

const statusStyles = {
  Open: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Upcoming: 'bg-blue-50 text-blue-700 border-blue-200',
  Closed: 'bg-slate-100 text-slate-500 border-slate-200'
};

const ScholarshipsPage = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { setCounsellingModalOpen } = useAuth();

  useEffect(() => {
    fetchScholarships();
  }, [searchTerm]);

  const fetchScholarships = async () => {
    setLoading(true);
    const params = {};
    if (searchTerm) params.search = searchTerm;
    const res = await getScholarships(params);
    if (res && res.success) {
      setScholarships(res.scholarships || []);
    }
    setLoading(false);
  };

  const formatDate = (d) => {
    if (!d) return 'Rolling';
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col font-sans">
      <Header />
      <WhatsAppTab />

      <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-amber-100 text-xs font-bold uppercase tracking-wider mb-2">
            <Gift className="w-4 h-4" />
            <span>Fund Your Education</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">Scholarships &amp; Financial Aid</h1>
          <p className="text-xs sm:text-sm text-orange-50 max-w-2xl">
            Explore merit-based, need-based and government scholarships to reduce your tuition burden.
          </p>

          <div className="mt-5 max-w-xl flex items-center bg-white rounded-xl px-3 py-2.5 shadow-lg">
            <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search scholarship by name or provider..."
              className="w-full bg-transparent text-xs sm:text-sm focus:outline-none text-slate-800 placeholder-slate-400"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {loading ? (
          <div className="text-center text-sm text-slate-400 py-16">Loading scholarships...</div>
        ) : scholarships.length === 0 ? (
          <div className="text-center text-sm text-slate-400 py-16">No scholarships found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {scholarships.map((s, idx) => (
              <div
                key={s.id}
                style={{ animationDelay: `${idx * 60}ms` }}
                className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs hover-lift animate-fadeIn flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5 text-amber-600" />
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${statusStyles[s.status] || statusStyles.Open}`}>
                      {s.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1 leading-snug">{s.name}</h3>
                  <p className="text-[11px] text-slate-500 mb-3">{s.provider}</p>
                  <div className="flex items-center justify-between bg-emerald-50 rounded-lg px-3 py-2 mb-3">
                    <span className="text-[10px] text-emerald-700 font-semibold">Benefit</span>
                    <span className="text-xs font-black text-emerald-800">{s.benefitAmount}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{s.eligibility}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Deadline: <strong className="text-slate-800">{formatDate(s.applicationDeadline)}</strong>
                  </span>
                </div>
                <div className="pt-3 flex items-center gap-2">
                  {s.applyLink && s.applyLink !== '#' ? (
                    <a
                      href={s.applyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center py-2 bg-[#1a56db] text-white text-xs font-bold rounded-lg hover:bg-blue-700 flex items-center justify-center gap-1"
                    >
                      Apply Now <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <button
                      onClick={() => setCounsellingModalOpen(true)}
                      className="flex-1 py-2 bg-[#1a56db] text-white text-xs font-bold rounded-lg hover:bg-blue-700"
                    >
                      Enquire Now
                    </button>
                  )}
                </div>
              </div>
            ))}
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

export default ScholarshipsPage;
