import { CheckCircle, Users, MapPin, Calendar, FileCheck, Handshake, MapPinned, Camera } from 'lucide-react';

export default function TransparencySection() {
  const features = [
    {
      icon: FileCheck,
      title: 'Official Documentation',
      description: 'Serially numbered receipts with NGO stamp for every donation'
    },
    {
      icon: Handshake,
      title: 'Community Engagement',
      description: 'Weekly food drives with donor tagging and recognition'
    },
    {
      icon: MapPinned,
      title: 'Location Tracking',
      description: 'Monthly summaries detailing locations covered and meals served'
    },
    {
      icon: Camera,
      title: 'Regular Updates',
      description: 'Weekly photos and videos showcasing direct impact'
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            TRUST & TRANSPARENCY
          </h2>
          <p className="text-xl text-orange-600 font-semibold">
            Building confidence through complete clarity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl mb-4">
                  <Icon className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}