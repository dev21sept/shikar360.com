import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppTab from '../components/WhatsAppTab';
import CounsellingModal from '../components/CounsellingModal';
import AuthModal from '../components/AuthModal';
import CityModal from '../components/CityModal';
import { Globe, Stethoscope, CheckCircle, ArrowRight, ShieldCheck, DollarSign, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const StudyAbroadPage = ({ type = 'general' }) => {
  const { country } = useParams();
  const { setCounsellingModalOpen } = useAuth();

  const isMbbs = type === 'mbbs' || window.location.pathname.includes('mbbs');

  const destinations = isMbbs ? [
    { country: 'Russia', fee: '₹3.5 - 5 Lakhs / yr', univs: 'First Moscow State, Kazan Federal, Crimea Federal', tag: 'NMC & WHO Approved' },
    { country: 'Uzbekistan', fee: '₹2.5 - 4 Lakhs / yr', univs: 'Tashkent Medical Academy, Samarkand State', tag: 'Affordable & High FMGE pass' },
    { country: 'Kazakhstan', fee: '₹3 - 4.5 Lakhs / yr', univs: 'Kazakh National Medical University, Semey State', tag: 'English Medium' },
    { country: 'Georgia', fee: '₹4 - 6 Lakhs / yr', univs: 'Tbilisi State Medical University, Ilia State', tag: 'European Standard' },
    { country: 'Philippines', fee: '₹3.5 - 5.5 Lakhs / yr', univs: 'University of Perpetual Help, Davao Medical', tag: 'US Pattern MD' },
  ] : [
    { country: 'United Kingdom', fee: '£14,000 - 28,000 / yr', univs: 'Oxford, Imperial College, Manchester, Bristol', tag: '2-Year Post Study Work Visa' },
    { country: 'United States', fee: '$20,000 - 45,000 / yr', univs: 'MIT, Stanford, NYU, UC Berkeley', tag: 'STEM OPT Extension' },
    { country: 'Canada', fee: 'CAD 18,000 - 35,000 / yr', univs: 'University of Toronto, UBC, McGill', tag: 'PR Friendly Pathways' },
    { country: 'Australia', fee: 'AUD 22,000 - 42,000 / yr', univs: 'University of Melbourne, UNSW, Monash', tag: 'High Minimum Wage' },
    { country: 'Germany', fee: 'Near Zero / Free Tuition', univs: 'TU Munich, Heidelberg University, RWTH Aachen', tag: 'Public Universities Free' },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col font-sans">
      <Header />
      <WhatsAppTab />

      <div className="bg-gradient-to-r from-[#0b1c48] to-[#1a56db] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            {isMbbs ? <Stethoscope className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
            <span>{isMbbs ? 'Global Medical Admissions' : 'Overseas Education & Visas'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold mb-3">
            {isMbbs ? 'Study MBBS Abroad with Low Tuition & Global Recognition' : 'Study in Top Global Universities: UK, USA, Canada & Australia'}
          </h1>

          <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed mb-6">
            {isMbbs 
              ? 'Complete your medical degree from NMC, WHO and ECFMG recognized government medical universities with 100% English medium curriculum and affordable living expenses.'
              : 'Direct university shortlisting, statement of purpose assistance, scholarships up to 100%, and guaranteed student visa processing guidance.'}
          </p>

          <button
            onClick={() => setCounsellingModalOpen(true)}
            className="px-6 py-3 bg-[#f59e0b] hover:bg-[#d97706] text-slate-900 font-extrabold text-xs rounded-xl shadow-lg transition-all"
          >
            Get Free Abroad Counselling →
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
        <h2 className="text-xl font-bold text-slate-900 mb-6">
          Popular Destination Countries {country ? `(${country})` : ''}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-slate-900">{dest.country}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {dest.tag}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-600 mb-4">
                  <div>
                    <span className="text-slate-400">Estimated Annual Tuition: </span>
                    <strong className="text-slate-900">{dest.fee}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Top Universities: </span>
                    <p className="font-medium text-slate-800 mt-0.5">{dest.univs}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <Link
                  to={`/colleges?search=${encodeURIComponent(dest.country)}`}
                  className="text-xs font-semibold text-[#1a56db] hover:underline"
                >
                  View Universities
                </Link>
                <button
                  onClick={() => setCounsellingModalOpen(true)}
                  className="px-3 py-1.5 bg-[#1a56db] text-white text-xs font-bold rounded-lg hover:bg-blue-700"
                >
                  Apply Here
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
      <CounsellingModal />
      <AuthModal />
      <CityModal />
    </div>
  );
};

export default StudyAbroadPage;
