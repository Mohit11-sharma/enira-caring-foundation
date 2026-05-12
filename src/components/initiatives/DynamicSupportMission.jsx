import { Heart, Instagram, Users, Megaphone, Utensils } from 'lucide-react';
import { Link } from 'react-router-dom';
import qrCodeImage from '../../assets/Eniraqr.png';

const initiativeContent = {
  'women-empowerment': {
    title: 'CHAINS TO BRIDGES',
    description: 'Join us in breaking chains and building bridges for women\'s independence.',
    gradient: 'from-pink-600 via-rose-700 to-pink-700',
    icon: Users,
    iconColor: 'text-pink-300',
    points: [
      'Every contribution builds confidence',
      '100% supports women\'s empowerment'
    ]
  },
  'public-speaking': {
    title: 'SKILL TRAINING TO ENABLE EMPLOYABLE RELEVANCE',
    description: 'Help us train the next generation of confident communicators and leaders.',
    gradient: 'from-blue-600 via-indigo-700 to-blue-700',
    icon: Megaphone,
    iconColor: 'text-blue-300',
    points: [
      'Every contribution develops skills',
      '100% supports youth training'
    ]
  },
  'kshudha-nirvana': {
    title: 'KSHUDHA NIRVANA',
    description: 'Join us in serving nutritious meals with dignity and hope.',
    gradient: 'from-green-900 via-teal-800 to-green-800',
    icon: Utensils,
    iconColor: 'text-green-300',
    points: [
      'Every contribution makes impact',
      '100% goes to our cause'
    ]
  }
};

export default function DynamicSupportMission({ initiative = 'kshudha-nirvana' }) {
  const content = initiativeContent[initiative] || initiativeContent['kshudha-nirvana'];
  const IconComponent = content.icon;

  return (
    <section className={`py-4 bg-gradient-to-r ${content.gradient} text-white relative overflow-hidden`}>
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full blur-2xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-2">
        {/* Single Row with Three Sections */}
        <div className="flex items-center justify-between gap-3">
          {/* Section 1: QR Code */}
          <div className="flex-shrink-0 text-center">
            <Link 
              to="/donations" 
              className="bg-white rounded-xl p-2 inline-block cursor-pointer hover:shadow-xl transition-all"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={qrCodeImage}
                  alt="QR Code" 
                  className="w-full h-full object-contain"
                />
              </div>
            </Link>
            <div className="text-xs mt-1 font-semibold">Click or Scan to Donate</div>
          </div>

          {/* Section 2: Mission Statement */}
          <div className="flex-1 min-w-0">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <IconComponent className="w-5 h-5 flex-shrink-0" />
                <h2 className="text-lg font-black">{content.title}</h2>
              </div>
              
              <p className="text-xs mb-2 leading-snug">
                {content.description}
              </p>

              <div className="space-y-1">
                {content.points.map((point, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <Heart className={`w-3 h-3 fill-current ${content.iconColor} flex-shrink-0`} />
                    <span className="text-xs">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Contact Info */}
          <div className="flex-shrink-0 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">              
              <div className="space-y-1 text-xs">
                <a 
                  href="https://www.instagram.com/eniracaringfoundation/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-0.5 hover:opacity-80 transition-opacity"
                >
                  <Instagram className="w-10 h-10" />
                </a>
                <a 
                  href="https://www.instagram.com/eniracaringfoundation/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-0.5 hover:opacity-80 transition-opacity"
                >
                  <h3 className="text-sm font-bold">Connect</h3>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
