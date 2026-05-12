import { Link } from "react-router-dom";
import { FaCrosshairs, FaGift,FaDonate, } from "react-icons/fa";
import { useState } from "react";
import { FaChildren } from 'react-icons/fa6';

export default function AboutSection() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const statsData = [
    { icon: FaChildren, count: "150+", label: "Happy Children", bgImage: "url(/change/happy.jpg)" },
    { icon: FaCrosshairs, count: "50+", label: "Volunteers", bgImage: "url(/change/donor.jpg)" },
    { icon: FaGift, count: "178+", label: "Our Products & Gifts", bgImage: "url(/change/product.jpg)" },
    { icon: FaDonate, count: "50+", label: "Active Donors", bgImage: "url(/change/50++donors.jpg)"}
  ];

  const accordionData = [
    { title: "Create Lasting Impact", desc: "Be a part of initiatives in education, empowerment, environment, and Sustainability that directly improve lives." },
    { title: "Learn and Grow", desc: "Gain new skills, experiences, and perspectives that empower you personally and professionally." },
    { title: "Be Part of a Community", desc: "Join a network of compassionate individuals working together to build a brighter, sustainable future." }
  ];

  return (
    <>
      {/* Stats Section (Circle Boxes) */}
      <section className="w-full bg-gray-50 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 text-center">
            {statsData.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="group relative flex flex-col items-center justify-center w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 mx-auto rounded-full shadow-xl border border-gray-400 overflow-hidden hover:scale-105 hover:shadow-2xl transition-all duration-500">
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ backgroundImage: stat.bgImage }}
                  ></div>
                  <div className="relative z-10 flex flex-col items-center p-2">
                    <IconComponent className="text-green-600 text-2xl sm:text-3xl lg:text-5xl mb-1 sm:mb-2 lg:mb-3 drop-shadow-lg" />
                    <span className="text-lg sm:text-xl lg:text-2xl font-extrabold text-gray-800 group-hover:text-white transition-colors duration-500">{stat.count}</span>
                    <span className="text-xs sm:text-sm font-semibold text-gray-500 group-hover:text-yellow-200 transition-colors duration-500 text-center leading-tight">{stat.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="w-full bg-gray-50 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            {/* Left Image */}
            <div className="flex justify-center order-2 lg:order-1">
              <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg w-full max-w-md lg:max-w-none">
                <img
                  src="/change/donor.jpg"
                  alt="volunteers"
                  className="w-full h-[250px] sm:h-[300px] lg:h-[420px] object-cover"
                />
                <div className="absolute inset-0 rounded-2xl lg:rounded-3xl pointer-events-none"></div>
              </div>
            </div>

            {/* Right Text */}
            <div className="order-1 lg:order-2">
              <span className="text-sm font-semibold text-green-700 uppercase">❤ Join Us</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mt-2 mb-4 sm:mb-6">
                Why We Need You to Become a Volunteer.
              </h2>
              <p className="text-gray-700 mb-6 text-sm sm:text-base leading-relaxed">
                At Enira Caring Foundation, we believe true change happens when people come together. As a volunteer, you help spread hope, dignity, and opportunity to those who need the most.
              </p>

              {/* Accordion */}
              <div className="space-y-3 sm:space-y-4">
                {accordionData.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl bg-white overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg">
                    {/* Header Button */}
                    <button
                      onClick={() => toggleAccordion(index)}
                      className="w-full flex justify-between items-center px-4 sm:px-6 py-4 sm:py-5 font-semibold text-gray-900 hover:bg-gray-100 transition-colors duration-300 text-left"
                    >
                      <span className="flex-1 tracking-wide text-sm sm:text-base">{item.title}</span>
                      <span className="text-green-600 font-bold text-xl sm:text-2xl leading-none ml-2">
                        {activeIndex === index ? "−" : "+"}
                      </span>
                    </button>

                    {/* Accordion Body */}
                    <div
                      className={`px-4 sm:px-6 text-gray-700 overflow-hidden transition-[max-height] duration-500 ease-in-out ${
                        activeIndex === index ? "max-h-32 sm:max-h-64 py-3 sm:py-4" : "max-h-0 py-0"
                      }`}
                    >
                      <p className="leading-relaxed text-sm sm:text-base">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
