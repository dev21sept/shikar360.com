import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppTab = () => {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/917428800111?text=Hello%20Shikhar360,%20I%20want%20to%20know%20more%20about%20admissions%20and%20colleges', '_blank');
  };

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 shadow-2xl">
      <button
        onClick={handleWhatsAppClick}
        className="flex items-center space-x-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-3 py-3 rounded-l-lg transition-all duration-300 group hover:shadow-xl select-none"
        style={{
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          transform: 'rotate(180deg)'
        }}
        title="Chat on WhatsApp +91 7428 800 111"
      >
        <span className="text-xs font-bold tracking-wide flex items-center gap-2">
          Chat on WhatsApp
        </span>
        <MessageCircle className="w-4 h-4 fill-white -rotate-90 group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );
};

export default WhatsAppTab;
