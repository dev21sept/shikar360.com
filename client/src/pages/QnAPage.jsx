import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppTab from '../components/WhatsAppTab';
import CounsellingModal from '../components/CounsellingModal';
import AuthModal from '../components/AuthModal';
import CityModal from '../components/CityModal';
import { Search, MessageSquare, Eye, CheckCircle2, Send } from 'lucide-react';
import { getQuestions, postQuestion } from '../services/api';
import { useAuth } from '../context/AuthContext';

const QnAPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [askOpen, setAskOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [posting, setPosting] = useState(false);
  const { user, setAuthModalOpen } = useAuth();

  useEffect(() => {
    fetchQuestions();
  }, [searchTerm]);

  const fetchQuestions = async () => {
    setLoading(true);
    const params = {};
    if (searchTerm) params.search = searchTerm;
    const res = await getQuestions(params);
    if (res && res.success) {
      setQuestions(res.questions || []);
    }
    setLoading(false);
  };

  const handleAskClick = () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    setAskOpen(true);
  };

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setPosting(true);
    const res = await postQuestion({ title, body });
    setPosting(false);
    if (res.success) {
      setTitle('');
      setBody('');
      setAskOpen(false);
      fetchQuestions();
    } else {
      alert(res.message || 'Failed to post question');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col font-sans">
      <Header />
      <WhatsAppTab />

      <div className="bg-gradient-to-r from-[#0b1c48] to-[#1a56db] text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">Student Q&amp;A Community</h1>
          <p className="text-xs sm:text-sm text-blue-100 max-w-2xl mb-5">
            Ask admission, cutoff and career questions. Get answers from counsellors and fellow students.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
            <div className="flex-1 flex items-center bg-white rounded-xl px-3 py-2.5 shadow-lg">
              <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search questions..."
                className="w-full bg-transparent text-xs sm:text-sm focus:outline-none text-slate-800 placeholder-slate-400"
              />
            </div>
            <button
              onClick={handleAskClick}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs sm:text-sm rounded-xl shadow-lg whitespace-nowrap"
            >
              Ask a Question
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {askOpen && (
          <form onSubmit={handleSubmitQuestion} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6 animate-fadeIn space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Ask the Community</h3>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Question title (e.g. What is a good JEE percentile for NIT?)"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#1a56db] focus:outline-hidden"
            />
            <textarea
              rows={3}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Add more details (optional)"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#1a56db] focus:outline-hidden"
            />
            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={posting}
                className="px-5 py-2.5 bg-[#1a56db] hover:bg-[#1e429f] disabled:opacity-60 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                {posting ? 'Posting...' : 'Post Question'}
              </button>
              <button
                type="button"
                onClick={() => setAskOpen(false)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="text-center text-sm text-slate-400 py-16">Loading questions...</div>
        ) : questions.length === 0 ? (
          <div className="text-center text-sm text-slate-400 py-16">No questions yet. Be the first to ask!</div>
        ) : (
          <div className="space-y-4">
            {questions.map((q, idx) => (
              <Link
                to={`/qna/${q.id}`}
                key={q.id}
                style={{ animationDelay: `${idx * 50}ms` }}
                className="block bg-white rounded-2xl border border-gray-100 p-5 shadow-xs hover-lift animate-fadeIn"
              >
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">{q.title}</h3>
                {q.body && <p className="text-xs text-slate-500 line-clamp-2 mb-3">{q.body}</p>}
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      {q.answers?.length || 0} Answers
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {q.viewCount || 0} Views
                    </span>
                  </div>
                  <span className="font-medium text-slate-500">Asked by {q.author?.fullName || 'Anonymous'}</span>
                </div>
              </Link>
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

export default QnAPage;
