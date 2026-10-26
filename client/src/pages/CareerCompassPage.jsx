import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppTab from '../components/WhatsAppTab';
import CounsellingModal from '../components/CounsellingModal';
import AuthModal from '../components/AuthModal';
import CityModal from '../components/CityModal';
import { Compass, ChevronRight, ChevronLeft, Sparkles, RefreshCw } from 'lucide-react';
import { getCareerQuestions, submitCareerAssessment } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CareerCompassPage = () => {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { setCounsellingModalOpen } = useAuth();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    const res = await getCareerQuestions();
    if (res && res.success) {
      setQuestions(res.questions || []);
    }
  };

  const handleSelect = (optionIndex) => {
    const qId = questions[current].id;
    const updated = { ...answers, [qId]: optionIndex };
    setAnswers(updated);

    if (current < questions.length - 1) {
      setTimeout(() => setCurrent(current + 1), 250);
    } else {
      setTimeout(() => handleSubmit(updated), 250);
    }
  };

  const handleSubmit = async (finalAnswers) => {
    setSubmitting(true);
    const res = await submitCareerAssessment(finalAnswers);
    setSubmitting(false);
    if (res.success) {
      setResult(res.assessment);
    } else {
      alert(res.message || 'Failed to process assessment');
    }
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrent(0);
    setResult(null);
  };

  const progress = questions.length > 0 ? ((current) / questions.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col font-sans">
      <Header />
      <WhatsAppTab />

      <div className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-purple-200 text-xs font-bold uppercase tracking-wider mb-2">
            <Compass className="w-4 h-4" />
            <span>Career Compass</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">Find the Career That Fits You</h1>
          <p className="text-xs sm:text-sm text-purple-100">
            Answer 5 quick questions and get a personalised stream recommendation with suggested courses.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {!result ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 animate-fadeIn">
            {questions.length === 0 ? (
              <div className="text-center text-sm text-slate-400 py-10">Loading questions...</div>
            ) : (
              <>
                <div className="w-full h-1.5 bg-slate-100 rounded-full mb-6 overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
                <div className="text-[11px] font-bold text-purple-600 uppercase tracking-wider mb-2">
                  Question {current + 1} of {questions.length}
                </div>
                <h2 className="text-lg font-bold text-slate-900 mb-6">{questions[current].text}</h2>

                <div className="space-y-3">
                  {questions[current].options.map((opt) => (
                    <button
                      key={opt.index}
                      onClick={() => handleSelect(opt.index)}
                      className={`w-full text-left px-4 py-3.5 rounded-xl border text-sm font-semibold transition-all flex items-center justify-between group ${
                        answers[questions[current].id] === opt.index
                          ? 'border-purple-500 bg-purple-50 text-purple-800'
                          : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50 text-slate-700'
                      }`}
                    >
                      <span>{opt.label}</span>
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>

                {current > 0 && (
                  <button
                    onClick={() => setCurrent(current - 1)}
                    className="mt-6 flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-600"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    Previous Question
                  </button>
                )}

                {submitting && (
                  <div className="mt-4 text-xs text-slate-400 text-center">Analysing your answers...</div>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">Your Recommended Stream</p>
            <h2 className="text-2xl font-black text-slate-900 mb-3">{result.title}</h2>
            <p className="text-sm text-slate-600 leading-relaxed max-w-lg mx-auto mb-6">{result.description}</p>

            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
              {result.courses.map((c) => (
                <span key={c} className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">{c}</span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to={`/colleges?category=${result.categorySlug}`}
                className="px-6 py-3 bg-[#1a56db] hover:bg-[#1e429f] text-white font-bold text-sm rounded-xl shadow-md"
              >
                Explore Colleges
              </Link>
              <button
                onClick={() => setCounsellingModalOpen(true)}
                className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-sm rounded-xl"
              >
                Talk to a Counsellor
              </button>
              <button
                onClick={handleRestart}
                className="flex items-center gap-1.5 px-4 py-3 text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retake Assessment
              </button>
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

export default CareerCompassPage;
