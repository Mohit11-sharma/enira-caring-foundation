import { FileCheck, Database, Share2, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DonationFlow() {
  const steps = [
    {
      icon: '📋',
      title: 'COLLECTION',
      subtitle: 'Every donation is a promise we keep',
      points: [
        'Official receipts with unique serial numbers & NGO stamp',
        'Volunteers carry official, serially numbered receipts',
        '100% clarity and trust from the moment you donate'
      ],
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: '💾',
      title: 'RETENTION',
      subtitle: 'Your data, securely stored',
      points: [
        'All donations digitally logged with your details',
        'Name, phone, Instagram ID recorded for updates',
        'Secure database ensures accountability'
      ],
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: '📱',
      title: 'ENGAGEMENT',
      subtitle: 'Your impact, on display',
      points: [
        'One Follower Policy for community engagement',
        'Weekly Saturday food drives with donor tags',
        'Visual feedback showing direct impact'
      ],
      color: 'from-pink-500 to-pink-600'
    },
    {
      icon: '🤝',
      title: 'TRUST',
      subtitle: 'Complete transparency',
      points: [
        'Monthly contributions from ₹100, ₹200, or ₹500',
        'Instant hard-copy receipt + digital e-certificate',
        'Weekly photos/videos and monthly impact summaries'
      ],
      color: 'from-green-500 to-green-600'
    }
  ];

  return (
    <section className="py-16 sm:py-2 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            HOW YOUR DONATION FLOWS
          </h2>
          <p className="text-xl text-gray-600">
            Small acts, big impact, complete clarity
          </p>
        </div>

        {/* Flow Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {steps.map((step, idx) => (
            <div key={idx} className="relative">
              {/* Connection Line (hidden on mobile) */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-24 left-full w-full h-1 bg-gradient-to-r from-orange-300 to-red-300 -ml-4 z-0"></div>
              )}
              
              {/* Card */}
              <div className="relative bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all z-10">
                {/* Icon */}
                <div className="text-6xl mb-4 text-center">{step.icon}</div>
                
                {/* Title */}
                <div className={`bg-gradient-to-r ${step.color} text-white rounded-lg py-3 px-4 mb-4`}>
                  <h3 className="text-lg font-bold text-center">{step.title}</h3>
                </div>

                {/* Subtitle */}
                <p className="text-sm font-semibold text-gray-700 text-center mb-4">
                  {step.subtitle}
                </p>

                {/* Points */}
                <ul className="space-y-2">
                  {step.points.map((point, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-orange-500 mt-1">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 inline-block">
            <p className="text-2xl font-bold text-gray-900 mb-6">
              We ensure 100% clarity on how donations are utilized
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/donations">
                <button className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all transform hover:scale-105">
                  Donate Now
                </button>
              </Link>
              {/* <button className="bg-gray-800 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-700 transition-all">
                Track Impact
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}