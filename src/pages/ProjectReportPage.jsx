
// pages/ProjectReportPage.jsx
import { useNavigate } from 'react-router-dom';
import ProtectedPDFViewer from "../components/about/ProtectedPDFView";

export default function ProjectReportPage() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleGoToAbout = () => {
    navigate('/about');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      {/* Main Content */}
      <div className="px-4">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <div className="mb-8">
            <button
              onClick={handleGoBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to About</span>
            </button>
          </div>

          {/* Page Title & Description */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Enira Project Report</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Comprehensive documentation of our project methodology, findings, and recommendations. 
              This report contains detailed analysis and strategic insights for stakeholders.
            </p>
          </div>

          {/* PDF Viewer */}
          <ProtectedPDFViewer />
          
          {/* Footer Actions */}
          <div className="mt-12 text-center">
            <div className="bg-white rounded-lg shadow-sm p-6 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Need More Information?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Contact us for additional project details or schedule a consultation.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleGoToAbout}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Learn More About Us
                </button>
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}