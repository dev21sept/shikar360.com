import React, { useState } from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import CategoryCards from '../components/CategoryCards';
import WhyChooseUs from '../components/WhyChooseUs';
import ExploreCoursesAndCompare from '../components/ExploreCoursesAndCompare';
import TopUniversitiesByCategory from '../components/TopUniversitiesByCategory';
import TestimonialsAndStats from '../components/TestimonialsAndStats';
import CTABanner from '../components/CTABanner';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import AuthModal from '../components/AuthModal';
import LeadModal from '../components/LeadModal';
import CompareModal from '../components/CompareModal';

export default function HomePage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(2);

  const handleSearchSubmit = (query) => {
    setLeadModalOpen(true);
  };

  const handleSelectPopularSearch = (item) => {
    setLeadModalOpen(true);
  };

  const handleSelectCategory = (categoryId) => {
    setLeadModalOpen(true);
  };

  const handleSelectCourse = (courseName) => {
    setLeadModalOpen(true);
  };

  const handleSelectUniversity = (university) => {
    setLeadModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans relative">
      {/* 1. Header (Sticky) */}
      <Header
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenCounselling={() => setLeadModalOpen(true)}
        wishlistCount={wishlistCount}
      />

      <main>
        {/* 2. Hero Section with Full Background Slider */}
        <HeroSection
          onSearchSubmit={handleSearchSubmit}
          onSelectPopularSearch={handleSelectPopularSearch}
          onOpenCounselling={() => setLeadModalOpen(true)}
        />

        {/* 3. 4 Category Cards */}
        <CategoryCards
          onSelectCategory={handleSelectCategory}
        />

        {/* 4. Why Choose Shikhar360 Strip */}
        <WhyChooseUs />

        {/* 5. Two-Column: Explore Top Courses + Compare Colleges Widget */}
        <ExploreCoursesAndCompare
          onOpenCompareModal={() => setCompareModalOpen(true)}
          onSelectCourse={handleSelectCourse}
        />

        {/* 6. Top Universities By Category Carousel */}
        <TopUniversitiesByCategory
          onSelectUniversity={handleSelectUniversity}
        />

        {/* 7. What Students Say Testimonial Carousel + Trusted By Thousands Stats */}
        <TestimonialsAndStats />

        {/* 8. Full-Width CTA Banner */}
        <CTABanner
          onOpenCounselling={() => setLeadModalOpen(true)}
        />
      </main>

      {/* 9. Footer */}
      <Footer />

      {/* Floating Circular WhatsApp Button at Bottom Right Corner */}
      <FloatingWhatsApp />

      {/* Interactive Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <LeadModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
      />

      <CompareModal
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        onOpenCounselling={() => setLeadModalOpen(true)}
      />
    </div>
  );
}
