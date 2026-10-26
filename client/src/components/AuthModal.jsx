import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Phone, Lock, User, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { requestOtp as apiRequestOtp } from '../services/api';

export default function AuthModal({ isOpen, onClose }) {
  const { authModalOpen, setAuthModalOpen, loginWithPassword, loginWithOtp } = useAuth();
  const navigate = useNavigate();

  const open = isOpen !== undefined ? isOpen : authModalOpen;
  const close = onClose || (() => setAuthModalOpen(false));

  const [tab, setTab] = useState('otp'); // 'otp' | 'password' | 'register'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleLoggedIn = (user) => {
    setSuccessMsg(`Welcome back, ${user?.fullName || 'there'}!`);
    setTimeout(() => {
      close();
      setSuccessMsg('');
      setOtpSent(false);
      navigate(`/dashboard/${user?.role || 'student'}`);
    }, 900);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (phone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit phone number.');
      return;
    }
    setSubmitting(true);
    const res = await apiRequestOtp(phone);
    setSubmitting(false);
    if (res.success) {
      setOtpSent(true);
    } else {
      setErrorMsg(res.message || 'Failed to send OTP. Please try again.');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);
    const res = await loginWithOtp(phone, otp, fullName, 'student');
    setSubmitting(false);
    if (res.success) {
      handleLoggedIn(res.user);
    } else {
      setErrorMsg(res.message || 'Invalid or expired OTP.');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);
    const res = await loginWithPassword(identifier, password);
    setSubmitting(false);
    if (res.success) {
      handleLoggedIn(res.user);
    } else {
      setErrorMsg(res.message || 'Invalid email/phone or password.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={close}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center text-3xl font-black mb-1">
            <span className="text-[#1a56db]">SHIKHAR</span>
            <span className="text-[#f97316]">360</span>
          </div>
          <p className="text-xs text-slate-500 font-medium">Access admissions, shortlists & counseling portal</p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-6 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setTab('otp'); setOtpSent(false); setErrorMsg(''); }}
            className={`flex-1 py-2 rounded-lg transition-all ${tab === 'otp' ? 'bg-white text-[#1a56db] shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            OTP Login
          </button>
          <button
            type="button"
            onClick={() => { setTab('password'); setErrorMsg(''); }}
            className={`flex-1 py-2 rounded-lg transition-all ${tab === 'password' ? 'bg-white text-[#1a56db] shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Password
          </button>
          <button
            type="button"
            onClick={() => { setTab('register'); setErrorMsg(''); }}
            className={`flex-1 py-2 rounded-lg transition-all ${tab === 'register' ? 'bg-white text-[#1a56db] shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Register
          </button>
        </div>

        {successMsg ? (
          <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="text-base font-bold text-emerald-900">Authenticated!</h4>
            <p className="text-xs text-emerald-700">{successMsg}</p>
          </div>
        ) : (
          <>
            {errorMsg && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {tab === 'otp' && (
              <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Mobile Number</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs font-bold text-slate-400">+91</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter 10-digit phone number"
                      maxLength={10}
                      required
                      disabled={otpSent}
                      className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#1a56db] focus:outline-hidden"
                    />
                  </div>
                </div>

                {otpSent && (
                  <div className="animate-in fade-in duration-200">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Enter 6-digit OTP</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="e.g. 123456"
                      maxLength={6}
                      required
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#1a56db] focus:outline-hidden tracking-widest text-center font-bold text-lg"
                    />
                    <div className="flex justify-between items-center text-[11px] mt-1.5 text-slate-400">
                      <span>OTP sent to +91 {phone}</span>
                      <button type="button" onClick={() => { setOtpSent(false); setErrorMsg(''); }} className="text-[#1a56db] font-bold hover:underline">Change number</button>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-[#1a56db] hover:bg-[#1e429f] disabled:opacity-60 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>{submitting ? 'Please wait...' : (otpSent ? 'Verify OTP & Proceed' : 'Send OTP')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {tab === 'password' && (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone or Email</label>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter phone or registered email"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#1a56db] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#1a56db] focus:outline-hidden"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-[#1a56db] hover:bg-[#1e429f] disabled:opacity-60 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>{submitting ? 'Logging in...' : 'Log In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {tab === 'register' && (
              <form onSubmit={(e) => { e.preventDefault(); setSuccessMsg('Registration submitted! Verification link sent.'); setTimeout(close, 1200); }} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#1a56db] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#1a56db] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Create Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#1a56db] focus:outline-hidden"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-[#f97316] hover:bg-[#ea580c] text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </>
        )}

        <div className="mt-6 text-center text-[11px] text-slate-400">
          By signing in you agree to Shikhar360's <a href="#terms" className="underline">Terms of Service</a> & <a href="#privacy" className="underline">Privacy Policy</a>.
        </div>
      </div>
    </div>
  );
}
