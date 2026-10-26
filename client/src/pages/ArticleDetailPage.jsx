import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppTab from '../components/WhatsAppTab';
import CounsellingModal from '../components/CounsellingModal';
import AuthModal from '../components/AuthModal';
import CityModal from '../components/CityModal';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { getArticleBySlug } from '../services/api';

const ArticleDetailPage = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  const fetchArticle = async () => {
    setLoading(true);
    const res = await getArticleBySlug(slug);
    if (res && res.success && res.article) {
      setArticle(res.article);
    }
    setLoading(false);
  };

  const formatDate = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center text-sm text-slate-400">Loading article...</div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Article Not Found</h2>
          <Link to="/articles" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold">Browse All Articles</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col font-sans">
      <Header />
      <WhatsAppTab />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <Link to="/articles" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#1a56db] mb-4">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Articles
        </Link>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fadeIn">
          {article.coverImageUrl && (
            <img src={article.coverImageUrl} alt={article.title} className="w-full h-56 sm:h-72 object-cover" />
          )}
          <div className="p-6 sm:p-8">
            <span className="text-[10px] font-bold text-[#1a56db] uppercase tracking-wider">{article.category}</span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 mb-3 leading-snug">{article.title}</h1>
            <div className="flex items-center gap-4 text-[11px] text-slate-400 pb-5 mb-5 border-b border-gray-100">
              <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{article.authorName}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{formatDate(article.publishedAt)}</span>
            </div>
            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {article.content}
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

export default ArticleDetailPage;
