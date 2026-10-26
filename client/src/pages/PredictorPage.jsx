import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppTab from '../components/WhatsAppTab';
import CounsellingModal from '../components/CounsellingModal';
import AuthModal from '../components/AuthModal';
import CityModal from '../components/CityModal';
import { Target, Star, MapPin, Info, Sparkles } from 'lucide-react';
import { getExams, predictColleges } from '../services/api';
import { useAuth } from '../context/AuthContext';

const statusStyles = {
  'High Chance': { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', bar: 'bg-emerald-500', width: '85%' },
  'Moderate Chance': { badge: 'bg-amber-50 text-amber-700 border-amber-200', bar: 'bg-amber-500', width: '55%' },
  'Low Chance': { badge: 'bg-rose-50 text-rose-700 border-rose-200', bar: 'bg-rose-400', width: '25%' },
};

const PredictorPage = () => {
  const [exams, setExams] = useState([]);
  const [examSlug, setExamSlug] = useState('');
  const [rank, setRank] = useState('');
  const [category, setCategory] = useState('General');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setCounsellingModalOpen } = useAuth();

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    const res = await getExams();
    if (res && res.success) {
      setExams(res.exams || []);
      if (res.exams?.length > 0) setExamSlug(res.exams[0].slug);
    }
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    if (!examSlug || !rank) return;
    setLoading(true);
    const res = await predictColleges(examSlug, rank, category);
    setLoading(false);
    if (res.success) {
      setResults(res);
    } else {
      alert(res.message || 'Prediction failed. This exam may not have cutoff data loaded yet.');
      setResults(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col font-sans">
      <Header />
      <WhatsAppTab />

      <div className="bg-gradient-to-r from-[#0b1c48] to-[#1a56db] text-white py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-blue-200 text-xs font-bold uppercase tracking-wider mb-2">
            <Target className="w-4 h-4" />
            <span>College Predictor</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">Find Colleges You Can Get Into</h1>
          <p className="text-xs sm:text-sm text-blue-100 max-w-2xl">
            Enter your exam rank and category to see which colleges you have a realistic chance at, based on historical closing ranks.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <form onSubmit={handlePredict} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-8 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Exam</label>
              <select
                value={examSlug}
                onChange={(e) => setExamSlug(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#1a56db] focus:outline-hidden"
              >
                {exams.map((ex) => (
                  <option key={ex.id} value={ex.slug}>{ex.shortName || ex.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Your Rank</label>
              <input
                type="number"
                required
                min="1"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                placeholder="e.g. 12000"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#1a56db] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#1a56db] focus:outline-hidden"
              >
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="EWS">EWS</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full sm:w-auto px-8 py-3 bg-[#1a56db] hover:bg-[#1e429f] disabled:opacity-60 text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {loading ? 'Predicting...' : 'Predict My Colleges'}
          </button>
        </form>

        {results && (
          <div className="animate-fadeIn">
            <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl mb-5 text-[11px] text-blue-700">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Showing results for <strong>{results.exam.shortName}</strong>, Rank {results.rank}, {results.category} category.
                Predictions use indicative historical closing ranks and are not a guarantee of admission.
              </span>
            </div>

            {results.results.length === 0 ? (
              <div className="text-center text-sm text-slate-400 py-16 bg-white rounded-2xl border border-gray-100">
                No colleges found in your predicted range. Try a different rank or category, or explore all colleges.
              </div>
            ) : (
              <div className="space-y-4">
                {results.results.map((r, idx) => {
                  const style = statusStyles[r.status];
                  return (
                    <div
                      key={idx}
                      style={{ animationDelay: `${idx * 60}ms` }}
                      className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs hover-lift animate-fadeIn flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <img
                          src={r.college.logoUrl}
                          alt={r.college.name}
                          className="w-12 h-12 rounded-xl object-cover border border-gray-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <Link to={`/colleges/${r.college.slug}`} className="text-sm font-bold text-slate-900 hover:text-[#1a56db] truncate block">
                            {r.college.name}
                          </Link>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                            <MapPin className="w-3 h-3" />
                            <span>{r.college.city}, {r.college.state}</span>
                            <span>•</span>
                            <span>{r.course?.name}</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                            <div className={`h-full rounded-full ${style.bar}`} style={{ width: style.width }} />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <div className="text-[10px] text-slate-400">Closing Rank</div>
                          <div className="text-xs font-bold text-slate-800">{r.closingRank.toLocaleString('en-IN')}</div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${style.badge}`}>
                          {r.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-6 bg-gradient-to-br from-[#1a56db] to-[#111c44] rounded-2xl p-6 text-white text-center">
              <h3 className="text-sm font-bold mb-2">Want personalised help choosing the right college?</h3>
              <button
                onClick={() => setCounsellingModalOpen(true)}
                className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs rounded-xl"
              >
                Talk to a Counsellor
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

export default PredictorPage;
