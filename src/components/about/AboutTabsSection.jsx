import { useState } from "react";


const tabs = [
	{
		label: "Our Mission",
		content: (
			<>
				<p className="text-gray-700 mb-4">
					At Enira Caring Foundation, our mission is to help people build better lives through the power of learning, earning, and caring for the environment. We believe that real change happens when people have the right skills, the chance to start something of their own, and a clean, healthy planet to live on.
					<br /><br />
					We focus on three important things, which we call the 3Es:
				</p>
				<ul className="list-disc pl-5 mb-4 text-gray-700">
					<li>Employability: We help young people and women learn new skills so they can get good jobs. These skills include computer use, communication, and job training.</li>
					<li>Entrepreneurship: We encourage and support individuals in starting their own businesses by providing training, resources, and mentorship.</li>
					<li>Environmental Sustainability: We promote eco-friendly practices and initiatives to protect our planet for future generations.</li>
				</ul>
				<p className="text-gray-700">
				Together, these 3Es help us create a strong, fair, and green India where everyone has a chance to grow, earn, and live a better life.
				</p>
			</>
		),
		img: "media/about-tab-1.jpg",
	},
	{
		label: "Our Vision",
		content: (
			<>
				<p className="text-gray-700 mb-4">
				At Enira Caring Foundation, our vision is to create a better and fairer world for everyone. We dream of communities where people are strong, skilled, and supported. Our vision is built on the 3Es:
				</p>
				<ul className="list-disc pl-5 mb-4 text-gray-700">
					<li>Empowerment: We aim to empower individuals by providing them with the tools and resources they need to succeed.</li>
					<li>Education: We believe that education is the key to breaking the cycle of poverty and creating a brighter future.</li>
					<li>Environment: We are committed to protecting our planet and promoting sustainable practices for future generations.</li>
				</ul>
				<h3 className="text-2xl font-bold mb-3">We imagine a future where:</h3>
				<ul className="list-disc pl-5 mb-4 text-gray-700">
					<li>Everyone gets the chance to learn, grow, and succeed</li>
					<li>Women and youth feel empowered and respected</li>
					<li>The planet is greener and ready for the next generation</li>
					<li>Villages and cities are clean, safe, and healthy</li>
				</ul>
			</>
		),
		img: "media/about-tab-2.jpg",
	},
	{
		label: "Our History",
		content: (
			<>
				<h3 className="text-2xl font-bold mb-3">Rooted in Purpose, Growing with Impact</h3>
				<p className="text-gray-700 mb-4">
					What began as a small initiative with a big dream has today evolved into a movement of change. Founded with the vision to uplift underserved communities, our journey started with a handful of volunteers and a single mission — to bring dignity, opportunity, and hope to every doorstep.
				</p>
				<p className="text-gray-700 mb-4">
					From our early efforts in education and health camps to now touching lives across livelihoods, sanitation, sports, and culture, every milestone has been a testament to community power, empathy, and resilience.
				</p>
				<p className="text-gray-700">
				This is not just our story — it's the story of every life we've impacted, every voice we've uplifted, and every future we've helped shape.
				</p>
			</>
		),
		img: "media/about-tab-3.jpg",
	},
];

export default function AboutTabsSection() {
	const [active, setActive] = useState(0);

	return (
		<section className="w-full bg-[#232532] py-10 sm:py-16">
			<div className="max-w-5xl mx-auto px-2 sm:px-4">
				{/* Book style container */}
				<div className="relative bg-white rounded-3xl shadow-2xl grid grid-cols-1 md:grid-cols-2 overflow-hidden border-4 border-yellow-300">
					{/* Book spine */}
					<div className="absolute left-0 top-0 h-full w-4 bg-gradient-to-b from-yellow-300 via-yellow-200 to-yellow-100 rounded-l-3xl shadow-lg z-20 hidden md:block" />
					{/* Left Page (Image) */}
					<div className="p-0 flex items-center justify-center bg-gradient-to-br from-green-50 via-yellow-50 to-white relative min-h-[220px]">
						<div className="w-full h-full flex items-center justify-center">
							<img
								src={tabs[active].img}
								alt={tabs[active].label}
								width={320}
								height={220}
								className="rounded-xl object-cover w-full max-w-[320px] sm:max-w-[420px] h-[180px] sm:h-[320px] md:h-[380px] shadow-lg"
								loading="lazy"
							/>
						</div>
						{/* Decorative page curl */}
						<div className="absolute right-0 bottom-0 w-10 h-10 sm:w-16 sm:h-16 bg-gradient-to-tr from-yellow-200 via-yellow-100 to-transparent rounded-br-3xl opacity-40 pointer-events-none" />
					</div>
					{/* Right Page (Content) */}
					<div className="p-4 sm:p-8 md:p-10 flex flex-col justify-center bg-gradient-to-br from-yellow-50 via-green-50 to-white relative">
						{/* Tabs styled as book chapters */}
						<div className="flex gap-2 sm:gap-8 mb-4 sm:mb-6 border-b border-yellow-200 overflow-x-auto">
							{tabs.map((tab, idx) => (
								<button
									key={tab.label}
									className={`pb-2 font-bold text-base sm:text-lg transition-colors tracking-wide whitespace-nowrap ${
										active === idx
											? "text-green-600 border-b-4 border-yellow-400 bg-yellow-100 rounded-t-xl shadow"
											: "text-gray-500 border-b-4 border-transparent hover:text-green-600"
									}`}
									onClick={() => setActive(idx)}
								>
									{tab.label}
								</button>
							))}
						</div>
						{/* Tab Content */}
						<div>{tabs[active].content}</div>
					</div>
				</div>
			</div>
		</section>
	);
}