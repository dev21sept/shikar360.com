import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  Settings, 
  Users, 
  GraduationCap, 
  Code, 
  Monitor, 
  FileText, 
  Stethoscope, 
  FlaskConical, 
  Scale, 
  HeartPulse, 
  Microscope, 
  Coins, 
  BookOpen, 
  MoreHorizontal 
} from 'lucide-react';

const ExploreCourses = () => {
  const navigate = useNavigate();

  const courses = [
    { name: 'MBA', icon: Briefcase, color: 'text-blue-600', query: 'MBA' },
    { name: 'B.Tech', icon: Settings, color: 'text-emerald-600', query: 'B.Tech' },
    { name: 'BBA', icon: Users, color: 'text-indigo-600', query: 'BBA' },
    { name: 'MBA (Distance)', icon: GraduationCap, color: 'text-amber-600', query: 'Distance MBA' },
    { name: 'MCA', icon: Code, color: 'text-rose-600', query: 'MCA' },
    { name: 'BCA', icon: Monitor, color: 'text-cyan-600', query: 'BCA' },
    { name: 'B.Com', icon: FileText, color: 'text-blue-500', query: 'B.Com' },
    { name: 'MBBS Abroad', icon: Stethoscope, color: 'text-red-500', query: 'MBBS' },
    { name: 'B.Pharm', icon: FlaskConical, color: 'text-teal-600', query: 'Pharmacy' },
    { name: 'LLB', icon: Scale, color: 'text-purple-600', query: 'LLB' },
    { name: 'Nursing', icon: HeartPulse, color: 'text-pink-600', query: 'Nursing' },
    { name: 'B.Sc', icon: Microscope, color: 'text-green-600', query: 'B.Sc' },
    { name: 'M.Com', icon: Coins, color: 'text-blue-700', query: 'M.Com' },
    { name: 'MA', icon: BookOpen, color: 'text-amber-700', query: 'MA' },
    { name: 'More Courses ···', icon: MoreHorizontal, color: 'text-gray-500', query: '' }
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-50">
        <h3 className="text-xl font-extrabold text-slate-900">
          Explore Top Courses
        </h3>
        <Link 
          to="/courses" 
          className="text-xs font-semibold text-[#1a56db] hover:underline"
        >
          View All
        </Link>
      </div>

      {/* 3x5 Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {courses.map((c, idx) => {
          const Icon = c.icon;
          return (
            <button
              key={idx}
              onClick={() => navigate(c.query ? `/colleges?search=${encodeURIComponent(c.query)}` : '/courses')}
              className="flex flex-col items-center justify-center p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/40 hover:shadow-sm transition-all duration-200 group text-center min-h-[90px]"
            >
              <Icon className={`w-5 h-5 ${c.color} mb-2 group-hover:scale-110 transition-transform`} />
              <span className="text-xs font-bold text-slate-800 leading-tight group-hover:text-[#1a56db]">
                {c.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ExploreCourses;
