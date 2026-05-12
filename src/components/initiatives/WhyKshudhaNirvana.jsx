import React, { useEffect } from 'react';
import { Heart, Utensils, GraduationCap } from 'lucide-react';

const InstagramFeed = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//www.instagram.com/embed.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
      }
    };

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const posts = [
    'https://www.instagram.com/reel/DPmbrgJE-ZQ/',
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        Follow Our Journey
      </h2>
      <p className="text-gray-600 mb-6">
        Stay connected with our latest initiatives and community impact
      </p>
      
      <div className="space-y-6">
        {posts.map((postUrl, index) => (
          <div 
            key={index}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <blockquote
              className="instagram-media"
              data-instgrm-permalink={postUrl}
              data-instgrm-version="14"
              style={{
                background: '#FFF',
                border: 0,
                borderRadius: '3px',
                boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
                margin: '1px',
                maxWidth: '540px',
                minWidth: '326px',
                padding: 0,
                width: '99.375%',
              }}
            >
              <a href={postUrl} target="_blank" rel="noopener noreferrer">
                View this post on Instagram
              </a>
            </blockquote>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-6">
        <a 
          href="https://www.instagram.com/eniracaringfoundation" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          Follow Us on Instagram
        </a>
      </div>
    </div>
  );
};

export default function WhyKshudhaNirvana() {
  const reasons = [
    {
      icon: Heart,
      title: "IMMEDIATE RELIEF",
      description: "Every meal provides dignity and hope to a family in need."
    },
    {
      icon: Utensils,
      title: "MORE THAN FOOD",
      description: "We serve hot, nutritious meals with compassion and respect."
    },
    {
      icon: GraduationCap,
      title: "FUELING THE FUTURE",
      description: "By alleviating hunger, we empower families to focus on education and a better life."
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-red-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Section - Full Width */}
        <div className="mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">10,000+</div>
              <div className="text-sm sm:text-base text-gray-600">Meals Distributed</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">Weekly</div>
              <div className="text-sm sm:text-base text-gray-600">Food Drives</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">100%</div>
              <div className="text-sm sm:text-base text-gray-600">Transparency</div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Why Kshudha Nirvana */}
          <div>
            <div className="text-center lg:text-left mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-6">
                WHY KSHUDHA NIRVANA?
              </h2>
              <p className="text-xl sm:text-2xl font-bold text-orange-600 mb-4">
                INDIA FACES A SILENT HUNGER CRISIS.
              </p>
              <p className="text-lg sm:text-xl text-gray-700">
                Every meal served by Kshudha Nirvana brings relief, dignity, and hope to a family in need.
              </p>
            </div>

            {/* Reason Cards */}
            <div className="space-y-6">
              {reasons.map((reason, idx) => {
                const Icon = reason.icon;
                return (
                  <div 
                    key={idx} 
                    className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow border-l-4 border-orange-500 flex items-start gap-4"
                  >
                    <div className="flex-shrink-0">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{reason.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{reason.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Side - Instagram Feed */}
          <div className="lg:sticky lg:top-8">
            <InstagramFeed />
          </div>
        </div>
      </div>
    </section>
  );
} 