import React, { useState } from 'react';
import { ArrowRight, Star, X, PlusCircle, Check } from 'lucide-react';
import { COURSES_GRID, DEFAULT_COMPARE_COLLEGES } from '../data/mockData';

export default function ExploreCoursesAndCompare({ onOpenCompareModal, onSelectCourse }) {
  const [selectedColleges, setSelectedColleges] = useState(DEFAULT_COMPARE_COLLEGES);

  const removeCollege = (id) => {
    setSelectedColleges(prev => prev.filter(item => item.id !== id));
  };

  const clearAll = () => {
    setSelectedColleges([]);
  };

  return (
    <section id="courses" className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Explore Top Courses (3x5 grid) */}
          <div className="lg:col-span-7 bg-[#f8f9fb] p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Explore Top Courses</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Popular degrees, diplomas & professional certifications</p>
                </div>
                <a href="#courses" className="text-sm font-bold text-[#1a56db] hover:text-[#1e429f] flex items-center gap-1 group">
                  View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              {/* 3x5 Course Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {COURSES_GRID.map((course, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onSelectCourse && onSelectCourse(course.name)}
                    className={`p-3.5 rounded-xl text-left border transition-all duration-200 cursor-pointer flex flex-col justify-between h-24 ${
                      course.isLink
                        ? 'bg-blue-50/80 border-blue-200 hover:bg-blue-100/80 text-[#1a56db] justify-center items-center text-center font-bold'
                        : 'bg-white border-slate-200/80 hover:border-[#1a56db] hover:shadow-md'
                    }`}
                  >
                    {course.isLink ? (
                      <span className="text-sm font-bold text-[#1a56db] flex items-center gap-1">
                        {course.name}
                      </span>
                    ) : (
                      <>
                        <div className="flex items-start justify-between">
                          <span className="text-sm font-extrabold text-slate-900 group-hover:text-[#1a56db]">
                            {course.name}
                          </span>
                          {course.popular && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-orange-100 text-[#ea580c] rounded-md">
                              Hot
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                          <span>{course.tag}</span>
                          <span className="font-medium text-slate-400">{course.duration}</span>
                        </div>
                      </>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Compare Colleges / Universities */}
          <div id="compare" className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Compare Colleges / Universities</h3>
                <a href="#compare" onClick={onOpenCompareModal} className="text-sm font-bold text-[#1a56db] hover:text-[#1e429f]">
                  View All
                </a>
              </div>
              <p className="text-xs text-slate-500 mb-6">
                Choose 2 to 4 colleges/universities to compare fees, placement & ranking side-by-side.
              </p>

              {/* Selected Colleges Mini-Cards */}
              <div className="space-y-3.5 mb-5">
                {selectedColleges.length > 0 ? (
                  selectedColleges.map((col) => (
                    <div
                      key={col.id}
                      className="p-3.5 rounded-2xl bg-[#f8f9fb] border border-slate-200/80 flex items-center justify-between gap-3 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-slate-100 flex items-center justify-center text-xl shrink-0">
                          {col.logo}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-slate-900 truncate">{col.name}</h4>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span>{col.location}</span>
                            <span>•</span>
                            <span className="flex items-center text-amber-500 font-bold">
                              <Star className="w-3 h-3 fill-current inline mr-0.5" />
                              {col.rating}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={onOpenCompareModal}
                          className="text-xs font-bold text-[#1a56db] hover:underline"
                        >
                          View Details
                        </button>
                        <button
                          type="button"
                          onClick={() => removeCollege(col.id)}
                          className="p-1 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                          title="Remove from comparison"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-xs text-slate-500 mb-2">No colleges currently selected for comparison.</p>
                    <button
                      type="button"
                      onClick={() => setSelectedColleges(DEFAULT_COMPARE_COLLEGES)}
                      className="text-xs font-bold text-[#1a56db] hover:underline"
                    >
                      + Reset Default Top Colleges
                    </button>
                  </div>
                )}
              </div>

              {/* Clear All Link */}
              {selectedColleges.length > 0 && (
                <div className="flex justify-end mb-4">
                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {/* Compare Now Full-Width Blue Button */}
            <button
              type="button"
              onClick={onOpenCompareModal}
              disabled={selectedColleges.length < 2}
              className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer ${
                selectedColleges.length >= 2
                  ? 'bg-[#1a56db] hover:bg-[#1e429f] text-white'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Compare Now ({selectedColleges.length} Selected)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
