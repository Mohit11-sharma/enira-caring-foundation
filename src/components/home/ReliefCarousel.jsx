import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const reliefItems = [
  { id: 1, title: "Anand Gupta", role: "Donor", desc: "Donating at Enira gave me an opportunity to contribute for the needy, with complete transparency and trust." },
  { id: 2, title: "Rajeev Dwivedi", role: "Volunteer", desc: "Having been a part of a food drive, living the moment in itself gives you peace which can’t be bought with money." },
  { id: 3, title: "Prakhar Kumar", role: "Donor", desc: "Had millions of thoughts before contributing, but Enira truly dedicates their workforce for a real life change." },
  { id: 4, title: "Trisha Chauhan", role: "Project Collaborator", desc: "Joined Enira in their education initiative, felt that it's something actually required in our Indian education system. Appreciable efforts for taking the responsibility for change." },
  { id: 5, title: "Ayushi Kapoor", role: "Workshop Participant", desc: "Got introduced to the organisation via an online seminar, looked into the employable education program, had an opportunity to interact with the kids and felt the need to contribute. Hence Enira gets the green flag." },
  { id: 6, title: "Md. Rehan", role: "Donor", desc: "Working with targeted requirements of the needy is what Enira specializes for, relevant utility of resources and transparent process is what makes me contribute to their initiatives." },
  { id: 7, title: "Akanksha Singh", role: "Member", desc: "Volunteering with the foundation for the past 6 months, had a few disagreements with the functioning. I was given my space to keep the point of view, discussed and changes made. The directors here never make you feel the hierarchical difference."},
  { id: 8, title: "Kshitij Arora", role: "Intern", desc: "I joined the organisation as an intern solely for an LOR, now working here part-time voluntarily just because of the opportunity to network along with a change-making contribution to multiple lives."},
  { id: 9, title: "Kashish Yadav", role: "Project Participant", desc: "Testifying the organisation becomes difficult when you yourself are a part of one of their programs and still in the process of change-making within yourself, since you fall short of words. Simply thanking for letting me in this opportunity."},
];

export default function AutoScrollCarousel() {
  const scrollRef = useRef(null);

  // Scroll buttons (if you want)
  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -250, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 250, behavior: "smooth" });
  };

  const handleMouseEnter = () => {
    if (scrollRef.current) {
      scrollRef.current.style.animationPlayState = "paused";
    }
  };

  const handleMouseLeave = () => {
    if (scrollRef.current) {
      scrollRef.current.style.animationPlayState = "running";
    }
  };

  return (
    <section className="w-full py-16 bg-gray-70 relative">
      <div className="max-w-7xl mx-auto px-4 text-center relative">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-10 drop-shadow-lg">
          Testimonials
        </h2>

        {/* Auto-scroll wrapper */}
        <div
          className="overflow-hidden relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            ref={scrollRef}
            className="flex gap-6 animate-scroll overflow-x-scroll no-scrollbar scroll-smooth mt-2 mb-2"
          >
            {[...reliefItems, ...reliefItems].map((item, index) => (
              <div
                key={index}
                className="bg-white mt-5 mb-5 rounded-2xl shadow-lg border border-gray-200 p-4 flex flex-col justify-between text-center 
                           transition duration-300 w-70 h-70 flex-shrink-0  
                           hover:scale-105 hover:shadow-2xl hover:brightness-105"
              >
                <p className="text-gray-600 italic mb-4 flex-1">
                  "{item.desc}"
                </p>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">
                    {item.title}
                  </h3>
                  <span className="text-sm text-yellow-600 font-medium">
                    {item.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tailwind custom animation */}
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 60s linear infinite;
          width: max-content;
          animation-play-state: running;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
