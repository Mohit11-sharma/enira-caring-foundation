import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiX, FiRefreshCw, FiHome, FiHelpCircle } from 'react-icons/fi';

export default function CheckoutFailurePage() {
  const [searchParams] = useSearchParams();
  const errorMessage = searchParams.get('message') || 'Payment failed. Please try again.';

  return (
    <div className="min-h-screen bg-gray-50 py-8 mt-20">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiX className="text-red-600" size={32} />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Failed</h1>
          <p className="text-gray-600 mb-8">
            {errorMessage}
          </p>

          <div className="bg-red-50 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-red-800 mb-2">What happened?</h2>
            <p className="text-red-600 text-sm">
              Your payment could not be processed. This might be due to insufficient funds, 
              network issues, or bank restrictions. Please try again or contact your bank.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/checkout"
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FiRefreshCw size={16} />
              Try Again
            </Link>
            <Link
              to="/cart"
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiHome size={16} />
              Back to Cart
            </Link>
          </div>

          <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center gap-2 justify-center text-yellow-800 mb-2">
              <FiHelpCircle size={16} />
              <span className="font-medium">Need Help?</span>
            </div>
            <p className="text-sm text-yellow-600">
              If you continue to experience issues, please contact our support team for assistance.
            </p>
            <Link 
              to="/contact" 
              className="text-yellow-700 hover:text-yellow-800 font-medium text-sm"
            >
              Contact Support →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}