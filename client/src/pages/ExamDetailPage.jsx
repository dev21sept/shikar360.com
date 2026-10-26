import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppTab from '../components/WhatsAppTab';
import CounsellingModal from '../components/CounsellingModal';
import AuthModal from '../components/AuthModal';
import CityModal from '../components/CityModal';
import { Calendar, Building2, ExternalLink, CheckCircle2, FileText, ListChecks } from 'lucide-react';
import { getExamBySlug } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ExamDetailPage = () => {
  const { slug } = useParams();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setCounsellingModalOpen } = useAuth();

  useEffect(() => {
    fetchExam();
  }, [slug]);

  const fetchExam = async () => {
    setLoading(true);
    const res = await getExamBySlug(slug);
    if (res && res.success && res.exam) {
      setExam(res.exam);
    }
    setLoading(false);
  };

  const formatDate = (d) => {
    if (!d) return 'TBA';
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center text-sm text-slate-400">Loading exam details...</div>
        <Footer />
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Exam Not Found</h2>
          <Link to="/exams" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold">Browse All Exams</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const infoBlocks = [
    { label: 'Overview', value: exam.overview, icon: FileText },
    { label: 'Eligibility', value: exam.eligibility, icon: CheckCircle2 },
    { label: 'Exam Pattern', value: exam.examPattern, icon: ListChecks },
    { label: 'Syllabus', value: exam.syllabus, icon: ListChecks },
  ].filter((b) => b.value);

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col font-sans">
      <Header />
      <WhatsAppTab />

      <div className="bg-white border-b border-gray-100 shadow-xs animate-fadeIn">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-[#1a56db] border border-blue-100">
                {exam.stream} • {exam.level}
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">{exam.name}</h1>
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                Conducted by {exam.conductingBody}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {exam.officialWebsite && (
                <a
                  href={exam.officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-slate-700 hover:bg-gray-50 flex items-center gap-1.5"
                >
                  Official Website
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <button
                onClick={() => setCounsellingModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-[#1a56db] text-white text-xs font-bold hover:bg-blue-700 shadow-xs"
              >
                Get Free Guidance
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {infoBlocks.map((block, idx) => (
            <div
              key={block.label}
              style={{ animationDelay: `${idx * 60}ms` }}
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs animate-fadeIn"
            >
              <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                <block.icon className="w-4 h-4 text-[#1a56db]" />
                {block.label}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{block.value}</p>
            </div>
          ))}
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs animate-fadeIn">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Important Dates</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-gray-50">
                <span className="text-slate-500">Application Start</span>
                <strong className="text-slate-800">{formatDate(exam.applicationStartDate)}</strong>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-gray-50">
                <span className="text-slate-500">Application End</span>
                <strong className="text-slate-800">{formatDate(exam.applicationEndDate)}</strong>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-gray-50">
                <span className="text-slate-500 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Exam Date</span>
                <strong className="text-slate-800">{formatDate(exam.examDate)}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Result Date</span>
                <strong className="text-slate-800">{formatDate(exam.resultDate)}</strong>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1a56db] to-[#111c44] rounded-2xl p-6 text-white shadow-lg animate-fadeIn">
            <h3 className="text-sm font-bold mb-2">Confused about eligible colleges?</h3>
            <p className="text-xs text-blue-100 mb-4">Talk to our counsellors for personalised guidance on {exam.shortName || exam.name} preparation and admissions.</p>
            <button
              onClick={() => setCounsellingModalOpen(true)}
              className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs rounded-xl"
            >
              Talk to an Expert
            </button>
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

export default ExamDetailPage;
