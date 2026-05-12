export default function PublicSpeakingCTA({ onDonateClick, onContactClick }) {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-8 sm:p-12 text-center border border-blue-100">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
        Call to Action and Next Steps
      </h2>
      <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
        Our workshop is designed for young learners and early-career candidates. Over the course of multi-day sessions, participants gain:
        <ul className="list-disc list-inside mt-3 text-gray-600 text-sm">
          <li>Core speaking and presentation skills (structure, clarity, voice modulation)</li>
          <li>Debate & critical thinking practice to improve reasoning under pressure</li>
          <li>Introductory AI labs and prompt-literacy to use AI tools for research and content generation</li>
          <li>Project showcases, mentorship clinics, and a certificate to demonstrate competency</li>
        </ul>
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onDonateClick}
          className="px-6 sm:px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
        >
          Contribute / Sponsor
        </button>
        <button
          onClick={onContactClick}
          className="px-6 sm:px-8 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
        >
          Enroll Now (Apply & Register)
        </button>
      </div>
    </section>
  );
}