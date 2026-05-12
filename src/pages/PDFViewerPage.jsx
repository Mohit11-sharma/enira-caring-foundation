// pages/PDFViewerPage.jsx
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

// Centralized PDF mapping
const PDF_MAP = {
  brl: "BRL.pdf",
  niti: "AAICE1895Q_registration_profile-(NITI-AAYOG-DARPAN).pdf",
  udyam: "UDYAM12.pdf",
  pan: "pan.pdf",
  registrar: "OFFICE-OF-THE-REGISTRAR-OF-COMPANIES-Spice+Part-A_Approval-Letter_AA7068192-ENIRA.pdf",
  spice: "Certificate-of-Incorporation-SPICE-Part B_Approval-Letter_AA7811796-enira.pdf",
  inc31: "INC-31-1-13657187089-(AOA)-F-S-ENIRA.pdf",
  inc13: "INC-13-1-13657187099-(MOA)-F-S-ENIRA.pdf",
  tan: "Tax-Deduction-Account-Number-TAN-ENIRA.pdf",
  cert80g: "80G-Certificate-Enira.pdf",
  cert12a: "12A-Certificate-Enira.pdf"
};

export default function PDFViewerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const filename = PDF_MAP[id];
  const documentTitle = location.state?.title || `Document ${id}`;

  useEffect(() => {
    if (!filename) {
      setHasError(true);
      setIsLoading(false);
    }
  }, [filename]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleDownload = () => {
    if (filename) {
      const link = document.createElement('a');
      link.href = `/files/${filename}`;
      link.download = filename;
      link.click();
    }
  };

  if (!filename || hasError) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-semibold text-red-600 mb-2">
            Document Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The requested document could not be found or failed to load.
          </p>
          <button
            onClick={handleGoBack}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-gray-100">
      {/* Header */}
      {/* <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={handleGoBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Go back"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{documentTitle}</h1>
            <p className="text-sm text-gray-600">{filename}</p>
          </div>
        </div>
        
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download
        </button>
      </div> */}

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading document...</p>
          </div>
        </div>
      )}

      {/* PDF Iframe */}
      <div className="h-[calc(100vh-4rem)] w-full mt-16">

        <iframe
          src={`/files/${filename}`}
          title={`${documentTitle} - ${filename}`}
          className="w-full h-full border-none"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          style={{ display: isLoading ? 'none' : 'block' }}
        />
      </div>
    </div>
  );
}