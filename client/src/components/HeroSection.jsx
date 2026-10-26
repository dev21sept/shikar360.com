import React, { useState, useEffect } from 'react';
import { Search, Building2, GraduationCap, BookOpen, Users, ChevronLeft, ChevronRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { HERO_STATS, POPULAR_SEARCHES } from '../data/mockData';

const SLIDES = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&auto=format&fit=crop&q=80',
    tagline: 'Empowering Millions of Ambitions',
    subtitle: 'Direct Admissions & Guidance across 2,500+ Verified Colleges',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920&auto=format&fit=crop&q=80',
    tagline: 'UGC, AICTE & NAAC A++ Accredited',
    subtitle: 'Transparent fee structures, genuine cutoffs, and verified placement stats',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&auto=format&fit=crop&q=80',
    tagline: 'Global MBBS & Overseas Study Abroad',
    subtitle: 'Study in top medical and engineering universities in Russia, UK, USA & Canada',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1920&auto=format&fit=crop&q=80',
    tagline: '100% Free Expert Counselling',
    subtitle: 'Get 1-on-1 personalized mentorship from certified education experts',
  }
];

export default function HeroSection({ onSearchSubmit, onSelectPopularSearch, onOpenCounselling }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Auto-play slider
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
  };

  const suggestions = [
    { title: 'Indian Institute of Technology (IIT Bombay)', category: 'College' },
    { title: 'Master of Business Administration (MBA)', category: 'Course' },
    { title: 'Bachelor of Technology (B.Tech Computer Science)', category: 'Course' },
    { title: 'MBBS in Russia (Bashkir State Medical Univ)', category: 'Medical Abroad' },
    { title: 'Vellore Institute of Technology (VIT)', category: 'University' },
  ].filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearchSubmit) onSearchSubmit(searchQuery);
  };

  const statIcons = [
    <Building2 className="w-5 h-5 text-sky-400" />,
    <GraduationCap className="w-5 h-5 text-amber-400" />,
    <BookOpen className="w-5 h-5 text-emerald-400" />,
    <Users className="w-5 h-5 text-purple-400" />
  ];

  return (
    <section
      className="relative min-h-[640px] lg:min-h-[700px] flex items-center justify-center overflow-hidden bg-slate-950 py-16 lg:py-24"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image Carousel Slides */}
      {SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
          }`}
          style={{ transitionProperty: 'opacity, transform', transitionDuration: '1000ms' }}
        >
          <img
            src={slide.image}
            alt={slide.tagline}
            className="w-full h-full object-cover object-center"
          />
        </div>
      ))}

      {/* Dark Luxury Gradient Overlay for crisp text contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/92 via-slate-950/80 to-slate-900/65 z-10 backdrop-blur-[1px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50 z-10" />

      {/* Hero Foreground Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-3xl space-y-6">
          
          {/* Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{SLIDES[currentSlide].tagline}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
          </div>

          {/* Main H1 Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black text-white tracking-tight leading-[1.12]">
            India's Education Discovery & <span className="text-[#60a5fa]">Admission</span> <span className="text-[#fb923c]">Platform</span>
          </h1>

          {/* Subtext */}
          <p className="text-base sm:text-xl text-slate-200 font-normal leading-relaxed max-w-2xl">
            Search, compare and choose the best colleges, universities and courses to build your future with <span className="font-bold text-white">Shikhar360</span>.
          </p>

          {/* Search Bar Form */}
          <div className="relative max-w-2xl pt-2">
            <form onSubmit={handleSearch} className="relative flex items-center shadow-2xl rounded-2xl bg-white border-2 border-white/30 focus-within:border-sky-400 transition-colors p-1.5">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search course, college, university or country..."
                className="w-full px-4 py-3 text-slate-800 placeholder-slate-400 text-sm sm:text-base font-medium focus:outline-hidden bg-transparent"
              />
              <button
                type="submit"
                className="shrink-0 flex items-center justify-center w-12 h-12 bg-[#1a56db] hover:bg-[#1e429f] text-white rounded-xl shadow-md transition-all cursor-pointer"
                title="Search on Shikhar360"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>

            {/* Live Autocomplete Suggestions */}
            {showSuggestions && searchQuery.trim().length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden divide-y divide-slate-100 text-slate-800">
                {suggestions.length > 0 ? (
                  suggestions.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => { setSearchQuery(item.title); setShowSuggestions(false); }}
                      className="px-4 py-3 hover:bg-blue-50/80 cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <span className="text-sm font-semibold">{item.title}</span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase tracking-wider">{item.category}</span>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-slate-500">
                    Press enter to search "{searchQuery}" across all categories
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Popular Searches */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-sm text-slate-300">
            <span className="font-bold text-white text-xs sm:text-sm">Popular Searches:</span>
            {POPULAR_SEARCHES.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSearchQuery(item);
                  if (onSelectPopularSearch) onSelectPopularSearch(item);
                }}
                className="text-slate-200 hover:text-white hover:bg-white/20 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/10 backdrop-blur-md border border-white/15 transition-all cursor-pointer"
              >
                {item}
              </button>
            ))}
          </div>

          {/* Quick CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onOpenCounselling}
              className="px-6 py-3 bg-[#f97316] hover:bg-[#ea580c] text-white font-bold rounded-xl text-sm shadow-xl transition-all duration-200 flex items-center gap-2 cursor-pointer hover:scale-105"
            >
              <span>Get Free Counselling</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
            <a
              href="#compare"
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-sm backdrop-blur-md border border-white/20 transition-all cursor-pointer"
            >
              Compare Colleges
            </a>
          </div>

          {/* Stats Row in Glassmorphic Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-6 border-t border-white/15">
            {HERO_STATS.map((stat, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                <div className="p-2 rounded-xl bg-white/15 shrink-0">
                  {statIcons[i]}
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-black text-white leading-tight">
                    {stat.count}
                  </div>
                  <div className="text-[11px] font-medium text-slate-300">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Carousel Slider Arrows */}
      <button
        type="button"
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer"
        title="Previous background slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer"
        title="Next background slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Slider Progress Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentSlide(idx)}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              idx === currentSlide ? 'w-8 bg-[#f97316]' : 'w-2 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
