import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Building2, BookOpen, GraduationCap, Award, FileText, FileCheck,
  PhoneCall, Users, CreditCard, UserCheck, TrendingUp, LogOut, GlobeLock, ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ADMIN_SECTIONS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'colleges', label: 'Colleges', icon: Building2 },
  { id: 'courses', label: 'Courses', icon: BookOpen },
  { id: 'exams', label: 'Exams', icon: GraduationCap },
  { id: 'scholarships', label: 'Scholarships', icon: Award },
  { id: 'articles', label: 'Articles', icon: FileText },
  { id: 'applications', label: 'Applications', icon: FileCheck },
];

const ROLE_ICON = {
  super_admin: GlobeLock,
  admin: GlobeLock,
  counsellor: PhoneCall,
  college_rep: Building2,
  faculty: UserCheck,
  accounts: CreditCard,
  student: GraduationCap,
  parent: Users,
  partner: TrendingUp,
};

const ROLES_LIST = [
  { id: 'super_admin', label: 'Super Admin' },
  { id: 'admin', label: 'Admin / Content' },
  { id: 'counsellor', label: 'Counsellor CRM' },
  { id: 'college_rep', label: 'College Rep (Amity)' },
  { id: 'faculty', label: 'Faculty' },
  { id: 'accounts', label: 'Accounts & Fees' },
  { id: 'student', label: 'Student Portal' },
  { id: 'parent', label: 'Parent Portal' },
  { id: 'partner', label: 'Franchise Partner' },
];

export default function AdminSidebar({ activeRole, activeSection, onSectionChange }) {
  const { user, logout, switchRoleDemo } = useAuth();
  const navigate = useNavigate();
  const isAdminLike = ['admin', 'super_admin'].includes(activeRole);
  const RoleIcon = ROLE_ICON[activeRole] || LayoutDashboard;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside
      className="group fixed left-0 top-0 bottom-0 z-40 w-16 hover:w-64 bg-slate-950 text-slate-300 transition-all duration-200 ease-out flex flex-col overflow-hidden shadow-xl"
    >
      {/* Brand */}
      <Link to="/" className="flex items-center gap-3 h-16 px-4 shrink-0 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#1a56db] to-blue-400 flex items-center justify-center text-white font-black text-xs shrink-0">
          S360
        </div>
        <span className="text-sm font-black text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          SHIKHAR<span className="text-orange-400">360</span>
        </span>
      </Link>

      {/* Nav sections (admin/super_admin get the full set; other roles get a single Dashboard entry) */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-1 px-2">
        {isAdminLike ? (
          ADMIN_SECTIONS.map((s) => {
            const Icon = s.icon;
            const active = activeSection === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onSectionChange(s.id)}
                title={s.label}
                className={`w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                  active ? 'bg-[#1a56db] text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-150">{s.label}</span>
              </button>
            );
          })
        ) : (
          <div
            title="Dashboard"
            className="w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-xs font-bold bg-[#1a56db] text-white whitespace-nowrap"
          >
            <RoleIcon className="w-5 h-5 shrink-0" />
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-150">Dashboard</span>
          </div>
        )}
      </nav>

      {/* Role switcher (QA/demo tool) + Logout */}
      <div className="shrink-0 border-t border-white/10 p-2 space-y-1">
        <div className="relative">
          <select
            value={activeRole}
            onChange={(e) => { switchRoleDemo(e.target.value); navigate(`/dashboard/${e.target.value}`); }}
            className="w-full appearance-none bg-white/5 hover:bg-white/10 text-[11px] font-semibold text-slate-300 pl-2.5 pr-7 py-2 rounded-xl border border-white/10 focus:outline-none cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-150 absolute inset-0"
          >
            {ROLES_LIST.map((r) => (
              <option key={r.id} value={r.id} className="bg-slate-900">{r.label}</option>
            ))}
          </select>
          {/* Collapsed-state icon placeholder so the row keeps its height when the real control is invisible */}
          <div className="flex items-center gap-3 px-2.5 py-2 rounded-xl text-slate-400 group-hover:opacity-0 transition-opacity duration-150">
            <ChevronDown className="w-5 h-5 shrink-0" />
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          title="Logout"
          className="w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-colors whitespace-nowrap"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-150">Logout</span>
        </button>
      </div>
    </aside>
  );
}
