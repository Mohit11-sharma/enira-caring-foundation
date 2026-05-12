import { Link } from "react-router-dom";
import React from 'react'

function ContactHero() {
  return (
    <section className="relative w-full h-[340px] md:h-[420px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <img
        src="/contact-bg.jpg"
        alt="Contact Hero"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 z-10" />
      {/* Title & Breadcrumb */}
      <div className="relative z-20 flex flex-col items-center justify-center w-full h-full px-4">
        <h1 className="text-white text-4xl md:text-5xl font-extrabold mb-4 text-center drop-shadow-lg">
          Contact Us
        </h1>
        <div className="flex items-center gap-2 bg-gray-900/70 px-5 py-2 rounded-full text-white text-base font-medium shadow">
          <Link to="/" className="hover:text-orange-400 transition">Home</Link>
          <span className="mx-1">»</span>
          <span>Contact Us</span>
        </div>
      </div>
    </section>
  )
}

export default ContactHero