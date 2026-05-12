import { FaFacebookF, FaTwitter, FaLinkedinIn, FaEnvelope, FaPhone, FaInstagram, FaMapMarkerAlt } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const [showEmail1, setShowEmail1] = useState(false);
  const [showEmail2, setShowEmail2] = useState(false);
  const [showEmail3, setShowEmail3] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [email, setEmail] = useState("");
  const [showPrivacyError, setShowPrivacyError] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (!privacyAccepted) {
      setShowPrivacyError(true);
      alert("Please accept the Privacy Policy to continue.");
      return;
    }
    
    if (!email) {
      alert("Please enter your email address.");
      return;
    }
    
    // Reset error state on successful submission
    setShowPrivacyError(false);
    // Process form submission here
    console.log("Form submitted with email:", email);
    alert("Thank you for subscribing!");
    setEmail("");
    setPrivacyAccepted(false);
  };

  const handlePrivacyChange = (e) => {
    setPrivacyAccepted(e.target.checked);
    // Hide error when user checks the box
    if (e.target.checked) {
      setShowPrivacyError(false);
    }
  };

  return (
    <footer className="bg-green-900 text-white pt-6 sm:pt-10 pb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Contact Information Header - Mobile Responsive */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-green-700 rounded-xl p-4 sm:p-6 space-y-4 lg:space-y-0 lg:flex lg:justify-between lg:items-center lg:gap-4">
            {/* Email */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 min-w-0">
              <span 
                className="bg-orange-500 rounded-full p-2 cursor-pointer hover:bg-orange-600 transition flex items-center gap-2 flex-shrink-0" 
                onClick={() => window.open('mailto:eniracaring@gmail.com', '_blank')}
              >
                <FaEnvelope className="transform scale-x-[-1]" />
                <span className="text-xs sm:text-sm font-bold whitespace-nowrap">Click to email</span>
              </span>
            </div>

            {/* Phone */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 min-w-0">
              <span className="bg-orange-500 rounded-full p-2 flex-shrink-0">
                <FaPhone className="transform scale-x-[-1]" />
              </span>
              <span className="font-bold text-sm sm:text-base">+91 9565200005</span>
            </div>

            {/* Address */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 min-w-0">
              <span className="bg-orange-500 rounded-full p-2 flex-shrink-0">
                <FaMapMarkerAlt className="transform scale-x-[-1]" />
              </span>
              <span className="text-xs sm:text-sm leading-relaxed">
                118/133, Kaushalpuri, Bamba Road, Kanpur 208012, Uttar Pradesh, India
              </span>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-xl sm:text-2xl mb-2 flex items-center gap-2">
              <span className="text-orange-500"><FaEnvelope /></span>
              Enira
            </h3>
            <p className="text-gray-200 text-sm sm:text-base leading-relaxed">
              Empowering Lives, Enriching Futures — One Community at a Time!
            </p>
            <div className="flex gap-3">
              <a 
                href="https://www.facebook.com/share/19Wzcf2rMB/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-white/10 p-3 rounded-full hover:bg-orange-500 transition-colors duration-300"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
              <a 
                href="https://www.instagram.com/eniracaringfoundation" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-white/10 p-3 rounded-full hover:bg-orange-500 transition-colors duration-300"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg sm:text-xl mb-2 border-b border-orange-500 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm sm:text-base">
              <li>
                <Link to="/about" className="hover:text-orange-500 transition-colors duration-300 block">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-orange-500 transition-colors duration-300 block">
                  Our Shop
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-orange-500 transition-colors duration-300 block">
                  FAQ's
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-orange-500 transition-colors duration-300 block">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <h4 className="font-bold text-lg sm:text-xl mb-2 border-b border-orange-500 pb-2">
              Contact Us
            </h4>
            <div className="space-y-3 text-sm sm:text-base">
              {/* Email Contact */}
              <div className="space-y-2">
                <div 
                  className="cursor-pointer hover:text-orange-500 transition-colors duration-300 flex items-start gap-2 group" 
                  onClick={() => window.open('mailto:eniracaring@gmail.com', '_blank')}
                >
                  <FaEnvelope className="transform scale-x-[-1] mt-1 flex-shrink-0 group-hover:text-orange-500" />
                  <div className="min-w-0">
                    <span className="text-xs block">Email us:</span>
                    <span className="text-sm sm:text-base font-medium break-all">
                      eniracaring@gmail.com
                    </span>
                  </div>
                </div>
              </div>

              {/* Phone Contact */}
              <div className="flex items-center gap-2">
                <FaPhone className="transform scale-x-[-1] flex-shrink-0" />
                <span className="text-sm sm:text-base">9889200005</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-orange-500 pt-4 space-y-2 sm:space-y-0 sm:flex sm:justify-between sm:items-center text-center sm:text-left">
          <div className="text-xs sm:text-sm text-gray-300">
            © 2025 Enira. All rights reserved
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs sm:text-sm">
            <Link 
              to="/term&conditions" 
              className="text-orange-500 hover:text-orange-300 transition-colors duration-300"
            >
              Terms & Conditions
            </Link>
            <span className="hidden sm:inline text-gray-500">|</span>
            <Link 
              to="/privacy-policy" 
              className="text-orange-500 hover:text-orange-300 transition-colors duration-300"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}