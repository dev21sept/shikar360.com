import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getMyNotifications, markNotificationRead, markAllNotificationsRead } from '../../services/api';

export default function AdminTopbar({ title, subtitle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

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
    setNotifOpen(false);
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    setNotifications((prev) => prev.map((x) => ({ ...x, isRead: true })));
    setUnreadCount(0);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200/80 flex items-center justify-between px-5 sm:px-8 shadow-xs">
      <div>
        <h1 className="text-sm sm:text-base font-black text-slate-900 leading-tight">{title}</h1>
        {subtitle && <p className="text-[11px] text-slate-400">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={handleOpenNotifications}
            onBlur={() => setTimeout(() => setNotifOpen(false), 200)}
            className="relative p-2 rounded-xl text-slate-500 hover:text-[#1a56db] hover:bg-blue-50 transition-colors"
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
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-700">Notifications</span>
                {unreadCount > 0 && (
                  <button onClick={handleMarkAllRead} className="flex items-center gap-1 text-[10px] font-bold text-[#1a56db] hover:underline">
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
                    <div className="font-bold text-slate-800">{n.title}</div>
                    <div className="text-slate-500 mt-0.5">{n.message}</div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            onBlur={() => setTimeout(() => setProfileOpen(false), 200)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <span className="w-8 h-8 rounded-full bg-[#1a56db] text-white flex items-center justify-center text-xs font-black shrink-0">
              {(user?.fullName || 'U').substring(0, 2).toUpperCase()}
            </span>
            <span className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-800 leading-tight">{user?.fullName}</div>
              <div className="text-[10px] text-slate-400 capitalize">{String(user?.role || '').replace('_', ' ')}</div>
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
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
      </div>
    </header>
  );
}
