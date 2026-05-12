import React from "react";

export default function TermsAndConditions() {
  return (
    <section className="w-full min-h-screen py-12 bg-gray-50 flex justify-center">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg p-6 md:p-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-green-900 border-b-4 border-lime-400 pb-4 mb-8">
          Terms &amp; Conditions
        </h1>
        <p>
          Welcome to the official website of Enira Caring Foundation. By accessing or using our website, services, or donating through our platforms, you agree to the following terms and conditions. Please read them carefully.
        </p>

        <h2 className="mt-8 text-2xl font-bold text-green-800">1. Acceptance of Terms</h2>
        <p>
          By using our website or engaging with our services, you agree to be legally bound by these terms and our Privacy Policy. If you do not accept these terms, please discontinue use of our website immediately.
        </p>

        <h2 className="mt-8 text-2xl font-bold text-green-800">2. About Enira Caring Foundation</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>We are a registered Section 8 non-profit company under Indian law.</li>
          <li>We operate in sectors like education, health, livelihoods, environmental sustainability, sports, and culture.</li>
          <li>All donations are eligible for tax exemption under Section 80G of the Income Tax Act, 1961.</li>
        </ul>

        <h2 className="mt-8 text-2xl font-bold text-green-800">3. Donation Policy</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>All donations made are voluntary and non-refundable after 12 hours of confirmation.</li>
          <li>Donors must provide valid PAN details to receive an 80G receipt.</li>
          <li>Official receipts are issued via email within 7 working days of donation confirmation.</li>
        </ul>

        <h2 className="mt-8 text-2xl font-bold text-green-800">4. Use of Funds</h2>
        <p>
          Enira Caring Foundation utilizes all donations for its core programmatic activities, administrative needs, and community development projects as outlined in our focus areas. Fund allocation may be adjusted based on priority and need without prior notice.
        </p>

        <h2 className="mt-8 text-2xl font-bold text-green-800">5. User Responsibilities</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>Users must submit accurate, complete, and lawful information on all forms and communications.</li>
          <li>Impersonation, fraudulent activity, or illegal behavior may lead to account termination or legal action.</li>
        </ul>

        <h2 className="mt-8 text-2xl font-bold text-green-800">6. Intellectual Property Rights</h2>
        <p>
          All content—including text, images, graphics, logos, documents, and code—on this site is the intellectual property of Enira Caring Foundation. Unauthorized copying, distribution, or reuse of this content is strictly prohibited without prior written consent.
        </p>

        <h2 className="mt-8 text-2xl font-bold text-green-800">7. Limitation of Liability</h2>
        <p>Enira Caring Foundation is not liable for:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>Payment failures, delays, or errors by third-party service providers</li>
          <li>Technical or server-related interruptions or downtime</li>
          <li>Any misuse or misrepresentation of our name or website by external parties</li>
        </ul>

        <h2 className="mt-8 text-2xl font-bold text-green-800">8. Termination</h2>
        <p>
          We reserve the right to terminate user access to our website, donations, or programs at any time if a user violates these terms or engages in unethical or unlawful activity.
        </p>

        <h2 className="mt-8 text-2xl font-bold text-green-800">9. Third-Party Links</h2>
        <p>
          Our website may contain links to external websites. We do not control or endorse the content or privacy practices of these websites and are not responsible for any damage or loss arising from their use.
        </p>

        <h2 className="mt-8 text-2xl font-bold text-green-800">10. Modifications and Updates</h2>
        <p>
          We reserve the right to update these terms at any time. Users are encouraged to check this page regularly. Continued use of our website or services after any changes constitutes your acceptance of the revised terms.
        </p>

        <h2 className="mt-8 text-2xl font-bold text-green-800">11. Governing Law and Jurisdiction</h2>
        <p>
          These terms are governed by and interpreted in accordance with the laws of India. Any disputes shall be subject to the jurisdiction of courts in Kanpur, Uttar Pradesh.
        </p>

        <h2 className="mt-8 text-2xl font-bold text-green-800">12. Contact Information</h2>
        <p>If you have any questions or concerns regarding these Terms &amp; Conditions, please contact us:</p>
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