import React from 'react';
import { Database, Scale, ShieldCheck, Bookmark, UserCheck, MessageSquare } from 'lucide-react';
import { WHY_CHOOSE_ITEMS } from '../data/mockData';

export default function WhyChooseUs() {
  const iconMap = {
    Database: <Database className="w-6 h-6 text-[#1a56db]" />,
    Scale: <Scale className="w-6 h-6 text-[#f97316]" />,
    ShieldCheck: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
    Bookmark: <Bookmark className="w-6 h-6 text-purple-600" />,
    UserCheck: <UserCheck className="w-6 h-6 text-indigo-600" />,
    MessageSquare: <MessageSquare className="w-6 h-6 text-teal-600" />
  };

  return (
    <section className="py-14 bg-[#f8f9fb] border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Centered Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Why Choose <span className="text-[#1a56db]">Shikhar</span><span className="text-[#f97316]">360</span>?
          </h2>
          <p className="mt-2 text-base text-slate-600">
            India's most transparent admission portal backed by verified data, authentic cutoffs, and 1-on-1 personal counselling.
          </p>
        </div>

        {/* 6-Column Icon Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {WHY_CHOOSE_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 text-center flex flex-col items-center group"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-3.5 group-hover:scale-110 transition-transform">
                {iconMap[item.icon]}
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1 leading-snug">
                {item.title}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                {item.subtitle}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
