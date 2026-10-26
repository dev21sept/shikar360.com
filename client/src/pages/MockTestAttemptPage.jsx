import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppTab from '../components/WhatsAppTab';
import CounsellingModal from '../components/CounsellingModal';
import AuthModal from '../components/AuthModal';
import CityModal from '../components/CityModal';
import { Clock, CheckCircle2, XCircle, MinusCircle, ArrowLeft } from 'lucide-react';
import { getMockTestForAttempt, submitMockAttempt } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MockTestAttemptPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, setAuthModalOpen } = useAuth();

  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const startedAtRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!user) {
      setAuthModalOpen(true);
      navigate('/mock-tests');
      return;
    }
    fetchTest();
    return () => clearInterval(timerRef.current);
  }, [id]);

  const fetchTest = async () => {
    setLoading(true);
    const res = await getMockTestForAttempt(id);
    if (res && res.success && res.test) {
      setTest(res.test);
      setSecondsLeft(res.test.durationMinutes * 60);
      startedAtRef.current = new Date().toISOString();
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSubmit(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    setLoading(false);
  };

  const handleSelect = (questionId, optionIndex) => {
    setAnswers({ ...answers, [questionId]: optionIndex });
  };

  const handleSubmit = async (auto = false) => {
    if (submitting || result) return;
    if (!auto && !window.confirm('Submit the test? You cannot change answers after submitting.')) return;
    clearInterval(timerRef.current);
    setSubmitting(true);
    const res = await submitMockAttempt(id, answers, startedAtRef.current);
    setSubmitting(false);
    if (res.success) {
      setResult(res);
    } else {
      alert(res.message || 'Failed to submit attempt');
    }
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center text-sm text-slate-400">Loading test...</div>
        <Footer />
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Test Not Found</h2>
          <Link to="/mock-tests" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold">Browse Mock Tests</Link>
        </div>
        <Footer />
      </div>
    );
  }

  // ============ Result / Review screen ============
  if (result) {
    return (
      <div className="min-h-screen bg-[#f8f9fb] flex flex-col font-sans">
        <Header />
        <WhatsAppTab />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 text-center mb-6 animate-fadeIn">
            <h2 className="text-lg font-bold text-slate-900 mb-1">{test.title} — Result</h2>
            <div className="text-4xl font-black text-[#1a56db] my-4">
              {result.attempt.score} <span className="text-lg text-slate-400">/ {result.attempt.maxScore}</span>
            </div>
            <div className="flex items-center justify-center gap-6 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-600 font-bold"><CheckCircle2 className="w-4 h-4" />{result.attempt.correctCount} Correct</span>
              <span className="flex items-center gap-1.5 text-rose-600 font-bold"><XCircle className="w-4 h-4" />{result.attempt.wrongCount} Wrong</span>
              <span className="flex items-center gap-1.5 text-slate-400 font-bold"><MinusCircle className="w-4 h-4" />{result.attempt.unattemptedCount} Skipped</span>
            </div>
          </div>

          <h3 className="text-sm font-bold text-slate-900 mb-3">Answer Review</h3>
          <div className="space-y-4">
            {result.review.map((q, idx) => (
              <div key={q.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
                <p className="text-xs font-bold text-slate-900 mb-3">{idx + 1}. {q.text}</p>
                <div className="space-y-1.5">
                  {q.options.map((opt, oIdx) => {
                    const isCorrect = oIdx === q.correctIndex;
                    const isSelected = oIdx === q.selectedIndex;
                    return (
                      <div
                        key={oIdx}
                        className={`px-3 py-2 rounded-lg text-xs border ${
                          isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-semibold' :
                          isSelected ? 'bg-rose-50 border-rose-200 text-rose-800 font-semibold' :
                          'border-gray-100 text-slate-600'
                        }`}
                      >
                        {opt} {isCorrect && '✓'} {isSelected && !isCorrect && '✗'}
                      </div>
                    );
                  })}
                </div>
                {q.explanation && (
                  <p className="text-[11px] text-slate-500 mt-3 pt-3 border-t border-gray-50 italic">{q.explanation}</p>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-3 mt-6">
            <Link to="/mock-tests" className="px-5 py-2.5 bg-[#1a56db] text-white text-xs font-bold rounded-xl">
              More Mock Tests
            </Link>
          </div>
        </div>
        <Footer />
        <CounsellingModal />
        <AuthModal />
        <CityModal />
      </div>
    );
  }

  // ============ Test-taking screen ============
  const q = test.questions[currentQ];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col font-sans">
      <Header />

      <div className="bg-white border-b border-gray-100 sticky top-18 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <h1 className="text-sm font-bold text-slate-900 truncate">{test.title}</h1>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${secondsLeft < 60 ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-700'}`}>
            <Clock className="w-3.5 h-3.5" />
            {formatTime(secondsLeft)}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 mb-2">Question {currentQ + 1} of {test.questions.length}</div>
          <h2 className="text-sm font-bold text-slate-900 mb-5">{q.text}</h2>

          <div className="space-y-2.5">
            {q.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(q.id, idx)}
                className={`w-full text-left px-4 py-3 rounded-xl border text-xs font-semibold transition-all ${
                  answers[q.id] === idx
                    ? 'border-[#1a56db] bg-blue-50 text-[#1a56db]'
                    : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/40 text-slate-700'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50">
            <button
              onClick={() => setCurrentQ((p) => Math.max(0, p - 1))}
              disabled={currentQ === 0}
              className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 disabled:opacity-40 hover:bg-gray-50"
            >
              Previous
            </button>
            {currentQ < test.questions.length - 1 ? (
              <button
                onClick={() => setCurrentQ((p) => Math.min(test.questions.length - 1, p + 1))}
                className="px-5 py-2 rounded-lg text-xs font-bold bg-[#1a56db] text-white hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                onClick={() => handleSubmit(false)}
                disabled={submitting}
                className="px-5 py-2 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                {submitting ? 'Submitting...' : 'Submit Test'}
              </button>
            )}
          </div>
        </div>

        {/* Question navigator sidebar */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm h-fit">
          <div className="text-xs font-bold text-slate-700 mb-3">
            {answeredCount} / {test.questions.length} Answered
          </div>
          <div className="grid grid-cols-5 gap-2">
            {test.questions.map((qq, idx) => (
              <button
                key={qq.id}
                onClick={() => setCurrentQ(idx)}
                className={`w-9 h-9 rounded-lg text-xs font-bold flex items-center justify-center ${
                  idx === currentQ ? 'bg-slate-900 text-white' :
                  answers[qq.id] !== undefined ? 'bg-emerald-100 text-emerald-700' :
                  'bg-gray-100 text-slate-500'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => handleSubmit(false)}
            disabled={submitting}
            className="w-full mt-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-xl disabled:opacity-60"
          >
            Submit Early
          </button>
        </div>
      </div>

      <Footer />
      <CounsellingModal />
      <AuthModal />
      <CityModal />
    </div>
  );
};

export default MockTestAttemptPage;
