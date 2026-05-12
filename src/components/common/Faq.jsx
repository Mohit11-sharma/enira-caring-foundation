import React, { useState } from "react";

const faqData = [
  {
    question: "Who can donate to Enira Caring Foundation?",
    answer:
      "Everyone can join in — individuals, companies, or institutions, from India or abroad. Every contribution, big or small, brings hope and real change."},
  {
    question: "Do I get tax benefits for my donation?",
    answer:
      "Yes. Each donor is eligible to receive a 80 G Certificate for their respective amount of donation. All we need is your name, address, PAN card number, and email ID to issue the certificate.",
  },
  {
    question: "Can I choose the purpose of my donation?",
    answer:
      "Absolutely! While donating, you can select the cause you'd like to support — such as education, health, environment, or women empowerment.",
  },
  {
    question: "Can I sponsor a student, widow, or specific beneficiary?",
    answer:
      "Yes, we offer direct sponsorship opportunities. You can support a student, widow, artisan, or other individuals in need. Contact us for available options.",
  },
  {
    question: "Can I volunteer with Enira Caring Foundation?",
    answer:
      "Definitely! We welcome online and on-ground volunteers for various programs including teaching, event coordination, digital outreach, and field activities.",
  },
  {
    question: "Is my personal data safe with Enira?",
    answer:
      "Yes. We use SSL encryption, ISO-compliant security protocols, and do not share your data with third parties without your consent.",
  },
  {
    question: "What if I made a mistake while donating?",
    answer: (
      <>
        If you've made an error, please email us at{" "}
        <a href="mailto:eniracaring@gmail.com" className="text-green-700 underline">
          eniracaring@gmail.com
        </a>{" "}
        within 48 hours. We'll do our best to help resolve the issue.
      </>
    ),
  },
  {
    question: "Do you accept in-kind or material donations?",
    answer:
      "Yes, we accept donations of books, clothes, hygiene kits, educational materials, food items, and other essentials. Reach out to coordinate logistics.",
  },
  {
    question: "Do you support CSR partnerships?",
    answer:
      "Yes. We collaborate with corporates to design custom CSR initiatives and provide full reporting, documentation, and compliance support.",
  },
  {
    question: "Can schools or colleges collaborate with you?",
    answer:
      "Yes, we actively work with educational institutions on internships, social impact projects, awareness drives, and events.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="w-full min-h-screen py-12 bg-gradient-to-br from-gray-50 to-green-50 flex justify-center">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg p-6 md:p-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center text-green-900 border-b-4 border-lime-400 pb-4 mb-8">
          Frequently Asked Questions
        </h1>
        <div>
          {faqData.map((item, idx) => (
            <div
              key={idx}
              className={`mb-5 border rounded-lg transition-all ${
                openIndex === idx ? "border-lime-400 shadow-lg" : "border-gray-200"
              }`}
            >
              <button
                className="w-full flex items-center gap-3 bg-gradient-to-r from-green-800 to-green-600 text-white font-semibold px-6 py-4 text-left text-lg rounded-t-lg focus:outline-none"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                aria-expanded={openIndex === idx}
              >
                <span className="bg-lime-400 text-green-900 w-8 h-8 flex items-center justify-center rounded-full font-bold">
                  Q
                </span>
                {item.question}
                <span className="ml-auto text-xl">
                  {openIndex === idx ? "−" : "+"}
                </span>
              </button>
              {openIndex === idx && (
                <div className="bg-green-50 px-6 py-4 border-l-4 border-lime-400 relative">
                  <span className="absolute left-2 top-4 bg-lime-400 text-green-900 w-6 h-6 flex items-center justify-center rounded-full font-bold text-sm">
                    A
                  </span>
                  <div className="ml-8 text-gray-700 leading-relaxed">{item.answer}</div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="bg-gradient-to-r from-green-800 to-green-600 text-white rounded-lg mt-10 p-6 text-center">
          <h3 className="text-lime-300 text-xl font-bold mb-2">Still have questions?</h3>
          <p>Feel free to reach out to us:</p>
          <p>
            📧{" "}
            <a href="mailto:eniracaring@gmail.com" className="text-lime-200 underline">
              eniracaring@gmail.com
            </a>
          </p>
          <p>📞 +91 9565200005 / +91 9889200005</p>
          <p>
            📍 118/133, Kaushalpuri, Bamba Road, Kanpur – 208012, Uttar Pradesh, India
          </p>
        </div>
      </div>
    </section>
  );
}