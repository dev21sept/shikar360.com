import React, { useState, useEffect } from 'react';
import { ArrowUp, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0b1329] text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 6-Column Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 pb-12 border-b border-slate-800 text-sm">
          
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-1 space-y-4">
            <a href="/" className="inline-block">
              <div className="flex items-center text-2xl font-black tracking-tight leading-none">
                <span className="text-[#3b82f6]">SHIKHAR</span>
                <span className="text-[#f97316]">360</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400 tracking-wider">
                Compare. Choose. Connect.
              </span>
            </a>
            <p className="text-xs text-slate-400 leading-relaxed">
              India's premier education discovery, comparison and admission platform helping students select the right universities with Shikhar360.
            </p>
            {/* Social SVG Icons */}
            <div className="flex items-center space-x-3 pt-2">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-[#1a56db] text-slate-300 hover:text-white flex items-center justify-center transition-colors" title="Facebook">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors" title="Instagram">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-sky-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors" title="LinkedIn">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors" title="YouTube">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          {/* Col 2: Top Categories */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-4 text-slate-200">Top Categories</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#courses" className="hover:text-white transition-colors">Distance Education</a></li>
              <li><a href="#courses" className="hover:text-white transition-colors">Online MBA</a></li>
              <li><a href="#courses" className="hover:text-white transition-colors">Online MCA</a></li>
              <li><a href="#courses" className="hover:text-white transition-colors">Online BBA</a></li>
              <li><a href="#courses" className="hover:text-white transition-colors">Online BCA</a></li>
              <li><a href="#courses" className="text-blue-400 hover:underline font-semibold">View All Courses →</a></li>
            </ul>
          </div>

          {/* Col 3: MBBS Abroad */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-4 text-slate-200">MBBS Abroad</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#mbbs" className="hover:text-white transition-colors">MBBS in Russia</a></li>
              <li><a href="#mbbs" className="hover:text-white transition-colors">MBBS in Uzbekistan</a></li>
              <li><a href="#mbbs" className="hover:text-white transition-colors">MBBS in Kazakhstan</a></li>
              <li><a href="#mbbs" className="hover:text-white transition-colors">MBBS in Georgia</a></li>
              <li><a href="#mbbs" className="hover:text-white transition-colors">MBBS in Philippines</a></li>
              <li><a href="#mbbs" className="text-emerald-400 hover:underline font-semibold">View All Countries →</a></li>
            </ul>
          </div>

          {/* Col 4: Study Abroad */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-4 text-slate-200">Study Abroad</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#study-abroad" className="hover:text-white transition-colors">Study in UK</a></li>
              <li><a href="#study-abroad" className="hover:text-white transition-colors">Study in USA</a></li>
              <li><a href="#study-abroad" className="hover:text-white transition-colors">Study in Canada</a></li>
              <li><a href="#study-abroad" className="hover:text-white transition-colors">Study in Australia</a></li>
              <li><a href="#study-abroad" className="hover:text-white transition-colors">Study in Germany</a></li>
              <li><a href="#study-abroad" className="text-purple-400 hover:underline font-semibold">View All Programs →</a></li>
            </ul>
          </div>

          {/* Col 5: Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-4 text-slate-200">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#compare" className="hover:text-white transition-colors">Compare Colleges</a></li>
              <li><a href="#colleges" className="hover:text-white transition-colors">Colleges by Courses</a></li>
              <li><a href="#universities" className="hover:text-white transition-colors">Universities by Course</a></li>
              <li><a href="#news" className="hover:text-white transition-colors">Admission News 2026</a></li>
              <li><a href="#resources" className="hover:text-white transition-colors">Education Resources</a></li>
              <li><a href="#faqs" className="hover:text-white transition-colors">Frequently Asked Questions</a></li>
            </ul>
          </div>

          {/* Col 6: Contact Us */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-4 text-slate-200">Contact Us</h4>
            <div className="flex items-start gap-2.5 text-xs text-slate-400">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>Indore, Madhya Pradesh, India - 452001</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-400">
              <Phone className="w-4 h-4 text-amber-400 shrink-0" />
              <a href="tel:+917428800111" className="hover:text-white">+91 7428 800 111</a>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-400">
              <Mail className="w-4 h-4 text-sky-400 shrink-0" />
              <a href="mailto:support@shikhar360.com" className="hover:text-white">support@shikhar360.com</a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © 2026 Shikhar360 Education Pvt. Ltd. All Rights Reserved.
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-slate-400">
            <a href="#about" className="hover:text-white transition-colors">About Us</a>
            <span>•</span>
            <a href="#contact" className="hover:text-white transition-colors">Contact Us</a>
            <span>•</span>
            <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#terms" className="hover:text-white transition-colors">Terms & Conditions</a>
            <span>•</span>
            <a href="#disclaimer" className="hover:text-white transition-colors">Disclaimer</a>
          </div>
        </div>

      </div>

      {/* Floating Scroll-to-Top Button (Stacked above WhatsApp at bottom-24) */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 z-40 w-11 h-11 rounded-full bg-[#1a56db] hover:bg-[#1e429f] text-white shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer"
          title="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </footer>
  );
}
