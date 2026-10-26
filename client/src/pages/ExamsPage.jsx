import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppTab from '../components/WhatsAppTab';
import CounsellingModal from '../components/CounsellingModal';
import AuthModal from '../components/AuthModal';
import CityModal from '../components/CityModal';
import { Search, Calendar, Building2, ChevronRight, BadgeCheck } from 'lucide-react';
import { getExams } from '../services/api';
import { useAuth } from '../context/AuthContext';

const STREAMS = ['All', 'Engineering', 'Medical', 'Management', 'Law'];

const statusStyles = {
  Upcoming: 'bg-blue-50 text-blue-700 border-blue-200',
  Ongoing: 'bg-amber-50 text-amber-700 border-amber-200',
  Completed: 'bg-slate-100 text-slate-500 border-slate-200'
};

const ExamsPage = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStream, setActiveStream] = useState('All');
  const { setCounsellingModalOpen } = useAuth();

  useEffect(() => {
    fetchExams();
  }, [searchTerm, activeStream]);

  const fetchExams = async () => {
    setLoading(true);
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (activeStream !== 'All') params.stream = activeStream;
    const res = await getExams(params);
    if (res && res.success) {
      setExams(res.exams || []);
    }
    setLoading(false);
  };

  const formatDate = (d) => {
    if (!d) return 'TBA';
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col font-sans">
      <Header />
      <WhatsAppTab />

      <div className="bg-gradient-to-r from-[#0b1c48] to-[#1a56db] text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">
            Entrance Exams — Dates, Eligibility &amp; Syllabus
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 max-w-2xl">
            Stay updated with application dates, exam patterns, and results for every major national and state-level entrance exam.
          </p>

          <div className="mt-5 max-w-xl flex items-center bg-white rounded-xl px-3 py-2.5 shadow-lg">
            <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search exam (e.g. JEE Main, NEET, CAT, CLAT)..."
              className="w-full bg-transparent text-xs sm:text-sm focus:outline-none text-slate-800 placeholder-slate-400"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="flex items-center gap-2 pb-6 overflow-x-auto hide-scrollbar">
          {STREAMS.map((s) => (
            <button
              key={s}
              onClick={() => setActiveStream(s)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeStream === s ? 'bg-[#1a56db] text-white shadow-sm' : 'bg-white text-slate-700 border border-gray-200 hover:bg-slate-50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center text-sm text-slate-400 py-16">Loading exams...</div>
        ) : exams.length === 0 ? (
          <div className="text-center text-sm text-slate-400 py-16">No exams found for this filter.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {exams.map((exam, idx) => (
              <div
                key={exam.id}
                style={{ animationDelay: `${idx * 60}ms` }}
                className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs hover-lift animate-fadeIn flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="text-base font-black text-slate-900 leading-snug">{exam.shortName || exam.name}</h3>
                    <span className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-bold border ${statusStyles[exam.status] || statusStyles.Upcoming}`}>
                      {exam.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-3 line-clamp-2">{exam.overview}</p>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{exam.conductingBody}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Exam Date: <strong className="text-slate-800">{formatDate(exam.examDate)}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BadgeCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{exam.stream} • {exam.level}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-50 flex items-center justify-between">
                  <Link
                    to={`/exams/${exam.slug}`}
                    className="text-xs font-semibold text-[#1a56db] hover:underline flex items-center gap-1"
                  >
                    <span>View Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    onClick={() => setCounsellingModalOpen(true)}
                    className="text-[11px] bg-gray-100 hover:bg-blue-50 hover:text-blue-600 px-2.5 py-1 rounded font-medium"
                  >
                    Get Guidance
                  </button>
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

export default ExamsPage;
