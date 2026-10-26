import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { getTestimonials } from '../services/api';

const Testimonials = () => {
  const defaultTestimonials = [
    {
      id: 1,
      studentName: 'Priya Sharma',
      universityName: 'Amity University, Noida',
      rating: 5,
      content: 'Shikhar360 helped me compare the best universities and choose the right course. The information is detailed and updated.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 2,
      studentName: 'Rohan Mehta',
      universityName: 'BITS Pilani',
      rating: 5,
      content: 'The comparison tool showed exact placement statistics and hostel facilities that made choosing BITS Pilani completely seamless.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 3,
      studentName: 'Ananya Verma',
      universityName: 'VIT Vellore',
      rating: 5,
      content: 'The counsellor walked me through VITEEE score cutoffs and guided my choice of specialization accurately.',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
    }
  ];

  const [testimonials, setTestimonials] = useState(defaultTestimonials);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const res = await getTestimonials();
    if (res && res.success && res.testimonials && res.testimonials.length > 0) {
      setTestimonials(res.testimonials);
    }
  };

  const prevReview = () => {
    setCurrentIndex(prev => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextReview = () => {
    setCurrentIndex(prev => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const active = testimonials[currentIndex] || defaultTestimonials[0];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-50">
        <h3 className="text-xl font-extrabold text-slate-900">
          What Students Say
        </h3>
        <Link 
          to="/reviews" 
          className="text-xs font-semibold text-[#1a56db] hover:underline"
        >
          View All Reviews
        </Link>
      </div>

      {/* Review Card */}
      <div className="relative py-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img
              src={active.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={active.studentName}
              className="w-12 h-12 rounded-full object-cover border-2 border-blue-100 shadow-xs"
            />
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                {active.studentName}
              </h4>
              <p className="text-xs text-slate-500">
                {active.universityName}
              </p>
            </div>
          </div>

          {/* Star Rating */}
          <div className="flex items-center space-x-0.5 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400" />
            ))}
          </div>
        </div>

        {/* Quote */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic mb-6">
          "{active.content}"
        </p>

        {/* Carousel Nav & Pagination */}
        <div className="flex items-center justify-between pt-2">
          {/* Navigation Arrows */}
          <div className="flex items-center space-x-2">
            <button
              onClick={prevReview}
              className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-300 transition-colors"
              title="Previous review"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextReview}
              className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-300 transition-colors"
              title="Next review"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Dots */}
          <div className="flex space-x-1.5">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  currentIndex === idx ? 'bg-[#1a56db] w-4' : 'bg-gray-300'
                }`}
                title={`Review ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
