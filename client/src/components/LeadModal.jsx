import React, { useState } from 'react';
import { X, CheckCircle2, User, Phone, MapPin, BookOpen, ArrowRight } from 'lucide-react';
import { COURSES_GRID } from '../data/mockData';

export default function LeadModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: 'Indore',
    course: 'MBA',
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Enquiry Submitted!</h3>
            <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
              Thank you, <strong className="text-slate-900">{formData.name}</strong>! A <span className="font-bold text-[#1a56db]">Shikhar360</span> senior education counsellor has been assigned and will call you on <strong className="text-[#1a56db]">+91 {formData.phone}</strong> shortly.
            </p>
            <div className="pt-4">
              <button
                type="button"
                onClick={() => { setSubmitted(false); onClose(); }}
                className="px-6 py-2.5 bg-[#1a56db] text-white font-bold rounded-xl text-sm cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1a56db]">100% Free Guidance</span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                Get Expert Admission Counselling
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Fill this short form to speak directly with a Shikhar360 admissions expert for your preferred course.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <div className="relative flex items-center">
                  <User className="absolute left-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#1a56db] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
                <div className="relative flex items-center">
                  <Phone className="absolute left-3 w-4 h-4 text-slate-400" />
                  <span className="absolute left-9 text-xs font-bold text-slate-400">+91</span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="10-digit mobile number"
                    className="w-full pl-16 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#1a56db] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your City</label>
                  <div className="relative flex items-center">
                    <MapPin className="absolute left-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Indore"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#1a56db] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Course</label>
                  <div className="relative flex items-center">
                    <BookOpen className="absolute left-3 w-4 h-4 text-slate-400" />
                    <select
                      value={formData.course}
                      onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#1a56db] focus:outline-hidden"
                    >
                      {COURSES_GRID.filter(c => !c.isLink).map((c, i) => (
                        <option key={i} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Request Callback Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[11px] text-center text-slate-400">
                🔒 We respect your privacy. No spam guarantee.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
