import React, { useState } from 'react';
import { FiCheckCircle, FiX } from 'react-icons/fi';
import documentRequestService from '../../services/documentRequestService';

// Toast Component
const Toast = ({ message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const icons = {
    success: <FiCheckCircle className="w-5 h-5 text-green-600" />,
    error: <FiX className="w-5 h-5 text-red-600" />,
    info: <FiCheckCircle className="w-5 h-5 text-blue-600" />
  };

  return (
    <div className={`${styles[type]} border rounded-lg p-4 shadow-lg flex items-start space-x-3 min-w-[320px] max-w-md animate-slide-in`}>
      <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button onClick={onClose} className="flex-shrink-0 text-gray-400 hover:text-gray-600">
        <FiX className="w-4 h-4" />
      </button>
    </div>
  );
};

// Toast Container Component
const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

const DocumentRequestForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    requested_documents: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toasts, setToasts] = useState([]);

  const documents = [
    { id: 'pan', label: 'PAN' },
    { id: 'niti', label: 'NITI AAYOG Registration' },
    { id: 'udyam', label: 'UDYAM Certificate' },
    { id: 'registrar', label: 'ROC Spice Part A' },
    { id: 'spice', label: 'Certificate of Incorporation' },
    { id: 'inc31', label: 'INC-31 AOA' },
    { id: 'inc13', label: 'INC-13 MOA' },
    { id: 'tan', label: 'TAN Certificate' },
    { id: 'cert80g', label: '80G Certificate' },
    { id: 'cert12a', label: '12A Certificate' }
  ];

  // Toast management functions
  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleCheckboxChange = (docId) => {
    setFormData(prev => {
      const isChecked = prev.requested_documents.includes(docId);
      return {
        ...prev,
        requested_documents: isChecked
          ? prev.requested_documents.filter(id => id !== docId)
          : [...prev.requested_documents, docId]
      };
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    console.log('🚀 Form submission started');
    console.log('📋 Form data:', formData);

    // Validation
    if (formData.requested_documents.length === 0) {
      setError('Please select at least one document');
      console.log('❌ Validation failed: No documents selected');
      return;
    }

    if (!formData.name || !formData.email) {
      setError('Name and email are required');
      console.log('❌ Validation failed: Missing name or email');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      console.log('❌ Validation failed: Invalid email format');
      return;
    }

    try {
      setLoading(true);
      console.log('📤 Sending request to API...');
      
      // Ensure requested_documents is sent as an array
      const payload = {
        ...formData,
        requested_documents: formData.requested_documents.length > 0 
          ? formData.requested_documents 
          : []
      };
      
      console.log('📦 Payload being sent:', JSON.stringify(payload, null, 2));
      
      const response = await documentRequestService.createRequest(payload);
      
      console.log('✅ Request submitted successfully:', response);
      
      // Success - show toast and reset form
      addToast('Document request submitted successfully! We will contact you soon.', 'success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        requested_documents: []
      });
    } catch (err) {
      console.error('❌ Error submitting request:', err);
      console.error('❌ Error details:', {
        status: err.status,
        message: err.message,
        data: err.data,
        errors: err.errors
      });
      
      // Handle different error structures
      let errorMessage = 'Failed to submit request. Please try again.';
      
      if (err.message) {
        errorMessage = err.message;
      } else if (err.data?.message) {
        errorMessage = err.data.message;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      // Handle validation errors
      if (err.status === 422 && err.errors) {
        console.error('🔴 Validation errors:', err.errors);
        const errorMessages = Object.values(err.errors).flat();
        errorMessage = errorMessages.join(', ');
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
      console.log('🏁 Form submission completed');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Request Documents</h2>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Documents Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Select Documents *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {documents.map(doc => (
              <label key={doc.id} className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.requested_documents.includes(doc.id)}
                  onChange={() => handleCheckboxChange(doc.id)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-3 text-sm text-gray-700">{doc.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your full name"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="your.email@example.com"
          />
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="1234567890"
          />
        </div>

        {/* Message */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Additional Message (Optional)
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Any specific requirements or questions..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>

        <p className="text-xs text-gray-500 mt-4 text-center">
          * Required fields. We will process your request within 1-2 business days.
        </p>
      </form>

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default DocumentRequestForm;