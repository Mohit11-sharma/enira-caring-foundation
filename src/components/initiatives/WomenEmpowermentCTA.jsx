export default function WomenEmpowermentCTA({ onDonateClick, onContactClick }) {
  return (
    <section className="bg-white rounded-xl shadow-lg p-8 sm:p-12 text-center">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
        Join the Mission
      </h2>
      <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
        Be a part of the journey for change. Your support can transform lives and build a better future.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onDonateClick}
          className="px-6 sm:px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
        >
          Donate Now
        </button>
        <button
          onClick={onContactClick}
          className="px-6 sm:px-8 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
        >
          Get Involved
        </button>
      </div>
    </section>
  );
}