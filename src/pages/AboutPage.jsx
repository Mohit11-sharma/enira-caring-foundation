// pages/AboutPage.jsx
import { useNavigate } from 'react-router-dom';
import AboutHero from "../components/about/AboutHero";
import AboutIntro from "../components/about/AboutIntro";
import AboutTabsSection from "../components/about/AboutTabsSection";
import DocumentRequestForm from "../components/about/DocumentRequestForm";
export default function AboutPage() {
  const navigate = useNavigate();

  // const documents = [
  //   { title: "Registrar of Companies - Spice Part A", id: "registrar", description: "ROC Spice Part A Approval" },
  //   { title: "Certificate of Incorporation - SPICE Part B", id: "spice", description: "Certificate of Incorporation" },
  //   { title: "INC-31 AOA", id: "inc31", description: "Articles of Association" },
  //   { title: "INC-13 MOA", id: "inc13", description: "Memorandum of Association" },
  //   { title: "NITI AAYOG Registration", id: "niti", description: "NITI AAYOG DARPAN Registration" },
  //    { title: "UDYAM Certificate", id: "udyam", description: "UDYAM Registration Certificate" },
  //    // { title: "TAN Certificate", id: "tan", description: "Tax Deduction Account Number" },
  //   { title: "80G Certificate", id: "cert80g", description: "Income Tax Exemption Certificate" },
  //   { title: "12A Certificate", id: "cert12a", description: "Registration under Section 12A" },
  //   { title: "BRL", id: "brl", description: "Business Registration License" },
  // ];

  // const handleDocumentClick = (docId, docTitle) => {
  //   // Changed route to match PDF viewer component
  //   navigate(`/documents/${docId}`, { 
  //     state: { title: docTitle } 
  //   });
  // };

  return (
    <div className="bg-gray-50 text-gray-800">
      <AboutHero />
      <AboutIntro />
      <AboutTabsSection />
      {/* <section className="py-12 px-4 md:px-12 lg:px-24">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 text-gray-900">📄 Company Documents</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Browse and view our official certificates, registrations, and reports. 
            Click on any document to view it in full screen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {documents.map((doc, index) => (
            <button
              key={doc.id}
              onClick={() => handleDocumentClick(doc.id, doc.title)}
              className="group w-full bg-white border border-gray-200 shadow hover:shadow-lg transition-all duration-200 rounded-lg p-6 text-left hover:bg-blue-50 hover:border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label={`View ${doc.title} document`}
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl group-hover:scale-110 transition-transform duration-200">📑</span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">
                    {doc.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {doc.description}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-blue-600 group-hover:text-blue-700">
                <span>View Document</span>
                <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </section> */}

      {/* Document Request Section */}
      <section className="py-12 px-4 md:px-12 lg:px-24">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 text-gray-900">📄 Request Company Documents</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Interested in learning more about our organization? Request access to our official 
            certificates, registrations, and reports. We'll send them to you within 24-48 hours.
          </p>
        </div>
        <DocumentRequestForm />
      </section>

    </div>
  );
}