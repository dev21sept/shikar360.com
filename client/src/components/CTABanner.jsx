import React from 'react';
import { GraduationCap, Phone, ArrowRight, MessageCircle } from 'lucide-react';

export default function CTABanner({ onOpenCounselling }) {
  return (
    <section className="bg-gradient-to-r from-[#1a56db] via-[#1e429f] to-[#111c44] text-white py-12 relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Left Column: Mortarboard Icon + Message */}
          <div className="flex items-center gap-5 text-center lg:text-left">
            <div className="hidden sm:flex w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 items-center justify-center shrink-0 shadow-lg">
              <GraduationCap className="w-9 h-9 text-amber-300" />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
                Confused about your career or college?
              </h3>
              <p className="text-sm sm:text-base text-blue-100 font-normal mt-1">
                Talk to our senior Shikhar360 education experts and get 100% free personalized guidance.
              </p>
            </div>
          </div>

          {/* Right Column: Phone + Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            {/* Phone link */}
            <a
              href="tel:+917428800111"
              className="flex items-center gap-2 text-white hover:text-amber-300 font-bold text-sm sm:text-base px-3 py-2 rounded-xl transition-colors"
            >
              <div className="p-2 rounded-full bg-white/15">
                <Phone className="w-4 h-4 text-amber-300" />
              </div>
              <span>+91 7428 800 111</span>
            </a>

            {/* Yellow Get Free Counselling Button */}
            <button
              type="button"
              onClick={onOpenCounselling}
              className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-sm shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center gap-2 cursor-pointer hover:scale-105"
            >
              <span>Get Free Counselling</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Green Chat on WhatsApp Button */}
            <a
              href="https://wa.me/917428800111?text=Hi%20Shikhar360%2C%20I%20want%20to%20know%20more%20about%20college%20admissions."
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold rounded-xl text-sm shadow-xl transition-all duration-200 flex items-center gap-2 cursor-pointer hover:scale-105"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
