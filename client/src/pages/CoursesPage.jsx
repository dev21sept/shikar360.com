import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppTab from '../components/WhatsAppTab';
import CounsellingModal from '../components/CounsellingModal';
import AuthModal from '../components/AuthModal';
import CityModal from '../components/CityModal';
import { Search, BookOpen, GraduationCap, ChevronRight } from 'lucide-react';
import { getCourses } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const { setCounsellingModalOpen } = useAuth();

  useEffect(() => {
    fetchCourses();
  }, [searchTerm, selectedLevel]);

  const fetchCourses = async () => {
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (selectedLevel) params.level = selectedLevel;
    const res = await getCourses(params);
    if (res && res.success && res.courses) {
      setCourses(res.courses);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col font-sans">
      <Header />
      <WhatsAppTab />

      <div className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
            Explore 50,000+ Courses Across India &amp; Globally
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Find undergraduate, postgraduate, online and distance learning degrees with verified eligibility criteria.
          </p>

          <div className="mt-4 max-w-xl flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 shadow-xs">
            <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search course by name (e.g. MBA, B.Tech, MCA, LLB)..."
              className="w-full bg-transparent text-xs sm:text-sm focus:outline-none text-slate-800 placeholder-slate-400"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="flex items-center space-x-2 pb-6">
          <button
            onClick={() => setSelectedLevel('')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold ${selectedLevel === '' ? 'bg-[#1a56db] text-white' : 'bg-white text-slate-700 border border-gray-200'}`}
          >
            All Degrees
          </button>
          <button
            onClick={() => setSelectedLevel('UG')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold ${selectedLevel === 'UG' ? 'bg-[#1a56db] text-white' : 'bg-white text-slate-700 border border-gray-200'}`}
          >
            Undergraduate (UG)
          </button>
          <button
            onClick={() => setSelectedLevel('PG')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold ${selectedLevel === 'PG' ? 'bg-[#1a56db] text-white' : 'bg-white text-slate-700 border border-gray-200'}`}
          >
            Postgraduate (PG)
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {courses.map((c) => (
            <Link
              to={`/courses/${c.slug}`}
              key={c.id}
              className="bg-white rounded-xl border border-gray-100 p-5 shadow-xs hover-lift hover:border-blue-200 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-[#1a56db]">
                    {c.level || 'Degree'}
                  </span>
                  <span className="text-[10px] text-slate-400">{c.durationMonths ? `${c.durationMonths / 12} Yrs` : '3-4 Yrs'}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">{c.name}</h3>
                <p className="text-[11px] text-slate-500 line-clamp-2">
                  {c.overview || `Recognized higher education program offering comprehensive training and placement opportunities.`}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-50 flex items-center justify-between mt-4">
                <span className="text-xs font-semibold text-[#1a56db] flex items-center space-x-1">
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
                <button
                  onClick={(e) => { e.preventDefault(); setCounsellingModalOpen(true); }}
                  className="text-[11px] bg-gray-100 hover:bg-blue-50 hover:text-blue-600 px-2.5 py-1 rounded font-medium"
                >
                  Enquire
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
      <CounsellingModal />
      <AuthModal />
      <CityModal />
    </div>
  );
};

export default CoursesPage;
