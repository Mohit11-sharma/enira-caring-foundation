import { Users, ArrowLeft } from 'lucide-react';

export default function WomenEmpowermentHero({ onBackClick }) {

  return (
    <>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-600 text-white py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={onBackClick}
            className="flex items-center text-white/90 hover:text-white mb-6 sm:mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <Users className="w-12 h-12 sm:w-16 sm:h-16" />
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
                Chains to Bridges: Women Empowerment
              </h1>
              <p className="text-lg sm:text-xl text-white/90">
                Breaking Chains, Making Bridges
              </p>
            </div>
          </div>
          
          <p className="text-base sm:text-lg max-w-3xl mt-6">
            Empowering women through self-defence, skill development, and awareness programs.
          </p>
        </div>
      </div>

      
    </>
  );
}
