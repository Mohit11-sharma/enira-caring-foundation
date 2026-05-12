import { FaHeart, FaUsers, FaPhoneAlt, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function AboutIntro() {
  return (
    <section className="w-full bg-white py-10 sm:py-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center px-2 sm:px-4">
        {/* Left: Heart/Experience/Images */}
        <div className="relative flex items-center justify-center min-h-[180px]">
          {/* Heart shape background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <img
              src="change/about(6).jpg"
              alt="Heart"
              width={240}
              height={240}
              className="w-[200px] sm:w-[240px] md:w-[340px] lg:w-[450px] h-auto"
              loading="lazy"
            />
          </div>
        </div>
        {/* Right: Text Content */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FaHeart className="text-green-500" />
            <span className="text-green-500 font-bold text-base sm:text-lg">About US</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
            Helping Each Other can Make World Better
          </h2>
          <p className="text-gray-700 mb-6 text-base md:text-lg">
            From education to livelihood, health to heritage — we drive change where it matters most.
            More than just a foundation, we are a movement of hope and empowerment.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 font-bold text-green-600">
                <FaUsers />
                Start Helping Team
              </div>
              <div className="text-gray-500 text-sm">There are many variations of solve</div>
            </div>
            <div className="flex -space-x-4">
          
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <Link to="/shop">
              <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-yellow-400 text-white font-bold shadow hover:bg-yellow-500 transition text-base">
                Explore More <FaArrowRight />
              </button>
            </Link>
            <div className="flex items-center gap-2 text-gray-700 font-semibold">
              <FaPhoneAlt className="text-green-500" />
              <span>Call Any Time</span>
              <span className="ml-2 text-gray-900 font-bold">+91 9889200005</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}