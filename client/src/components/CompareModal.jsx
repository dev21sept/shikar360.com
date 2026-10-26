import React from 'react';
import { X, Star, Check, Award, Building, DollarSign, TrendingUp } from 'lucide-react';
import { DEFAULT_COMPARE_COLLEGES } from '../data/mockData';

export default function CompareModal({ isOpen, onClose, onOpenCounselling }) {
  if (!isOpen) return null;

  const colleges = DEFAULT_COMPARE_COLLEGES;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1a56db]">In-Depth Analysis</span>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
            College & University Comparison
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Compare official fees, verified placement records, accreditation and rankings.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-3 px-4 font-bold text-slate-500 w-1/4">Parameters</th>
                {colleges.map((col) => (
                  <th key={col.id} className="py-3 px-4 font-black text-slate-900">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{col.logo}</span>
                      <span className="truncate">{col.name}</span>
                    </div>
                    <div className="text-xs text-slate-400 font-normal">{col.location}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              <tr>
                <td className="py-3 px-4 font-bold text-slate-600 bg-slate-50/50">Rating & Reviews</td>
                {colleges.map((col) => (
                  <td key={col.id} className="py-3 px-4">
                    <span className="inline-flex items-center font-bold text-amber-500 bg-amber-50 px-2.5 py-1 rounded-md">
                      <Star className="w-3.5 h-3.5 fill-current mr-1" />
                      {col.rating} ({col.reviewsCount} reviews)
                    </span>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-3 px-4 font-bold text-slate-600 bg-slate-50/50">Annual Tuition Fees</td>
                {colleges.map((col) => (
                  <td key={col.id} className="py-3 px-4 font-bold text-slate-900">
                    {col.fees}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-3 px-4 font-bold text-slate-600 bg-slate-50/50">Avg Placement Package</td>
                {colleges.map((col) => (
                  <td key={col.id} className="py-3 px-4 font-bold text-emerald-600">
                    {col.avgPackage}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-3 px-4 font-bold text-slate-600 bg-slate-50/50">Institution Category</td>
                {colleges.map((col) => (
                  <td key={col.id} className="py-3 px-4 text-slate-700">
                    {col.type}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-3 px-4 font-bold text-slate-600 bg-slate-50/50">Approvals & Accreditation</td>
                {colleges.map((col) => (
                  <td key={col.id} className="py-3 px-4 text-slate-700">
                    <span className="inline-flex items-center gap-1 font-semibold text-blue-700">
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      UGC, AICTE, NAAC A++
                    </span>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-3 px-4 font-bold text-slate-600 bg-slate-50/50">Action</td>
                {colleges.map((col) => (
                  <td key={col.id} className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => { onClose(); onOpenCounselling(); }}
                      className="w-full py-2 px-3 bg-[#1a56db] hover:bg-[#1e429f] text-white font-bold rounded-lg text-xs shadow-xs transition-colors"
                    >
                      Enquire Admission
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
