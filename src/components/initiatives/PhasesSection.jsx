export default function PhasesSection() {
  const phases = [
    {
      title: 'Phase 1: Awareness',
      activities: [
        'Surveys & Storytelling',
        'Safe Spaces Creation',
        'Leadership Training',
        'Skill Development Sessions'
      ]
    },
    {
      title: 'Phase 2: Agency & Skill Development',
      activities: [
        'Legal Literacy',
        'Confidence Building',
        'Mentorship Networks',
        'Vocational Training'
      ]
    }
  ];

  return (
    <section className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
        Implementation Phases
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {phases.map((phase, idx) => (
          <div 
            key={idx}
            className="bg-gradient-to-br from-pink-50 to-white rounded-lg p-6 border-2 border-pink-200"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {phase.title}
            </h3>
            <ul className="space-y-2">
              {phase.activities.map((activity, actIdx) => (
                <li 
                  key={actIdx}
                  className="flex items-center gap-2 text-gray-700"
                >
                  <div className="w-2 h-2 rounded-full bg-pink-500" />
                  <span className="text-sm sm:text-base">{activity}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
