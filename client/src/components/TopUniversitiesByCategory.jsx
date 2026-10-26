import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Star, MapPin, Award, ExternalLink } from 'lucide-react';
import { CATEGORY_TABS, UNIVERSITIES_BY_CATEGORY } from '../data/mockData';

export default function TopUniversitiesByCategory({ onSelectUniversity }) {
  const [activeTab, setActiveTab] = useState('Engineering');
  const scrollContainerRef = useRef(null);

  const universities = UNIVERSITIES_BY_CATEGORY[activeTab] || UNIVERSITIES_BY_CATEGORY['Engineering'];

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="universities" className="py-16 bg-[#f8f9fb] border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/70 text-[#1a56db] text-xs font-bold mb-2">
              <Award className="w-3.5 h-3.5" />
              Verified & UGC/AICTE Recognized
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Top Universities By Category
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Explore leading institutions, cutoffs, fee structures, and placement statistics.
            </p>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll('left')}
              className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
              title="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
              title="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Pill Tab Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 hide-scrollbar">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer shadow-xs ${
                activeTab === tab
                  ? 'bg-[#1a56db] text-white shadow-blue-200'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/90'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Scrollable Card Carousel */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-4 pt-1 hide-scrollbar snap-x snap-mandatory"
        >
          {universities.map((uni) => (
            <div
              key={uni.id}
              className="min-w-[280px] sm:min-w-[320px] max-w-[320px] bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between p-5 snap-start group hover:-translate-y-1"
            >
              <div>
                {/* Header: Logo + Tag */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform">
                    {uni.icon}
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-[#1a56db] border border-blue-100">
                    {uni.tag}
                  </span>
                </div>

                {/* University Name */}
                <h4 className="text-lg font-black text-slate-900 group-hover:text-[#1a56db] transition-colors leading-snug mb-2 line-clamp-2">
                  {uni.name}
                </h4>

                {/* Location */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{uni.location}</span>
                </div>

                {/* Star Rating + Reviews */}
                <div className="flex items-center gap-2 mb-4 bg-slate-50 p-2.5 rounded-xl">
                  <div className="flex items-center text-amber-500 font-bold text-sm">
                    <Star className="w-4 h-4 fill-current mr-1" />
                    {uni.rating}
                  </div>
                  <span className="text-xs text-slate-400">|</span>
                  <span className="text-xs text-slate-500 font-medium">({uni.reviews} reviews)</span>
                  <span className="ml-auto text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {uni.fees}
                  </span>
                </div>
              </div>

              {/* View Details Link */}
              <button
                type="button"
                onClick={() => onSelectUniversity && onSelectUniversity(uni)}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold border border-slate-200 hover:border-[#1a56db] hover:bg-[#1a56db] hover:text-white text-slate-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span>View Details & Cutoffs</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
