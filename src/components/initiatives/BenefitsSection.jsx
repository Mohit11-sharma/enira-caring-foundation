export default function TrainingMethodsSection() {
  const methods = [
    {
      title: 'Structured Learning Modules',
      desc: 'Training sessions provide foundational public speaking skills like voice modulation and audience engagement'
    },
    {
      title: 'Simulated Speaking Opportunities',
      desc: 'Mock practice sessions replicate real scenarios to build confidence and improve delivery through feedback'
    },
    {
      title: 'Internal Competitions',
      desc: 'Intra-institute contests foster peer learning, healthy competition, and continuous skill improvement'
    },
    {
      title: 'Diverse Exposure',
      desc: 'Inter-institute competitions enhance adaptability and leadership by engaging diverse participants and audiences'
    }
  ];

  return (
    <section className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
        Training Methods Employed
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {methods.map((method, idx) => (
          <div 
            key={idx} 
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-100"
          >
            <h3 className="text-lg font-bold text-gray-800 mb-2 uppercase tracking-wide">
              {method.title}
            </h3>
            <p className="text-sm text-gray-600">{method.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}