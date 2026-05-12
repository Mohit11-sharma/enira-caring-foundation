import React from "react";

export default function PrivacyPolicy() {
  return (
    <section className="w-full min-h-screen py-12 bg-gray-50 flex justify-center">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg p-6 md:p-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-green-900 border-b-4 border-lime-400 pb-4 mb-8">
          Privacy Policy
        </h1>
        <p>
          At Enira Caring Foundation, we are committed to protecting your personal data and your right to privacy. This Privacy Policy explains how we collect, use, store, and share your personal information when you interact with us through our website, services, or donation programs.
        </p>

        <h2 className="mt-8 text-2xl font-bold text-green-800">1. Information We Collect</h2>
        <p>We may collect and process the following types of information:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>Full Name, Phone Number, Email Address, and Mailing Address</li>
          <li>Date of Birth, Gender, PAN, Aadhar (as applicable)</li>
          <li>Donation details: Amount, Purpose, Payment Method</li>
          <li>Device and browser data, IP address, and cookies</li>
          <li>Any voluntary data you provide via forms, emails, or surveys</li>
        </ul>

        <h2 className="mt-8 text-2xl font-bold text-green-800">2. How We Collect Your Information</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>Directly when you fill out a form, register, donate, or communicate with us</li>
          <li>Automatically via cookies, analytics tools, and server logs</li>
          <li>From authorized third parties with your consent (e.g., payment processors)</li>
        </ul>

        <h2 className="mt-8 text-2xl font-bold text-green-800">3. Purpose of Use</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>To process donations and generate 80G tax receipts</li>
          <li>To send reports, newsletters, event updates, and thank-you letters</li>
          <li>To personalize and improve user experience on our site</li>
          <li>To meet legal and regulatory obligations</li>
        </ul>

        <h2 className="mt-8 text-2xl font-bold text-green-800">4. Legal Basis for Processing</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>Your Consent</li>
          <li>Legal or contractual necessity</li>
          <li>Legitimate interest for nonprofit transparency and service improvement</li>
        </ul>

        <h2 className="mt-8 text-2xl font-bold text-green-800">5. Data Sharing & Third Parties</h2>
        <p>We do not sell or rent your personal data. We may share it only with:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>Payment gateways and financial processors (e.g., Razorpay)</li>
          <li>Hosting and email service providers</li>
          <li>Legal or government authorities as required</li>
          <li>Verified NGO partners for program execution (with consent)</li>
        </ul>

        <h2 className="mt-8 text-2xl font-bold text-green-800">6. Use of Cookies</h2>
        <p>
          We use cookies to enhance site functionality and analyze traffic. You may disable cookies through your browser settings, though this may limit some features.
        </p>

        <h2 className="mt-8 text-2xl font-bold text-green-800">7. Data Security</h2>
        <p>We adopt industry-standard practices to protect your data including:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>SSL encryption</li>
          <li>Secure servers and encrypted databases</li>
          <li>Staff training on data protection</li>
          <li>ISO-compliant information systems</li>
        </ul>

        <h2 className="mt-8 text-2xl font-bold text-green-800">8. Children’s Privacy</h2>
        <p>
          We only use images or personal data of children in our campaigns with informed and documented consent from guardians or authorized entities.
        </p>

        <h2 className="mt-8 text-2xl font-bold text-green-800">9. Your Rights</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>Access, correct, or delete your personal data</li>
          <li>Request data portability</li>
          <li>Withdraw your consent at any time</li>
          <li>Object to certain types of data processing</li>
        </ul>

        <h2 className="mt-8 text-2xl font-bold text-green-800">10. Third-Party Tools & Links</h2>
        <p>
          Our website may link to third-party platforms. We are not responsible for their privacy practices and encourage you to review their policies before sharing any information.
        </p>

        <h2 className="mt-8 text-2xl font-bold text-green-800">11. Policy Updates</h2>
        <p>
          We reserve the right to update this policy. Significant changes will be communicated via our website or email. Continued use implies acceptance of the revised policy.
        </p>

        <h2 className="mt-8 text-2xl font-bold text-green-800">12. Contact Us</h2>
        <p>If you have questions or requests regarding this Privacy Policy, please contact us:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>
            Email:{" "}
            <a href="mailto:eniracaring@gmail.com" className="text-green-700 underline">
              eniracaring@gmail.com
            </a>
          </li>
          <li>Phone: +91 9565200005 / +91 9889200005</li>
          <li>
            Address: 118/133, Kaushalpuri, Bamba Road, Gumti No. 5, Kanpur – 208012, Uttar Pradesh, India
          </li>
        </ul>
      </div>
    </section>
  );
}