import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppTab from '../components/WhatsAppTab';
import CounsellingModal from '../components/CounsellingModal';
import AuthModal from '../components/AuthModal';
import CityModal from '../components/CityModal';
import { Heart, Trash2, ArrowRight, Star, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const WishlistPage = () => {
  const { wishlist, toggleWishlist, addToCompare, setCounsellingModalOpen } = useAuth();

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col font-sans">
      <Header />
      <WhatsAppTab />

      <div className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-red-500 mb-1">
            <Heart className="w-5 h-5 fill-red-500" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              My Saved &amp; Shortlisted Colleges
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Keep track of your favorite universities and courses for rapid comparison and application.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {wishlist.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 max-w-md mx-auto shadow-sm">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 mb-1">Your Wishlist is Empty</h3>
            <p className="text-xs text-slate-500 mb-6">
              Click the heart icon on any college card to shortlist it here for easy reference.
            </p>
            <Link
              to="/colleges"
              className="px-5 py-2.5 bg-[#1a56db] text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm inline-flex items-center space-x-2"
            >
              <span>Explore Colleges Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((c) => (
              <div key={c.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 p-1 overflow-hidden shrink-0">
                        <img src={c.logoUrl || 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=120'} alt={c.name} className="w-full h-full object-cover rounded" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{c.name}</h4>
                        <p className="text-xs text-slate-400 flex items-center mt-0.5">
                          <MapPin className="w-3 h-3 mr-1" />
                          {c.city}, {c.state}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleWishlist(c)}
                      className="text-gray-300 hover:text-red-500 p-1 rounded-full hover:bg-gray-50"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center space-x-1 text-xs text-amber-500 font-semibold mb-4">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{c.rating || 4.2}/5</span>
                    <span className="text-slate-400 font-normal">({c.reviewCount || 400} Reviews)</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-50 flex items-center space-x-2">
                  <button
                    onClick={() => addToCompare(c)}
                    className="flex-1 py-2 bg-blue-50 text-[#1a56db] hover:bg-blue-100 rounded-lg text-xs font-semibold"
                  >
                    + Compare
                  </button>
                  <button
                    onClick={() => setCounsellingModalOpen(true)}
                    className="flex-1 py-2 bg-[#1a56db] text-white hover:bg-blue-700 rounded-lg text-xs font-semibold shadow-xs"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
      <CounsellingModal />
      <AuthModal />
      <CityModal />
    </div>
  );
};

export default WishlistPage;
