// components/about/ProtectedPDFView.jsx
import { useEffect, useState } from "react";

export default function ProtectedPDFViewer({ url }) {
  if (!url) {
    return (
      <div className="text-center mt-10 text-red-600">
        ⚠️ No PDF URL provided.
      </div>
    );
  }
  const [pdfPages, setPdfPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const loadPDF = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if pdfjs-dist is available
        if (typeof window !== 'undefined' && window.pdfjsLib) {
          // Use PDF.js if available
          await renderWithPDFJS();
        } else {
          // Try to load PDF.js dynamically
          await loadPDFJS();
          await renderWithPDFJS();
        }
      } catch (err) {
        console.error("Error loading PDF:", err);
        setError(`Failed to load PDF: ${err.message}`);
        setLoading(false);
      }
    };

    const loadPDFJS = async () => {
      try {
        // Dynamically load PDF.js
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        document.head.appendChild(script);

        return new Promise((resolve, reject) => {
          script.onload = () => {
            // Set worker
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = 
              'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            resolve();
          };
          script.onerror = reject;
        });
      } catch (err) {
        throw new Error('Failed to load PDF.js library');
      }
    };

    const renderWithPDFJS = async () => {
      try {
        const loadingTask = window.pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;
        const pages = [];
        setTotalPages(pdf.numPages);

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
          const page = await pdf.getPage(pageNumber);
          const viewport = page.getViewport({ scale: 1.5 });
          
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({ 
            canvasContext: context, 
            viewport: viewport 
          }).promise;

          const imageData = canvas.toDataURL("image/png");
          pages.push(imageData);
        }

        setPdfPages(pages);
        setLoading(false);
      } catch (err) {
        throw new Error(`PDF rendering failed: ${err.message}`);
      }
    };

    if (url) {
      loadPDF();
    }
  }, [url]);

  // Disable right-click context menu
  const handleContextMenu = (e) => {
    e.preventDefault();
    return false;
  };

  // Disable text selection and dragging
  const handleSelectStart = (e) => {
    e.preventDefault();
    return false;
  };

  // Disable keyboard shortcuts for saving/printing
  const handleKeyDown = (e) => {
    if (e.ctrlKey && (e.key === 's' || e.key === 'p' || e.key === 'a')) {
      e.preventDefault();
      return false;
    }
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
      e.preventDefault();
      return false;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 bg-white rounded-lg shadow-sm">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading PDF document...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait while we prepare your document</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
        <div className="text-red-600 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-red-800 mb-3">Unable to Load PDF</h3>
        <p className="text-red-600 mb-6">{error}</p>
        <div className="space-y-2">
          <p className="text-sm text-red-700">Please check:</p>
          <ul className="text-sm text-red-600 list-disc list-inside space-y-1">
            <li>PDF file exists at: <code className="bg-red-100 px-1 rounded">{url}</code></li>
            <li>File is accessible and not corrupted</li>
            <li>Internet connection is stable</li>
          </ul>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-6 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* PDF Container */}
      <div
        className="relative bg-white rounded-lg shadow-lg overflow-hidden"
        onContextMenu={handleContextMenu}
        onSelectStart={handleSelectStart}
        style={{ 
          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          msUserSelect: "none"
        }}
      >
        {/* Header */}
        <div className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">13-Enira-Project-Report.pdf</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-300">{totalPages} pages</span>
            <div className="flex items-center space-x-1 text-yellow-400">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className="text-xs font-medium">Protected</span>
            </div>
          </div>
        </div>
        
        {/* PDF Pages */}
        <div className="p-6 bg-gray-50">
          <div className="space-y-8">
            {pdfPages.map((src, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <img
                    src={src}
                    alt={`PDF page ${index + 1}`}
                    className="w-full h-auto mx-auto rounded border border-gray-200"
                    draggable="false"
                    onDragStart={(e) => e.preventDefault()}
                    onSelectStart={(e) => e.preventDefault()}
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      userSelect: "none",
                      WebkitUserSelect: "none",
                      MozUserSelect: "none",
                      msUserSelect: "none",
                      pointerEvents: "none"
                    }}
                  />
                  {/* Page number */}
                  <div className="text-center mt-4">
                    <span className="inline-block bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                      Page {index + 1} of {totalPages}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Invisible protection overlay */}
        <div 
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-50"
          style={{ 
            background: 'transparent',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none'
          }}
        />
      </div>
      
      {/* Protection Notice */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-blue-800">Document Protection Active</h4>
            <p className="text-sm text-blue-700 mt-1">
              This document is protected against copying, downloading, and printing. 
              Right-click and text selection have been disabled for security purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}