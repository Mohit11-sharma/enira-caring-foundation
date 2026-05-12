
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";

const team = [
	{
		name: "John Doe",
		role: "Attorney",
		img: "media/team-1.jpg",
	},
	{
		name: "John Doe",
		role: "Attorney",
		img: "media/team-2.jpg",
	},
	{
		name: "John Doe",
		role: "Attorney",
		img: "media/team-3.jpg",
	},
	{
		name: "John Doe",
		role: "Attorney",
		img: "media/team-4.jpg",
	},
];

export default function AboutTeamSection() {
	return (
		<section className="w-full bg-white py-16">
			<div className="max-w-7xl mx-auto px-4">
				<div className="mb-8">
					<span className="text-green-600 font-bold uppercase text-sm">
						Our Team
					</span>
					<h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2 mb-4 leading-tight">
						Skilled Legal Professionals
						<br />Dedicated to You
					</h2>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
					{team.map((member, idx) => (
						<div
							key={idx}
							className="group flex flex-col items-center rounded-2xl shadow-lg transition-all duration-300 overflow-hidden bg-gray-50 hover:bg-green-600 cursor-pointer"
						>
							<div className="w-full h-64 flex items-center justify-center relative">
								<img
									src={member.img}
									alt={member.name}
									width={220}
									height={220}
									className="object-cover w-full h-full transition-all duration-300 group-hover:scale-105"
								/>
								{/* Details on hover */}
								<div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
									<div className="absolute inset-0 bg-green-700/80" />
									<div className="relative z-10 flex flex-col items-center justify-center h-full">
										<div className="text-white text-lg font-bold mb-1">
											{member.name}
										</div>
										<div className="text-green-100 text-sm mb-4">
											{member.role}
										</div>
										<div className="flex gap-3">
											<a
												href="#"
												className="bg-white/20 p-2 rounded-full hover:bg-white/40 transition text-white"
											>
												<FaFacebookF />
											</a>
											<a
												href="#"
												className="bg-white/20 p-2 rounded-full hover:bg-white/40 transition text-white"
											>
												<FaTwitter />
											</a>
											<a
												href="#"
												className="bg-white/20 p-2 rounded-full hover:bg-white/40 transition text-white"
											>
												<FaLinkedinIn />
											</a>
										</div>
									</div>
								</div>
							</div>
							{/* Name/Role only visible when not hovered */}
							<div className="w-full text-center py-4 bg-white group-hover:bg-green-600 transition-all duration-300">
								<div className="font-bold text-lg text-gray-900 group-hover:text-white">
									{member.name}
								</div>
								<div className="text-sm text-gray-500 group-hover:text-green-100">
									{member.role}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}