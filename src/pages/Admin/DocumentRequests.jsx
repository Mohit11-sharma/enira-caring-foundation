import React, { useState, useEffect } from 'react';
import { 
  FiFileText, FiCheck, FiX, FiTrash2, FiFilter, 
  FiRefreshCw, FiMail, FiPhone, FiClock, FiCheckCircle,
  FiXCircle, FiAlertCircle, FiChevronLeft, FiChevronRight
} from 'react-icons/fi';
import documentRequestService from "../../services/documentRequestService";

// Toast Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
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
    error: <FiXCircle className="w-5 h-5 text-red-600" />,
    info: <FiAlertCircle className="w-5 h-5 text-blue-600" />
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

// Confirmation Modal Component
const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm", confirmColor = "blue" }) => {
  if (!isOpen) return null;

  const colorClasses = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    red: 'bg-red-600 hover:bg-red-700',
    green: 'bg-green-600 hover:bg-green-700'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-600">{message}</p>
        </div>
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-lg transition-colors font-medium text-sm ${colorClasses[confirmColor]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const DocumentRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ pending: 0, approved: 0, declined: 0, total: 0 });
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: '', id: null });

  const documentMap = {
    brl: 'Business Registration License',
    niti: 'NITI AAYOG Registration',
    udyam: 'UDYAM Certificate',
    registrar: 'ROC Spice Part A',
    spice: 'Certificate of Incorporation',
    inc31: 'INC-31 AOA',
    inc13: 'INC-13 MOA',
    pan: 'PAN',
    tan: 'TAN Certificate',
    cert80g: '80G Certificate',
    cert12a: '12A Certificate'
  };

  // Toast management functions
  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  useEffect(() => {
    loadRequests();
    loadStats();
  }, [filter, currentPage]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {
        per_page: 10,
        page: currentPage
      };
      if (filter !== 'all') {
        params.status = filter;
      }
      const response = await documentRequestService.getAllRequests(params);
      
      // Parse requested_documents if it's a JSON string
      const parsedRequests = (response.data || []).map(request => ({
        ...request,
        requested_documents: typeof request.requested_documents === 'string' 
          ? JSON.parse(request.requested_documents) 
          : (Array.isArray(request.requested_documents) ? request.requested_documents : [])
      }));
      
      setRequests(parsedRequests);
      setTotalPages(response.last_page || 1);
    } catch (err) {
      setError('Failed to load document requests');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await documentRequestService.getStats();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const handleApproveClick = (id) => {
    setConfirmModal({
      isOpen: true,
      type: 'approve',
      id: id
    });
  };

  const handleApproveConfirm = async () => {
    const id = confirmModal.id;
    setConfirmModal({ isOpen: false, type: '', id: null });

    try {
      setProcessingId(id);
      await documentRequestService.approveRequest(id);
      await loadRequests();
      await loadStats();
      addToast('Request approved and documents sent successfully!', 'success');
    } catch (err) {
      addToast('Failed to approve request: ' + (err.message || 'Unknown error'), 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeclineClick = (id) => {
    setSelectedRequestId(id);
    setShowDeclineModal(true);
  };

  const handleDeclineConfirm = async () => {
    try {
      setProcessingId(selectedRequestId);
      await documentRequestService.declineRequest(selectedRequestId, declineReason);
      setShowDeclineModal(false);
      setDeclineReason('');
      setSelectedRequestId(null);
      await loadRequests();
      await loadStats();
      addToast('Request declined successfully', 'success');
    } catch (err) {
      addToast('Failed to decline request: ' + (err.message || 'Unknown error'), 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteClick = (id) => {
    setConfirmModal({
      isOpen: true,
      type: 'delete',
      id: id
    });
  };

  const handleDeleteConfirm = async () => {
    const id = confirmModal.id;
    setConfirmModal({ isOpen: false, type: '', id: null });

    try {
      setProcessingId(id);
      await documentRequestService.deleteRequest(id);
      await loadRequests();
      await loadStats();
      addToast('Request deleted successfully', 'success');
    } catch (err) {
      addToast('Failed to delete request: ' + (err.message || 'Unknown error'), 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: FiClock, label: 'Pending' },
      approved: { bg: 'bg-green-100', text: 'text-green-800', icon: FiCheckCircle, label: 'Approved' },
      declined: { bg: 'bg-red-100', text: 'text-red-800', icon: FiXCircle, label: 'Declined' }
    };
    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.text}`}>
        <Icon className="w-4 h-4 mr-1" />
        {badge.label}
      </span>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Confirmation Modals */}
      <ConfirmModal
        isOpen={confirmModal.isOpen && confirmModal.type === 'approve'}
        title="Approve Request"
        message="Are you sure you want to approve this request? Documents will be sent via email."
        onConfirm={handleApproveConfirm}
        onCancel={() => setConfirmModal({ isOpen: false, type: '', id: null })}
        confirmText="Approve"
        confirmColor="green"
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen && confirmModal.type === 'delete'}
        title="Delete Request"
        message="Are you sure you want to delete this request? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmModal({ isOpen: false, type: '', id: null })}
        confirmText="Delete"
        confirmColor="red"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {[
          { label: 'Total Requests', value: stats.total, icon: FiFileText, color: 'from-blue-500 to-blue-600' },
          { label: 'Pending', value: stats.pending, icon: FiClock, color: 'from-yellow-500 to-yellow-600' },
          { label: 'Approved', value: stats.approved, icon: FiCheckCircle, color: 'from-green-500 to-green-600' },
          { label: 'Declined', value: stats.declined, icon: FiXCircle, color: 'from-red-500 to-red-600' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-4 rounded-xl bg-gradient-to-br ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Document Requests</h3>
              <p className="text-sm text-gray-500 mt-1">Manage and process document requests from users</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={filter}
                  onChange={(e) => { setFilter(e.target.value); setCurrentPage(1); }}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium"
                >
                  <option value="all">All Requests</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="declined">Declined</option>
                </select>
              </div>
              <button
                onClick={() => { loadRequests(); loadStats(); }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                title="Refresh"
              >
                <FiRefreshCw className={`w-5 h-5 text-gray-600 group-hover:text-blue-600 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <FiAlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Requests List */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
              <p className="mt-4 text-gray-600 font-medium">Loading requests...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiFileText className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-600 text-lg font-medium mb-2">No document requests found</p>
              <p className="text-gray-400 text-sm">Requests will appear here when users submit them</p>
            </div>
          ) : (
            <>
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Requester</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Documents</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {requests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                            <span className="text-white font-semibold text-sm">
                              {request.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-semibold text-gray-900">{request.name}</p>
                            {request.message && (
                              <p className="text-xs text-gray-500 mt-1 max-w-xs truncate" title={request.message}>
                                {request.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm space-y-1">
                          <div className="flex items-center text-gray-900">
                            <FiMail className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                            <span className="truncate">{request.email}</span>
                          </div>
                          {request.phone && (
                            <div className="flex items-center text-gray-600">
                              <FiPhone className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                              <span>{request.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2 max-w-xs">
                          {request.requested_documents.slice(0, 2).map((doc, idx) => (
                            <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                              {documentMap[doc] || doc}
                            </span>
                          ))}
                          {request.requested_documents.length > 2 && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                              +{request.requested_documents.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(request.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div className="font-medium">{new Date(request.created_at).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-400">
                          {new Date(request.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {request.status === 'pending' ? (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleApproveClick(request.id)}
                              disabled={processingId === request.id}
                              className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
                              title="Approve and send documents"
                            >
                              {processingId === request.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-700 border-t-transparent"></div>
                              ) : (
                                <FiCheck className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handleDeclineClick(request.id)}
                              disabled={processingId === request.id}
                              className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Decline request"
                            >
                              <FiX className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(request.id)}
                              disabled={processingId === request.id}
                              className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete request"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleDeleteClick(request.id)}
                            disabled={processingId === request.id}
                            className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete request"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center text-sm font-medium"
                    >
                      <FiChevronLeft className="w-4 h-4 mr-1" />
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center text-sm font-medium"
                    >
                      Next
                      <FiChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Decline Modal */}
      {showDeclineModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Decline Request</h3>
                <button
                  onClick={() => {
                    setShowDeclineModal(false);
                    setDeclineReason('');
                    setSelectedRequestId(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">Please provide a reason for declining this document request. This will help the requester understand the decision.</p>
              <textarea
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="Enter reason for declining..."
                rows="4"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none text-sm"
              />
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeclineModal(false);
                  setDeclineReason('');
                  setSelectedRequestId(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDeclineConfirm}
                disabled={!declineReason.trim() || processingId === selectedRequestId}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
              >
                {processingId === selectedRequestId ? 'Processing...' : 'Decline Request'}
              </button>
            </div>
          </div>
        </div>
      )}

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

export default DocumentRequests;