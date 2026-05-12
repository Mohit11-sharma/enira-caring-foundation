import React, { useEffect, useState, useRef } from 'react';
import { FiGift, FiLoader, FiUpload, FiFileText } from 'react-icons/fi';
import { donationService } from '../../services/donationService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const Donations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploadingId, setUploadingId] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const fileInputRefs = useRef({});

  useEffect(() => {
    fetchDonations();
    // eslint-disable-next-line
  }, []);

  const fetchDonations = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await donationService.getAll();
      setDonations(res.data || []);
    } catch (err) {
      setError('Failed to load donations');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadClick = (id) => {
    if (fileInputRefs.current[id]) {
      fileInputRefs.current[id].value = '';
      fileInputRefs.current[id].click();
    }
  };

  const handleFileChange = async (e, donationId) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingId(donationId);
    setUploadError('');
    try {
      const res = await donationService.uploadCertificate(donationId, file);
      if (res.success) {
        await fetchDonations();
      } else {
        setUploadError(res.message || 'Upload failed');
      }
    } catch (err) {
      setUploadError('Upload failed');
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <FiGift className="w-5 h-5 mr-2" />
            Donations
          </h3>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <FiLoader className="animate-spin w-8 h-8 text-green-500 mr-2" />
              <span className="text-green-700 font-medium">Loading donations...</span>
            </div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : donations.length === 0 ? (
            <div className="text-gray-500 text-center py-12">No donations found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-green-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">PAN</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">80G Certificate</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {donations.map((donation, idx) => (
                    <tr key={donation.id}>
                      <td className="px-6 py-4">{idx + 1}</td>
                      <td className="px-6 py-4">{donation.name}</td>
                      <td className="px-6 py-4">{donation.phone}</td>
                      <td className="px-6 py-4 font-semibold text-green-700">₹{donation.amount}</td>
                      <td className="px-6 py-4">{donation.pan || '-'}</td>
                      <td className="px-6 py-4">{donation.address || '-'}</td>
                      <td className="px-6 py-4">{donation.created_at ? new Date(donation.created_at).toLocaleString() : '-'}</td>
                      <td className="px-6 py-4">
                        {donation.certificate ? (
                          <a
                            href={`${API_URL.replace(/\/api$/, '')}/storage/${donation.certificate.replace(/^certificates\//, 'certificates/')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-green-700 hover:underline"
                          >
                            <FiFileText className="mr-1" /> View
                          </a>
                        ) : (
                          <>
                            <button
                              className="inline-flex items-center px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                              onClick={() => handleUploadClick(donation.id)}
                              disabled={uploadingId === donation.id}
                            >
                              <FiUpload className="mr-1" />
                              {uploadingId === donation.id ? 'Uploading...' : 'Upload'}
                            </button>
                            <input
                              type="file"
                              accept="application/pdf,image/*"
                              style={{ display: 'none' }}
                              ref={el => (fileInputRefs.current[donation.id] = el)}
                              onChange={e => handleFileChange(e, donation.id)}
                            />
                          </>
                        )}
                        {uploadError && uploadingId === donation.id && (
                          <div className="text-xs text-red-600 mt-1">{uploadError}</div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Donations;