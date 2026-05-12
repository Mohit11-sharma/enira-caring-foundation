import { Utensils, ArrowLeft } from 'lucide-react';
export default function KshudhaNirvanaHero() {
  return (
    <div className="bg-gray-50">
      {/* Hero Header Section */}
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-red-600 text-white py-12 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
                    onClick={() => navigate('/')}
                    className="flex items-center text-white/90 hover:text-white mb-6 sm:mb-8 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Home
                  </button>
          {/* Title Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-6">
            <Utensils className="w-12 h-12 sm:w-16 sm:h-16" />
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
                Kshudha Nirvana: Fight Against Hunger
              </h1>
              <p className="text-lg sm:text-xl text-white/90">
                Every Rupee. Every Meal. Every Heartbeat Counts.
              </p>
            </div>
          </div>
          
          <p className="text-base sm:text-lg max-w-3xl mt-6">
            Empowering communities through transparent meal distribution, skill development, and awareness programs. Join us in our mission to end hunger, one meal at a time.
          </p>
        </div>
      </div>
    </div>
  );
}