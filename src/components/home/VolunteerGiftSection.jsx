
import { FaHandHoldingHeart, FaGift, FaUserPlus, FaDollarSign } from "react-icons/fa";
import { Link } from 'react-router-dom';

export default function VolunteerGiftSection() {
  return (
    <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-0 items-stretch">
      {/* Left: Become a Volunteer */}
      <div className="relative flex items-center justify-center min-h-[320px] h-[420px]">
        {/* Minimal background image with subtle overlay */}
        <img
          src="/home-slide/slide1.jpg"
          alt="Volunteer"
          fill
          className="object-cover w-full h-full"
          priority
        />
        <div className="absolute inset-0 bg-green-900/20 backdrop-blur-sm" />
        {/* Content */}
        <div className="relative z-10 p-6 md:p-10 flex flex-col items-start justify-center text-white w-full h-full">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 flex items-center gap-2">
            <FaUserPlus className="text-yellow-300" size={24} />
            Become A Volunteer
          </h2>
          <p className="mb-4 text-base font-normal opacity-80">
            Dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit The aspernatur aut odit aut fugit, sed quia consequuntur. Nonprofits around the world apply.
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="flex items-center gap-1 px-3 py-1 rounded bg-white/10 text-white text-sm">
              <FaHandHoldingHeart className="text-yellow-300" /> Donate Money
            </span>
            <span className="flex items-center gap-1 px-3 py-1 rounded bg-white/10 text-white text-sm">
              <FaHandHoldingHeart className="text-yellow-300" /> Handle With Care
            </span>
            <span className="flex items-center gap-1 px-3 py-1 rounded bg-white/10 text-white text-sm">
              <FaUserPlus className="text-yellow-300" /> Volunteer
            </span>
          </div>
          <button className="mt-1 px-6 py-2 rounded bg-yellow-400 text-white font-bold shadow hover:bg-yellow-500 transition text-sm">
            Join Us
          </button>
        </div>
      </div>
      {/* Right: Send a Gift For Children's */}
      <div className="relative flex items-center justify-center min-h-[320px] h-[420px]">
        {/* Minimal background image with subtle overlay */}
        <img
          src="/home-slide/slide3.jpg"
          alt="Send Gift"
          fill
          className="object-cover w-full h-full"
          priority
        />
        <div className="absolute inset-0 bg-yellow-400/20 backdrop-blur-sm" />
        {/* Content */}
        <div className="relative z-10 p-6 md:p-10 flex flex-col items-start justify-center text-gray-900 w-full h-full">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 flex items-center gap-2 text-yellow-500">
            <FaGift className="text-yellow-400" size={24} />
            Send a Gift For Children's
          </h2>
          <p className="mb-4 text-base font-normal text-gray-800 opacity-80">
            Dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit The aspernatur aut odit aut fugit, sed quia.
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {["$10", "$20", "$30", "$40", "$50"].map((amt) => (
              <span
                key={amt}
                className="flex items-center gap-1 px-3 py-1 rounded bg-yellow-100 text-yellow-700 text-sm"
              >
                <FaDollarSign className="text-yellow-400" /> {amt}
              </span>
            ))}
            <span className="flex items-center gap-1 px-3 py-1 rounded bg-blue-100 text-blue-700 text-sm">
              10 Gifts
            </span>
          </div>
          <Link to="/donations">
            <button className="mt-1 px-6 py-2 rounded bg-yellow-400 text-white font-bold shadow hover:bg-yellow-500 transition text-sm">
              Donate Now
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}