import { useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import { Link } from "react-router-dom";

const slides = [
    {
        img: "/change/home.jpg",
        quote: "Empower Communities for a Better Tomorrow.",
        title: "Together We Can Make a Difference",
        desc: "At Enira Caring Foundation, we believe in empowering communities through education, healthcare, environment, and livelihoods. Every small step brings hope, dignity, and opportunity—because change begins when we care together..",
    },
];

export default function HomeCarousel() {
    const [current, setCurrent] = useState(0);
    const [animating, setAnimating] = useState(false);

    const nextSlide = () => {
        setAnimating(true);
        setTimeout(() => {
            setCurrent((current + 1) % slides.length);
            setAnimating(false);
        }, 400);
    };

    const prevSlide = () => {
        setAnimating(true);
        setTimeout(() => {
            setCurrent((current - 1 + slides.length) % slides.length);
            setAnimating(false);
        }, 400);
    };

    return (
        <div className="w-full max-w-9xl mx-auto mt-24 mb-0 px-4 relative">
            {/* Carousel Images */}
            <div className="relative rounded-2xl overflow-hidden shadow-lg">
                {/* Decorative Frame Border */}
                <div className="absolute inset-0 z-30 pointer-events-none">
                    <div
                        className="h-full w-full rounded-2xl border-4 border-white"
                        style={{
                            boxShadow:
                                "0 0 0 6px rgba(16,185,129,0.15), 0 0 0 12px rgba(59,130,246,0.10)",
                        }}
                    />
                </div>

                {/* Carousel Content */}
                <div
                    className={`transition-all duration-500 ${
                        animating ? "opacity-0 scale-95" : "opacity-100 scale-100"
                    }`}
                >
                    <img
                        src={slides[current].img}
                        alt={slides[current].title}
                        width={900}
                        height={600}
                        className="w-full h-[530px] object-cover"
                       
                    />

                    {/* Left Blur Overlay */}
                    <div className="">
                        <div
                            className="h-full w-full"
                            style={{
                                background:
                                    "linear-gradient(90deg, rgba(16,185,129,0.75) 0%, rgba(251, 209, 0, 1) 40%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0) 100%)",
                                backdropFilter: "blur(1px)",
                            }}
                        />
                    </div>

                    {/* Overlay Content */}
                    <div className="absolute inset-0 flex flex-col justify-center items-start px-8 py-6 z-20">
                        <span className="flex items-center gap-2 text-xl md:text-base text-yellow-300 font-semibold -ml-4 mb-0 animate-fade-in">
                            <img
                                src="/change/(1).png"
                                alt="logo"
                                className="w-12 h-12"
                            />
                            {slides[current].quote}
                        </span>

                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 animate-slide-up">
                            {slides[current].title}
                        </h2>

                        <p className="text-base md:text-md text-gray-100 mb-4 max-w-xl animate-fade-in">
                            {slides[current].desc}
                        </p>

                        {/* CTA + Active Donors Row */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                            {/* Donate Button */}
                            <Link to="/donations">
                                <button className="group flex items-center gap-2 px-6 py-2 rounded-full bg-yellow-400 text-white font-bold shadow-lg transition-all duration-300 hover:bg-yellow-500 overflow-hidden">
                                    <span className="relative z-10">Donate Now</span>
                                    <span className="relative z-10 transition-transform duration-500 group-hover:-translate-x-2">
                                        <FaArrowRight size={18} />
                                    </span>
                                </button>
                            </Link>

                            {/* Active Donors */}
                            <div className="flex items-center">
                                <div className="flex -space-x-3">
                                    <img
                                        src="/change/1.png"
                                        alt="Person"
                                        className="w-10 h-10 rounded-full border-2 border-white shadow-md object-cover"
                                    />
                                    <img
                                        src="/change/3.png"
                                        alt="Person"
                                        className="w-10 h-10 rounded-full border-2 border-white shadow-md object-cover"
                                    />
                                    <img
                                        src="/change/10k.png"
                                        alt="Person"
                                        className="w-10 h-10 rounded-full border-2 border-white shadow-md object-cover"
                                    />
                                    <img
                                        src="/change/50.png"
                                        alt="Person"
                                        className="w-10 h-10 rounded-full border-2 border-white shadow-md object-cover"
                                    />
                                </div>
                                <div className="ml-3">
                                    <span className="block text-lg font-extrabold text-white">
                                        
                                    </span>
                                    <span className="text-sm text-yellow-400 font-medium">
                                        Active Donors
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}