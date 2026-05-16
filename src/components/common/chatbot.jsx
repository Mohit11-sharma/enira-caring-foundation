import { FaWhatsapp } from "react-icons/fa";

export default function chatbot() {
  return (
    <div className="fixed bottom-10 right-10">
      <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping"></span>
      <a
        href="https://wa.me/916390212000?text=Hi%20Enira%20Caring%20Foundation.%20I%20Have%20a%20Query."
        target="_blank"
        rel="noopener noreferrer"
        className="relative bg-[#25D366]
               text-white
               w-14 h-14
               rounded-full
               flex items-center justify-center
               shadow-2xl
               hover:scale-110
               transition-all duration-300"
      >
        <FaWhatsapp className="text-3xl" />
      </a>
    </div>
  );
}
