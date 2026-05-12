
import { FaStar, FaQuoteLeft } from "react-icons/fa";

const testimonials = [
    {
        rating: 4.9,
        text: `Climb it see the world, not so the world can see you. This is due to their excellent service. Targ consultation apartments. ndulgence off under folly death wrote cause her yet a spite. Plan upon yet way cold spot its week. Almost do am or limits hearts. Resolve a hearts.`,
        name: "Esther Howard",
        role: "Web Designer",
        avatar: "/test-people-1.png",
        people: [
            "media/test-people-1.png",
            "media/test-people-2.png",
            "media/test-people-3.png",
            "media/test-people-4.png",
        ],
    },
    // Add more testimonials if needed
];

export default function AboutTestimonialsSection() {
    const t = testimonials[0];
    return (
        <section className="w-full bg-white py-16">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <span className="text-green-600 font-bold text-sm">Start donating poor people</span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2 mb-4 leading-tight">
                            What People Say About us
                        </h2>
                    </div>
                    <button className="px-6 py-2 rounded-full bg-yellow-400 text-white font-bold shadow hover:bg-yellow-500 transition text-base mt-4 md:mt-0">
                        All Testimonials
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    {/* Rating Card */}
                    <div className="bg-yellow-100 rounded-2xl p-8 flex flex-col items-center shadow">
                        <div className="text-5xl font-bold text-gray-900 mb-2">{t.rating}</div>
                        <div className="flex gap-1 mb-2">
                            {[...Array(4)].map((_, i) => (
                                <FaStar key={i} className="text-yellow-400" />
                            ))}
                            <FaStar className="text-yellow-300" />
                        </div>
                        <div className="text-gray-700 text-sm mb-2">5 Start Rating</div>
                        <div className="text-gray-500 text-center mb-4">
                            Sed ullamcorper tristique nisl at pharetra turpis accumsan et etiam eu sollicitudin eros. In imperdiet accumsan.
                        </div>
                        <div className="flex -space-x-4">
                            {t.people.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt="Person"
                                    width={48}
                                    height={48}
                                    className="rounded-full border-2 border-white"
                                />
                            ))}
                        </div>
                    </div>
                    {/* Testimonial Text */}
                    <div className="flex flex-col justify-center">
                        <FaQuoteLeft className="text-yellow-400 text-4xl mb-4" />
                        <p className="italic text-gray-700 mb-6">{t.text}</p>
                        <div className="flex items-center gap-4">
                            <img
                                src={t.avatar}
                                alt={t.name}
                                width={48}
                                height={48}
                                className="rounded-full border-2 border-green-600"
                            />
                            <div>
                                <div className="font-bold text-lg text-gray-900">{t.name}</div>
                                <div className="text-sm text-green-600">{t.role}</div>
                            </div>
                        </div>
                        {/* Arrows */}
                        <div className="flex gap-4 mt-8">
                            <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-green-50 transition">
                                &#8592;
                            </button>
                            <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-green-50 transition">
                                &#8594;
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}