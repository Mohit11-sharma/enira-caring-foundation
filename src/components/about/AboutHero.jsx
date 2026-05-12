import { Link } from 'react-router-dom';

export default function AboutHero() {
  return (
    <section className="relative w-full min-h-[220px] h-[340px] md:h-[420px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <img
        src="media/about-bg.jpg"
        alt="About Us"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 z-10" />
      {/* Title & Breadcrumb */}
      <div className="relative z-20 flex flex-col items-center justify-center w-full h-full px-2 sm:px-4">
        <h1 className="text-white text-2xl sm:text-4xl md:text-5xl font-extrabold mb-3 sm:mb-4 text-center drop-shadow-lg">
          About Us
        </h1>
        <div className="flex flex-wrap items-center gap-2 bg-gray-900/70 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-white text-sm sm:text-base font-medium shadow">
          <Link to="/" className="hover:text-orange-400 transition">Home</Link>
          <span className="mx-1">»</span>
          <span>About Us</span>
        </div>
      </div>
    </section>
  );
}