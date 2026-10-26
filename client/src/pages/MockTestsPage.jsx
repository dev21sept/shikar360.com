import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppTab from '../components/WhatsAppTab';
import CounsellingModal from '../components/CounsellingModal';
import AuthModal from '../components/AuthModal';
import CityModal from '../components/CityModal';
import { ClipboardList, Clock, Hash, ChevronRight } from 'lucide-react';
import { getMockTests } from '../services/api';

const MockTestsPage = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    setLoading(true);
    const res = await getMockTests();
    if (res && res.success) {
      setTests(res.tests || []);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col font-sans">
      <Header />
      <WhatsAppTab />

      <div className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">Mock Tests</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Practice with timed mock tests, get instant scoring, and review detailed explanations.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {loading ? (
          <div className="text-center text-sm text-slate-400 py-16">Loading mock tests...</div>
        ) : tests.length === 0 ? (
          <div className="text-center text-sm text-slate-400 py-16">No mock tests available yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tests.map((t, idx) => (
              <div
                key={t.id}
                style={{ animationDelay: `${idx * 60}ms` }}
                className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs hover-lift animate-fadeIn flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-3">
                    <ClipboardList className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1.5">{t.title}</h3>
                  <p className="text-[11px] text-slate-500 mb-3 line-clamp-2">{t.description}</p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{t.durationMinutes} min</span>
                    <span className="flex items-center gap-1"><Hash className="w-3.5 h-3.5" />{t.questionCount} questions</span>
                  </div>
                </div>
                <Link
                  to={`/mock-tests/${t.id}`}
                  className="mt-4 w-full py-2.5 bg-[#1a56db] hover:bg-[#1e429f] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
                >
                  Start Test
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
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

export default MockTestsPage;
