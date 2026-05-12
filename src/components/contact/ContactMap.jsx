import React from "react";

function ContactMap() {
  return (
    <section className="w-full h-[400px] md:h-[500px] relative">
      <iframe
        title="Office Location"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1501.6894428612281!2d80.31421332233022!3d26.467345686252116!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399c4780924fd619%3A0x82b47bf9a177f7a0!2sBamba%20Rd%2C%20Darshan%20Purwa%2C%20Kanpur%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1753366146236!5m2!1sen!2sin"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0 w-full h-full rounded-none"
      ></iframe>
    </section>
  );
}

export default ContactMap;