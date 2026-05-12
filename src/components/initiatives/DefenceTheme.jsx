import React from 'react';
import InstagramFeed from '../InstagramFeed';

export default function DefenceTheme() {
  const themePoints = [
    { letter: 'D', word: 'Define', desc: 'Establishing identity & boundaries' },
    { letter: 'E', word: 'Empower', desc: 'Building inner and outer strength' },
    { letter: 'F', word: 'Function', desc: 'Operating independently in all spheres' },
    { letter: 'E', word: 'Efficiency', desc: 'Using resources wisely & effectively' },
    { letter: 'N', word: 'Negotiating', desc: 'Advocating for rights and needs' },
    { letter: 'C', word: 'Cater', desc: 'Addressing personal, social, and economic needs' },
    { letter: 'E', word: 'Exclusivity', desc: 'Protecting dignity and self-worth' }
  ];

  const stats = [
    { value: '95%', label: 'Increased Confidence' },
    { value: '85%', label: 'Greater Autonomy' },
    { value: '40%', label: 'Economic Participation' }
  ];

  return (
    <div className="mb-8 px-4 sm:px-6 lg:px-8">
      {/* Stats Section */}
      <section className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl shadow-md p-4 sm:p-6 text-center border border-pink-100">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm lg:text-base text-gray-600">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,minmax(320px,450px)] gap-6 lg:gap-8">
        {/* Left Section - SELF DEFENCE */}
        <section className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">
            Our Approach: SELF DEFENCE
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            {themePoints.map((point, idx) => (
              <div 
                key={idx} 
                className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg p-3 sm:p-4 lg:p-6 border border-pink-100"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 flex items-center justify-center text-white font-bold text-base sm:text-lg flex-shrink-0">
                    {point.letter}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800 mb-1">
                      {point.word}
                    </h3>
                    <p className="text-xs sm:text-sm lg:text-base text-gray-600">
                      {point.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right Side - Instagram Feed */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <InstagramFeed />
        </div>
      </div>
    </div>
  );
}