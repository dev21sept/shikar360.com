import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppTab from '../components/WhatsAppTab';
import CounsellingModal from '../components/CounsellingModal';
import AuthModal from '../components/AuthModal';
import CityModal from '../components/CityModal';
import { Search, Calendar, User, ArrowRight } from 'lucide-react';
import { getArticles } from '../services/api';

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchArticles();
  }, [searchTerm]);

  const fetchArticles = async () => {
    setLoading(true);
    const params = {};
    if (searchTerm) params.search = searchTerm;
    const res = await getArticles(params);
    if (res && res.success) {
      setArticles(res.articles || []);
    }
    setLoading(false);
  };

  const formatDate = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col font-sans">
      <Header />
      <WhatsAppTab />

      <div className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
            Admission News &amp; Guidance Articles
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Stay updated with the latest exam dates, admission guidance, and education trends.
          </p>

          <div className="mt-4 max-w-xl flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 shadow-xs">
            <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search articles..."
              className="w-full bg-transparent text-xs sm:text-sm focus:outline-none text-slate-800 placeholder-slate-400"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {loading ? (
          <div className="text-center text-sm text-slate-400 py-16">Loading articles...</div>
        ) : articles.length === 0 ? (
          <div className="text-center text-sm text-slate-400 py-16">No articles found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((a, idx) => (
              <Link
                to={`/articles/${a.slug}`}
                key={a.id}
                style={{ animationDelay: `${idx * 60}ms` }}
                className="bg-white rounded-2xl border border-gray-100 shadow-xs hover-lift animate-fadeIn overflow-hidden flex flex-col"
              >
                {a.coverImageUrl && (
                  <img src={a.coverImageUrl} alt={a.title} className="w-full h-40 object-cover" />
                )}
                <div className="p-5 flex flex-col flex-1">
                  <span className="text-[10px] font-bold text-[#1a56db] uppercase tracking-wider mb-2">{a.category}</span>
                  <h3 className="text-sm font-bold text-slate-900 mb-2 leading-snug line-clamp-2">{a.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4 flex-1">{a.excerpt}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-gray-50">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" />{a.authorName}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(a.publishedAt)}</span>
                  </div>
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

export default ArticlesPage;
