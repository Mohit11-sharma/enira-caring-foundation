import { useNavigate } from 'react-router-dom';

const features = [
  {
    image: "/change/shaktijagrati.jpg",
    title: "STEER : Skill Training to Enable Employable Relevance",
    desc: "STEER empowers individuals with practical skills, industry knowledge, and confidence for sustainable, employable careers...",
    slug: "public-speaking"
  },
  {
    image: "/change/empowerment.jpg",
    title: "Awakening of Shakti",
    desc: "Awakening of Shakti is a transformative women empowerment program that nurtures confidence, leadership, creativity, and inner strength, enabling women to realize their true potential and inspire change...",
    slug: "women-empowerment"
  },
  {
    image: "/change/food donation.jpg",
    title: "Kshudha Nirvana",
    desc: "Kshudha Nirvana is a social initiative combating hunger through sustainable food distribution, community participation, and awareness, ensuring dignity, nourishment, and hope for vulnerable sections of society....",
    slug: "kshudha-nirvana"
  },
  {
    image: "/change/plantation.jpg",
    title: "Nurturing Nature",
    desc: "Nurturing Nature is a targeted plantation drive dedicated to restoring green cover, promoting sustainability, combating climate change, and inspiring communities towards environmental responsibility...",
    slug: null
  },
];

export default function HomeFeatures() {
  const navigate = useNavigate();

  const handleFeatureClick = (slug) => {
    if (slug) {
      navigate(`/initiatives/${slug}`);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 mt-12 sm:mt-16 mb-8 sm:mb-12">
      {/* Heading */}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-gray-900 mb-8 sm:mb-10 drop-shadow-lg">
        Our Initiatives
      </h2>
      
      {/* Feature Boxes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {features.map((f, idx) => (
          <div
            key={idx}
            onClick={() => handleFeatureClick(f.slug)}
            className={`bg-white rounded-2xl lg:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 flex flex-col items-center text-center border border-gray-100 transition-transform duration-300 hover:-translate-y-2 hover:border-yellow-400 group overflow-hidden ${
              f.slug ? 'cursor-pointer' : ''
            }`}
          >
            {/* Image */}
            <div className="mb-4 sm:mb-5 w-full h-32 sm:h-36 lg:h-40">
              <img
                src={f.image}
                alt={f.title}
                className="w-full h-full object-cover rounded-lg lg:rounded-xl"
              />
            </div>
            {/* Title */}
            <h3 className="font-extrabold text-sm sm:text-base lg:text-lg mb-2 text-gray-900 tracking-tight group-hover:text-yellow-500 transition-colors duration-300 drop-shadow leading-tight">
              {f.title}
            </h3>
            {/* Description */}
            <p className="text-gray-600 text-xs sm:text-sm mb-2 line-clamp-3 leading-relaxed">{f.desc}</p>
            {/* Underline on hover */}
            <span className="block h-1 w-8 sm:w-10 mx-auto rounded bg-gradient-to-r from-blue-400 via-yellow-400 to-green-400 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
          </div>
        ))}
      </div>
    </div>
  );
}