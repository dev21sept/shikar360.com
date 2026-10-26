import React from 'react';
import { Users, FileText, UserCheck, Clock } from 'lucide-react';

const TrustStats = () => {
  const stats = [
    {
      number: '10 Lakh+',
      label: 'Students Assisted',
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      number: '25,000+',
      label: 'Enquiries This Month',
      icon: FileText,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    {
      number: '500+',
      label: 'Expert Counsellors',
      icon: UserCheck,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      number: '15+ Years',
      label: 'Of Experience',
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50'
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between h-full">
      {/* Heading */}
      <h3 className="text-xl font-extrabold text-slate-900 mb-6 pb-2 border-b border-gray-50">
        Trusted By Thousands of Students &amp; Parents
      </h3>

      {/* 2x2 Stat Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-xl border border-gray-100 bg-[#fbfcfd] hover:bg-white hover:border-blue-200 hover:shadow-sm transition-all duration-200 flex items-center space-x-3.5 group"
            >
              <div className={`w-11 h-11 rounded-lg ${s.bg} ${s.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight">
                  {s.number}
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {s.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrustStats;
