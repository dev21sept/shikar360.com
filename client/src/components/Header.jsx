import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, MapPin, ChevronDown, Menu, X, User, GraduationCap, Globe, BookOpen, Building2, LogOut, LayoutDashboard, Bell, CheckCheck } from 'lucide-react';
import { LOCATIONS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { getMyNotifications, markNotificationRead, markAllNotificationsRead } from '../services/api';

export default function Header({ onOpenAuth, onOpenCounselling, wishlistCount = 0 }) {
  const [selectedCity, setSelectedCity] = useState('Indore');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, logout, setAuthModalOpen } = useAuth();
  const navigate = useNavigate();

  const openAuth = onOpenAuth || (() => setAuthModalOpen(true));

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    navigate('/');
  };

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user]);

  const fetchNotifications = async () => {
    const res = await getMyNotifications();
    if (res && res.success) {
      setNotifications(res.notifications || []);
      setUnreadCount(res.unreadCount || 0);
    }
  };

  const handleOpenNotifications = () => {
    setNotifOpen(!notifOpen);
    if (!notifOpen) fetchNotifications();
  };

  const handleNotificationClick = async (n) => {
    if (!n.isRead) {
      await markNotificationRead(n.id);
      setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, isRead: true } : x)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
    if (n.link) {
      setNotifOpen(false);
      navigate(n.link);
    }
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    setNotifications((prev) => prev.map((x) => ({ ...x, isRead: true })));
    setUnreadCount(0);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Logo on the left */}
          <a href="/" className="flex items-center gap-3 group shrink-0 focus:outline-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1a56db] to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center text-[22px] sm:text-2xl font-black tracking-tight leading-none">
                <span className="text-[#1a56db]">SHIKHAR</span>
                <span className="text-[#f97316]">360</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400 tracking-wider mt-0.5 group-hover:text-slate-600 transition-colors">
                Compare. Choose. Connect.
              </span>
            </div>
          </a>

          {/* Center Navigation - Clean Spacing & Hover States */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2.5 text-sm font-semibold text-slate-600">
            <Link
              to="/courses"
              className="px-3 py-1.5 rounded-lg hover:text-[#1a56db] hover:bg-blue-50/70 transition-colors"
            >
              Courses
            </Link>

            <Link
              to="/colleges"
              className="px-3 py-1.5 rounded-lg hover:text-[#1a56db] hover:bg-blue-50/70 transition-colors"
            >
              Colleges
            </Link>

            <Link
              to="/colleges?type=Deemed"
              className="px-3 py-1.5 rounded-lg hover:text-[#1a56db] hover:bg-blue-50/70 transition-colors"
            >
              Universities
            </Link>

            <Link
              to="/compare"
              className="px-3 py-1.5 rounded-lg hover:text-[#1a56db] hover:bg-blue-50/70 transition-colors flex items-center gap-1.5"
            >
              <span>Compare</span>
              <span className="px-1.5 py-0.5 text-[9px] uppercase tracking-wider bg-orange-100 text-[#ea580c] rounded-full font-black">
                New
              </span>
            </Link>

            <Link
              to="/study-abroad"
              className="px-3 py-1.5 rounded-lg hover:text-[#1a56db] hover:bg-blue-50/70 transition-colors"
            >
              Study Abroad
            </Link>

            <Link
              to="/mbbs-abroad"
              className="px-3 py-1.5 rounded-lg hover:text-[#1a56db] hover:bg-blue-50/70 transition-colors"
            >
              MBBS Abroad
            </Link>

            {/* Resources Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setResourcesOpen(!resourcesOpen)}
                onBlur={() => setTimeout(() => setResourcesOpen(false), 200)}
                className="px-3 py-1.5 rounded-lg hover:text-[#1a56db] hover:bg-blue-50/70 transition-colors flex items-center gap-1 cursor-pointer font-semibold"
              >
                <span>Resources</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${resourcesOpen ? 'rotate-180' : ''}`} />
              </button>
              {resourcesOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <Link to="/predictor" onClick={() => setResourcesOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#1a56db] transition-colors">
                    <BookOpen className="w-4 h-4 text-slate-400" />
                    <span>College Predictor</span>
                  </Link>
                  <Link to="/exams" onClick={() => setResourcesOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#1a56db] transition-colors">
                    <BookOpen className="w-4 h-4 text-slate-400" />
                    <span>Entrance Exams</span>
                  </Link>
                  <Link to="/scholarships" onClick={() => setResourcesOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#1a56db] transition-colors">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span>Scholarships</span>
                  </Link>
                  <Link to="/qna" onClick={() => setResourcesOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#1a56db] transition-colors">
                    <GraduationCap className="w-4 h-4 text-slate-400" />
                    <span>Q&amp;A Community</span>
                  </Link>
                  <Link to="/career-compass" onClick={() => setResourcesOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#1a56db] transition-colors">
                    <GraduationCap className="w-4 h-4 text-slate-400" />
                    <span>Career Compass</span>
                  </Link>
                  <Link to="/mock-tests" onClick={() => setResourcesOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#1a56db] transition-colors">
                    <BookOpen className="w-4 h-4 text-slate-400" />
                    <span>Mock Tests</span>
                  </Link>
                  <Link to="/articles" onClick={() => setResourcesOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#1a56db] transition-colors">
                    <BookOpen className="w-4 h-4 text-slate-400" />
                    <span>Admission News</span>
                  </Link>
                  <Link to="/#reviews" onClick={() => setResourcesOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#1a56db] transition-colors">
                    <Globe className="w-4 h-4 text-slate-400" />
                    <span>Verified Student Reviews</span>
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Right Controls - Well-spaced, balanced hierarchy */}
          <div className="hidden sm:flex items-center gap-3.5 shrink-0">
            {/* Location Selector Pill */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCityDropdown(!showCityDropdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition-colors cursor-pointer border border-slate-200/60"
              >
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span className="font-semibold">{selectedCity}</span>
                <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
              </button>
              {showCityDropdown && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 max-h-56 overflow-y-auto">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Select City</div>
                  {LOCATIONS.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => { setSelectedCity(city); setShowCityDropdown(false); }}
                      className={`w-full text-left px-3.5 py-1.5 text-xs hover:bg-blue-50 hover:text-[#1a56db] transition-colors ${
                        city === selectedCity ? 'font-bold text-[#1a56db] bg-blue-50/60' : 'text-slate-700 font-medium'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Subtle Divider */}
            <div className="h-5 w-px bg-slate-200" />

            {/* Wishlist Heart Icon */}
            <button
              type="button"
              className="relative p-2 rounded-xl text-slate-600 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Your Wishlist"
            >
              <Heart className="w-4.5 h-4.5" />
              <span className="absolute top-1 right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[9px] font-black leading-none text-white transform translate-x-1/3 -translate-y-1/3 bg-[#1a56db] rounded-full">
                {wishlistCount}
              </span>
            </button>

            {/* Notifications Bell (logged-in users only) */}
            {user && (
              <div className="relative">
                <button
                  type="button"
                  onClick={handleOpenNotifications}
                  onBlur={() => setTimeout(() => setNotifOpen(false), 200)}
                  className="relative p-2 rounded-xl text-slate-600 hover:text-[#1a56db] hover:bg-blue-50 transition-colors cursor-pointer"
                  title="Notifications"
                >
                  <Bell className="w-4.5 h-4.5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[9px] font-black leading-none text-white transform translate-x-1/3 -translate-y-1/3 bg-rose-500 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-96 overflow-y-auto">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                      <span className="text-xs font-bold text-slate-700">Notifications</span>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="flex items-center gap-1 text-[10px] font-bold text-[#1a56db] hover:underline"
                        >
                          <CheckCheck className="w-3 h-3" />
                          Mark all read
                        </button>
                      )}
                    </div>
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 px-4 py-6 text-center">No notifications yet.</p>
                    ) : (
                      notifications.map((n) => (
                        <button
                          key={n.id}
                          onClick={() => handleNotificationClick(n)}
                          className={`w-full text-left px-4 py-2.5 text-xs transition-colors hover:bg-blue-50 ${!n.isRead ? 'bg-blue-50/50' : ''}`}
                        >
                          <div className="flex items-start gap-2">
                            {!n.isRead && <span className="w-1.5 h-1.5 rounded-full bg-[#1a56db] mt-1 shrink-0" />}
                            <div className={n.isRead ? 'ml-3.5' : ''}>
                              <div className="font-bold text-slate-800">{n.title}</div>
                              <div className="text-slate-500 mt-0.5">{n.message}</div>
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Login / Register Primary Button, or Profile Menu when logged in */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen(!profileOpen)}
                  onBlur={() => setTimeout(() => setProfileOpen(false), 200)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 rounded-xl text-xs sm:text-sm font-bold text-slate-700 transition-all cursor-pointer"
                >
                  <span className="w-6 h-6 rounded-full bg-[#1a56db] text-white flex items-center justify-center text-[10px] font-black">
                    {(user.fullName || 'U').substring(0, 2).toUpperCase()}
                  </span>
                  <span className="hidden md:inline max-w-[120px] truncate">{user.fullName}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <div className="text-xs font-bold text-slate-900 truncate">{user.fullName}</div>
                      <div className="text-[10px] text-slate-400 capitalize">{String(user.role || '').replace('_', ' ')}</div>
                    </div>
                    <Link
                      to={`/dashboard/${user.role || 'student'}`}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#1a56db] transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-400" />
                      <span>My Dashboard</span>
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={openAuth}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#1a56db] hover:bg-[#1e429f] text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>Login / Register</span>
              </button>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex sm:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-5 pt-4 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
            <span className="text-slate-500 font-medium">Location:</span>
            <span className="font-bold text-[#1a56db] bg-blue-50 px-2.5 py-1 rounded-full">📍 {selectedCity}</span>
          </div>
          <div className="space-y-1 text-sm font-semibold text-slate-700">
            <Link to="/courses" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-blue-50 hover:text-[#1a56db]">Courses</Link>
            <Link to="/colleges" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-blue-50 hover:text-[#1a56db]">Colleges</Link>
            <Link to="/colleges?type=Deemed" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-blue-50 hover:text-[#1a56db]">Universities</Link>
            <Link to="/compare" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-blue-50 hover:text-[#1a56db]">Compare Colleges</Link>
            <Link to="/study-abroad" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-blue-50 hover:text-[#1a56db]">Study Abroad</Link>
            <Link to="/mbbs-abroad" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-blue-50 hover:text-[#1a56db]">MBBS Abroad</Link>
            <Link to="/predictor" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-blue-50 hover:text-[#1a56db]">College Predictor</Link>
            <Link to="/exams" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-blue-50 hover:text-[#1a56db]">Entrance Exams</Link>
            <Link to="/scholarships" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-blue-50 hover:text-[#1a56db]">Scholarships</Link>
            <Link to="/qna" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-blue-50 hover:text-[#1a56db]">Q&amp;A Community</Link>
            <Link to="/career-compass" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-blue-50 hover:text-[#1a56db]">Career Compass</Link>
            <Link to="/mock-tests" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-blue-50 hover:text-[#1a56db]">Mock Tests</Link>
            <Link to="/articles" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-blue-50 hover:text-[#1a56db]">Admission News</Link>
          </div>
          <div className="pt-3 border-t border-slate-100">
            {user ? (
              <div className="space-y-2">
                <Link
                  to={`/dashboard/${user.role || 'student'}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 bg-[#1a56db] text-white rounded-xl font-bold text-sm text-center shadow-xs block"
                >
                  My Dashboard ({user.fullName})
                </Link>
                <button
                  type="button"
                  onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                  className="w-full py-2.5 bg-rose-50 text-rose-600 rounded-xl font-bold text-sm text-center"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => { setMobileMenuOpen(false); openAuth(); }}
                className="w-full py-2.5 bg-[#1a56db] text-white rounded-xl font-bold text-sm text-center shadow-xs"
              >
                Login / Register
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
