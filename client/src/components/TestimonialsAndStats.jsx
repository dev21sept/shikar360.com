import React, { useState } from 'react';
import { Star, Quote, ArrowRight, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { TESTIMONIALS, TRUST_STATS } from '../data/mockData';

export default function TestimonialsAndStats() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  const current = TESTIMONIALS[currentIndex];

  return (
    <section id="reviews" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left Column: What Students Say Testimonial Carousel */}
          <div className="lg:col-span-7 bg-[#f8f9fb] p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <Quote className="absolute right-6 top-6 w-20 h-20 text-slate-200/70 -z-0 pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1a56db]">Real Stories</span>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">What Students Say</h3>
                </div>
                <a href="#reviews" className="text-xs font-bold text-[#1a56db] hover:underline flex items-center gap-1">
                  View All Reviews <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Active Testimonial Card */}
              <div className="bg-white p-6 sm:p-7 rounded-2xl shadow-sm border border-slate-200/80 mb-6">
                {/* Star Rating */}
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {[...Array(current.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-base sm:text-lg text-slate-700 font-medium italic leading-relaxed mb-6">
                  "{current.quote}"
                </p>

                {/* Author Avatar & Info */}
                <div className="flex items-center gap-3.5 pt-4 border-t border-slate-100">
                  <img
                    src={current.avatar}
                    alt={current.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#1a56db]"
                  />
                  <div>
                    <h5 className="text-sm font-black text-slate-900">{current.name}</h5>
                    <p className="text-xs text-slate-500">{current.university}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                {TESTIMONIALS.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      idx === currentIndex ? 'w-8 bg-[#1a56db]' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prevTestimonial}
                  className="p-2 rounded-xl bg-white border border-slate-200 shadow-xs hover:bg-slate-100 text-slate-700 cursor-pointer"
                  title="Previous testimonial"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={nextTestimonial}
                  className="p-2 rounded-xl bg-white border border-slate-200 shadow-xs hover:bg-slate-100 text-slate-700 cursor-pointer"
                  title="Next testimonial"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Trusted by Thousands 2x2 Stat Grid */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#111c44] to-[#0b1329] p-8 sm:p-10 rounded-3xl text-white shadow-xl flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-400/30">
                <CheckCircle className="w-3.5 h-3.5" />
                Proven Track Record
              </div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight mb-2">
                Trusted By Thousands Of Students & Parents
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-8">
                From undergraduate admissions to global medical programs, Shikhar360 powers life-defining academic journeys.
              </p>
            </div>

            {/* 2x2 Stat Grid */}
            <div className="grid grid-cols-2 gap-4">
              {TRUST_STATS.map((stat, i) => (
                <div key={i} className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15">
                  <div className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-300 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
