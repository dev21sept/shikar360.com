import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppTab from '../components/WhatsAppTab';
import CounsellingModal from '../components/CounsellingModal';
import AuthModal from '../components/AuthModal';
import CityModal from '../components/CityModal';
import { MessageSquare, Eye, Send, BadgeCheck, ArrowLeft } from 'lucide-react';
import { getQuestionById, postAnswer } from '../services/api';
import { useAuth } from '../context/AuthContext';

const QuestionDetailPage = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answerBody, setAnswerBody] = useState('');
  const [posting, setPosting] = useState(false);
  const { user, setAuthModalOpen } = useAuth();

  useEffect(() => {
    fetchQuestion();
  }, [id]);

  const fetchQuestion = async () => {
    setLoading(true);
    const res = await getQuestionById(id);
    if (res && res.success && res.question) {
      setQuestion(res.question);
    }
    setLoading(false);
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    if (!answerBody.trim()) return;
    setPosting(true);
    const res = await postAnswer(id, answerBody);
    setPosting(false);
    if (res.success) {
      setAnswerBody('');
      fetchQuestion();
    } else {
      alert(res.message || 'Failed to post answer');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center text-sm text-slate-400">Loading question...</div>
        <Footer />
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Question Not Found</h2>
          <Link to="/qna" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold">Back to Q&amp;A</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col font-sans">
      <Header />
      <WhatsAppTab />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <Link to="/qna" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#1a56db] mb-4">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Q&amp;A
        </Link>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm animate-fadeIn mb-6">
          <h1 className="text-lg sm:text-xl font-black text-slate-900 mb-2">{question.title}</h1>
          {question.body && <p className="text-sm text-slate-600 leading-relaxed mb-4">{question.body}</p>}
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-gray-50">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" />
                {question.answers?.length || 0} Answers
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {question.viewCount || 0} Views
              </span>
            </div>
            <span className="font-medium">Asked by {question.author?.fullName || 'Anonymous'}</span>
          </div>
        </div>

        <h3 className="text-sm font-bold text-slate-900 mb-3">{question.answers?.length || 0} Answers</h3>
        <div className="space-y-4 mb-6">
          {(question.answers || []).map((a) => (
            <div key={a.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
              <p className="text-sm text-slate-700 leading-relaxed mb-3">{a.body}</p>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                {a.isExpertAnswer && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                    <BadgeCheck className="w-3 h-3" />
                    Expert Answer
                  </span>
                )}
                <span className="font-medium">— {a.author?.fullName || 'Shikhar360 Counsellor'}</span>
              </div>
            </div>
          ))}
          {(!question.answers || question.answers.length === 0) && (
            <p className="text-xs text-slate-400 py-4">No answers yet. Be the first to help!</p>
          )}
        </div>

        <form onSubmit={handleSubmitAnswer} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Your Answer</h3>
          <textarea
            rows={3}
            value={answerBody}
            onChange={(e) => setAnswerBody(e.target.value)}
            placeholder={user ? 'Share your knowledge...' : 'Log in to answer this question'}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#1a56db] focus:outline-hidden"
          />
          <button
            type="submit"
            disabled={posting}
            className="px-5 py-2.5 bg-[#1a56db] hover:bg-[#1e429f] disabled:opacity-60 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            {posting ? 'Posting...' : (user ? 'Post Answer' : 'Login to Answer')}
          </button>
        </form>
      </div>

      <Footer />
      <CounsellingModal />
      <AuthModal />
      <CityModal />
    </div>
  );
};

export default QuestionDetailPage;
