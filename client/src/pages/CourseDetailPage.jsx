import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppTab from '../components/WhatsAppTab';
import CounsellingModal from '../components/CounsellingModal';
import AuthModal from '../components/AuthModal';
import CityModal from '../components/CityModal';
import { BookOpen, Clock, CheckCircle2, Building2, MapPin, Star, ChevronRight } from 'lucide-react';
import { getCourseBySlug } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CourseDetailPage = () => {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setCounsellingModalOpen } = useAuth();

  useEffect(() => {
    fetchCourse();
  }, [slug]);

  const fetchCourse = async () => {
    setLoading(true);
    const res = await getCourseBySlug(slug);
    if (res && res.success && res.course) {
      setCourse(res.course);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center text-sm text-slate-400">Loading course details...</div>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Course Not Found</h2>
          <p className="text-xs text-slate-500 mb-4">The course you are looking for does not exist.</p>
          <Link to="/courses" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold">Browse All Courses</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col font-sans">
      <Header />
      <WhatsAppTab />

      {/* Course Banner Header */}
      <div className="bg-white border-b border-gray-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                <BookOpen className="w-8 h-8 text-[#1a56db]" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900">{course.name}</h1>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-[#1a56db] border border-blue-100">
                    {course.level}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  {course.code && <span>Code: {course.code}</span>}
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    {course.durationMonths ? `${course.durationMonths / 12} Years` : 'Varies'}
                  </span>
                  {course.category && (
                    <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-medium">{course.category.name}</span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => setCounsellingModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-[#1a56db] hover:bg-[#1545b3] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
            >
              Get Free Counselling
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-4 animate-fadeIn">
              <h3 className="text-base font-bold text-slate-900">About {course.name}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {course.overview || `${course.name} is a recognized ${course.level} program offering comprehensive training, industry exposure, and placement opportunities across top institutions in India.`}
              </p>

              {course.eligibility && (
                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1a56db] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-slate-800 mb-0.5">Eligibility Criteria</p>
                    <p className="text-xs text-slate-600">{course.eligibility}</p>
                  </div>
                </div>
              )}

              {course.specializations?.length > 0 && (
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs font-bold text-slate-800 mb-2">Popular Specializations</p>
                  <div className="flex flex-wrap gap-2">
                    {course.specializations.map((s) => (
                      <span key={s.id} className="px-2.5 py-1 rounded-full bg-gray-100 text-slate-700 text-[11px] font-semibold">{s.name}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-4 animate-fadeIn">
              <h3 className="text-base font-bold text-slate-900">
                Colleges Offering {course.name} ({course.collegeOfferings?.length || 0})
              </h3>
              <div className="divide-y divide-gray-100">
                {(!course.collegeOfferings || course.collegeOfferings.length === 0) && (
                  <p className="text-xs text-slate-400">No colleges currently listed for this course.</p>
                )}
                {(course.collegeOfferings || []).map((offering) => (
                  <Link
                    key={offering.id}
                    to={`/colleges/${offering.college?.slug}`}
                    className="py-4 flex items-center justify-between gap-4 hover:bg-gray-50/60 -mx-2 px-2 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {offering.college?.logoUrl ? (
                        <img src={offering.college.logoUrl} alt={offering.college.name} className="w-10 h-10 rounded-xl object-cover border border-gray-200 shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center shrink-0">
                          {offering.college?.name?.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{offering.college?.name}</h4>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                          <MapPin className="w-3 h-3" />
                          {offering.college?.city}, {offering.college?.state}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400">Total Fee</div>
                        <div className="text-xs font-bold text-[#1a56db]">₹{Number(offering.totalFee || 0).toLocaleString('en-IN')}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-slate-900">Need Help Choosing a College?</h4>
              <p className="text-xs text-slate-500">
                Connect with our authorized counsellors for personalised guidance on {course.name} admissions.
              </p>
              <button
                onClick={() => setCounsellingModalOpen(true)}
                className="w-full py-3 bg-[#1a56db] hover:bg-[#1545b3] text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                Request Free Call Back
              </button>
              <Link
                to="/predictor"
                className="w-full py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center"
              >
                Try College Predictor
              </Link>
            </div>
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

export default CourseDetailPage;
