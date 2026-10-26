import React from 'react';
import { Monitor, Stethoscope, Globe, GraduationCap, ArrowRight } from 'lucide-react';
import { CATEGORY_CARDS } from '../data/mockData';

export default function CategoryCards({ onSelectCategory }) {
  const iconMap = {
    Monitor: <Monitor className="w-7 h-7" />,
    Stethoscope: <Stethoscope className="w-7 h-7" />,
    Globe: <Globe className="w-7 h-7" />,
    GraduationCap: <GraduationCap className="w-7 h-7" />
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORY_CARDS.map((card) => (
            <div
              key={card.id}
              className={`group relative p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 ${card.borderHover}`}
            >
              <div>
                {/* Circular Icon Badge */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${card.badgeBg} transition-transform group-hover:scale-110 duration-200`}>
                  {iconMap[card.icon]}
                </div>

                {/* Card Title */}
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-slate-800 tracking-tight mb-2">
                  {card.title}
                </h3>

                {/* 1-Line Description */}
                <p className="text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                  {card.description}
                </p>
              </div>

              {/* Colored Explore Now Button */}
              <button
                type="button"
                onClick={() => onSelectCategory && onSelectCategory(card.id)}
                className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition-all duration-200 cursor-pointer ${card.buttonColor}`}
              >
                <span>Explore Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
