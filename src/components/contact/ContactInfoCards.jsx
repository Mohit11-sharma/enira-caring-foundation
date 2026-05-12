import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import React from "react";

function ContactInfoCards() {
  return (
    <section className="w-full py-12 bg-gray-50 flex justify-center">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl px-4">
        {/* Phone Card */}
        <div className="bg-white rounded-2xl shadow-lg flex flex-col items-center p-8 transition hover:shadow-xl">
          <div className="bg-orange-500 rounded-full p-4 mb-4">
            <FaPhoneAlt className="text-white text-2xl" />
          </div>
          <h4 className="text-gray-700 font-semibold mb-2">Phone number</h4>
          <p className="text-lg font-bold text-gray-900">+91 9565200005</p>
        </div>
        {/* Email Card */}
        <div className="bg-white rounded-2xl shadow-lg flex flex-col items-center p-8 transition hover:shadow-xl">
          <div className="bg-orange-500 rounded-full p-4 mb-4">
            <FaEnvelope className="text-white text-2xl" />
          </div>
          <h4 className="text-gray-700 font-semibold mb-2">Email address</h4>
          <p className="text-lg font-bold text-gray-900"> eniracaring@gmail.com</p>
        </div>
        {/* Address Card */}
        <div className="bg-white rounded-2xl shadow-lg flex flex-col items-center p-8 transition hover:shadow-xl">
          <div className="bg-orange-500 rounded-full p-4 mb-4">
            <FaMapMarkerAlt className="text-white text-2xl" />
          </div>
          <h4 className="text-gray-700 font-semibold mb-2">Office Address</h4>
          <p className="text-lg font-bold text-gray-900">118/133, Kaushalpuri, Bamba Road, Kanpur 208012, Uttar Pradesh, India</p>
        </div>
      </div>
    </section>
  );
}

export default ContactInfoCards;