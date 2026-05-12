import React from 'react';
import InstagramFeed from '../InstagramFeed';

export default function SkillsSection() {
  const skills = [
    { name: 'Analytical Thinking', desc: 'Develops critical evaluation by breaking down complex problems and drawing logical conclusions' },
    { name: 'Language Proficiency', desc: 'Enhances clarity and expression for effective communication and cognitive sharpening' },
    { name: 'AI & Prompt Literacy', desc: 'Foundational understanding of AI tools and how to craft effective prompts for problem solving' },
    { name: 'Digital & Data Literacy', desc: 'Practical skills in using digital tools, handling data responsibly, and building small AI experiments' },
    { name: 'Voice Modulation', desc: 'Foundational public speaking skills for better audience engagement' },
    { name: 'Quick Thinking & Adaptability', desc: 'Developing ability to argue multiple perspectives through impromptu speaking and live problem solving' },
    { name: 'Prompt Engineering Basics', desc: 'Hands-on techniques for working with generative AI and extracting useful outputs' },
    { name: 'Ethical AI Awareness', desc: 'Principles of responsible AI use, bias awareness, and contextual safeguards' },
    { name: 'Project & Showcase Skills', desc: 'How to prepare capstone projects, presentations and employer-facing demos' },
    { name: 'Interview & CV Readiness', desc: 'Translate workshop outcomes into CV points, interview talking-points and portfolio materials' }
  ];
  
  const stats = [
    { value: '8+', label: 'Skills Developed' },
    { value: '100%', label: 'Certification Rate' },
    { value: '5+', label: 'Training Formats' }
  ];

  return (
    <div className="mb-8 px-4 sm:px-6 lg:px-8">
      {/* Stats Section - Full Width */}
      <section className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-md p-4 sm:p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-indigo-600 mb-2">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm lg:text-base text-gray-600">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Two Column Layout: Skills + Instagram */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,minmax(320px,450px)] gap-6 lg:gap-8">
        {/* Left Side - Skills */}
        <section className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
            Skills Developed Through the Workshop
          </h2>
          <div className="space-y-3 sm:space-y-4">
            {skills.map((skill, idx) => (
              <div 
                key={idx} 
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 sm:p-4 border border-blue-100 hover:border-blue-300 transition-all hover:shadow-md"
              >
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-1 sm:mb-2">
                  {skill.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  {skill.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Right Side - Instagram Feed */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <InstagramFeed />
        </div>
      </div>
    </div>
  );
}