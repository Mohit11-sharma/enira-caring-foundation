import { Check } from 'lucide-react';

export default function ObjectivesSection() {
  const objectives = [
    'Build real-life strength through self-defence and negotiation training',
    'Foster independence in decision-making',
    'Create awareness about legal rights and opportunities',
    'Enable financial and social self-resilience',
    'Protect basic rights and ensure access to resources'
  ];

  return (
    <section className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
        Our Objectives
      </h2>
      <div className="space-y-4">
        {objectives.map((objective, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-4 h-4 text-white" />
            </div>
            <p className="text-sm sm:text-base text-gray-700">
              {objective}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}