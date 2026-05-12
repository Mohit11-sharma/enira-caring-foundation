export default function TrainingFormatsSection() {
    const formats = [
    {
      title: 'Fundamental Debate Skills',
      desc: 'Training in conventional debates and group discussions to enhance structured argumentation and consensus building.'
    },
    {
      title: 'Impromptu Speaking and Adaptability Skills',
      desc: 'Extempore and turncoat formats develop quick thinking and the ability to argue multiple perspectives.'
    },
    {
      title: 'Formal Debate Procedures',
      desc: 'Parliamentary and presidential debates teach strategic argumentation within formal rules and time constraints.'
    },
    {
      title: 'Simulated Legislative and Legal Forums',
      desc: 'Model UN, Youth Parliament, and Moot Courts provide experiential learning in debate flow and advocacy.'
    },
    {
      title: 'Professional Business Communication',
      desc: 'Business conclaves focus on presentations, negotiation, and leadership communication in corporate settings.'
    }
  ];

  return (
    <section className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
        Formats & Modules — Public Speaking and AI Enablement
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {formats.map((format, idx) => (
          <div 
            key={idx} 
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                {idx + 1}
              </div>
              <h3 className="text-lg font-bold text-gray-800">{format.title}</h3>
            </div>
            <p className="text-sm text-gray-600 ml-11">{format.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}