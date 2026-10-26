import React, { useState } from 'react';
import { X, CheckCircle, GraduationCap, Phone, User, Mail, MapPin, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { submitLead } from '../services/api';

const CounsellingModal = () => {
  const { counsellingModalOpen, setCounsellingModalOpen, selectedCity } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    city: selectedCity || 'Indore',
    courseInterest: 'B.Tech'
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!counsellingModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) {
      setError('Please provide your name and phone number');
      return;
    }
    setError('');
    setLoading(true);

    const res = await submitLead({
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      city: formData.city,
      source: 'Get Free Counselling Modal',
      notes: `Interested in: ${formData.courseInterest}`
    });

    setLoading(false);
    if (res.success) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setCounsellingModalOpen(false);
      }, 3500);
    } else {
      setError(res.message || 'Submission failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1a56db] to-[#1e429f] text-white p-6 relative">
          <button
            onClick={() => setCounsellingModalOpen(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Get Free Counselling</h3>
              <p className="text-xs text-blue-100">Talk to our verified education advisors</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8 space-y-3">
              <CheckCircle className="w-14 h-14 text-emerald-500 mx-auto" />
              <h4 className="text-lg font-bold text-slate-900">Enquiry Submitted!</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Thank you, {formData.fullName}. Our expert counsellor will connect with you via call / WhatsApp within 15 minutes.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg font-medium">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="10-digit mobile number"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Your City"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Course Interest</label>
                  <select
                    value={formData.courseInterest}
                    onChange={(e) => setFormData({ ...formData, courseInterest: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  >
                    <option value="B.Tech">B.Tech</option>
                    <option value="MBA">MBA / PGDM</option>
                    <option value="Distance MBA">Distance MBA</option>
                    <option value="MBBS Abroad">MBBS Abroad</option>
                    <option value="Study in UK/USA/Canada">Study Abroad</option>
                    <option value="MCA / BCA">MCA / BCA</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-[#1a56db] hover:bg-[#1545b3] text-white font-bold text-xs tracking-wide transition-all shadow-md mt-2 disabled:opacity-70"
              >
                {loading ? 'Submitting...' : 'Request Free Call Back →'}
              </button>

              <p className="text-[10px] text-slate-400 text-center">
                We respect your privacy. No spam guaranteed.
              </p>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default CounsellingModal;
