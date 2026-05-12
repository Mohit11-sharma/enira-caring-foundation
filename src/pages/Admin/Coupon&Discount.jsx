import React, { useEffect, useState } from 'react';
import {
  FiTag, FiPlus, FiEdit, FiTrash2, FiSave, FiX, FiLoader, FiRefreshCw
} from 'react-icons/fi';
import { couponService } from '../../services/couponService';

const initialForm = {
  code: '',
  name: '',
  description: '',
  type: 'percentage',
  value: '',
  minimum_amount: '',
  maximum_discount: '',
  usage_limit: '',
  usage_limit_per_user: '',
  starts_at: '',
  expires_at: '',
  is_active: true,
};

function generateCouponCode() {
  // Example: ENIRA-AB12CD
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'ENIRA-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

const CouponPreview = ({ coupon }) => (
  <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-xl shadow-lg p-6 mb-6 flex items-center justify-between relative overflow-hidden">
    <div>
      <div className="text-2xl font-bold text-white tracking-widest mb-2">{coupon.code || 'COUPONCODE'}</div>
      <div className="text-lg text-white font-semibold">{coupon.name || 'Coupon Name'}</div>
      <div className="text-white text-sm mt-1">{coupon.description || 'Coupon description goes here.'}</div>
      <div className="mt-3 flex items-center space-x-4">
        <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-white text-xs font-semibold">
          {coupon.type === 'percentage'
            ? `${coupon.value || 0}% OFF`
            : coupon.type === 'fixed'
              ? `₹${coupon.value || 0} OFF`
              : 'Free Shipping'}
        </span>
        {coupon.minimum_amount && (
          <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-white text-xs font-semibold">
            Min: ₹{coupon.minimum_amount}
          </span>
        )}
        {coupon.expires_at && (
          <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-white text-xs font-semibold">
            Expires: {coupon.expires_at.slice(0, 10)}
          </span>
        )}
      </div>
    </div>
    <div className="absolute right-0 top-0 h-full flex items-center">
      <div className="w-24 h-24 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
        <FiTag className="w-12 h-12 text-white opacity-60" />
      </div>
    </div>
  </div>
);

const CouponDiscountPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await couponService.getCoupons();
      // For paginated response, coupons are in res.data.data.data
      setCoupons(res.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch coupons');
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleEdit = (coupon) => {
    setEditing(coupon.id);
    setForm({
      ...initialForm,
      ...coupon,
      starts_at: coupon.starts_at ? coupon.starts_at.slice(0, 16) : '',
      expires_at: coupon.expires_at ? coupon.expires_at.slice(0, 16) : '',
    });
    setShowForm(true);
    setFormErrors({});
    setSuccess('');
  };

  const handleDelete = async (coupon) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    setActionLoading(coupon.id);
    setError('');
    try {
      await couponService.deleteCoupon(coupon.id);
      setSuccess('Coupon deleted successfully');
      fetchCoupons();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete coupon');
    }
    setActionLoading(false);
  };

  const handleCreate = () => {
    setEditing(null);
    setForm(initialForm);
    setShowForm(true);
    setFormErrors({});
    setSuccess('');
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditing(null);
    setForm(initialForm);
    setFormErrors({});
    setSuccess('');
  };

  const handleGenerateCode = () => {
    setForm(prev => ({
      ...prev,
      code: generateCouponCode()
    }));
    setFormErrors(prev => ({ ...prev, code: '' }));
  };

  const validateForm = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Name is required';
    if (!form.type) errors.type = 'Type is required';
    if (!form.value || isNaN(form.value) || Number(form.value) < 0) errors.value = 'Valid value required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const currentUserId = 1; // Replace with your actual user ID logic

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setActionLoading(true);
    setError('');
    try {
      const payload = { ...form, created_by: currentUserId };
      if (editing) {
        await couponService.updateCoupon(editing, payload);
        setSuccess('Coupon updated successfully');
      } else {
        await couponService.createCoupon(payload);
        setSuccess('Coupon created successfully');
      }
      setShowForm(false);
      fetchCoupons();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save coupon');
      setFormErrors(err.response?.data?.errors || {});
    }
    setActionLoading(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <FiTag className="text-green-600 w-8 h-8" />
            <h2 className="text-2xl font-bold text-gray-900">Coupons & Discounts</h2>
          </div>
          <button
            className="bg-blue-500 text-white px-5 py-2 rounded-lg flex items-center font-medium hover:bg-blue-600 transition"
            onClick={handleCreate}
          >
            <FiPlus className="mr-2" /> Create Coupon
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">{error}</div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-700">{success}</div>
        )}

        {/* Coupon Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <CouponPreview coupon={form} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  className={`w-full border rounded-lg px-4 py-3 ${formErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                  placeholder="Coupon Name"
                />
                {formErrors.name && <p className="text-sm text-red-600 mt-1">{formErrors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center justify-between">
                  Code
                  <button
                    type="button"
                    className="ml-2 px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200 flex items-center"
                    onClick={handleGenerateCode}
                  >
                    <FiRefreshCw className="mr-1" /> Generate
                  </button>
                </label>
                <input
                  type="text"
                  name="code"
                  value={form.code}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-4 py-3 border-gray-300 font-mono tracking-widest"
                  placeholder="Auto-generated if empty"
                  maxLength={16}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Type *</label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleInputChange}
                  className={`w-full border rounded-lg px-4 py-3 ${formErrors.type ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                  <option value="free_shipping">Free Shipping</option>
                </select>
                {formErrors.type && <p className="text-sm text-red-600 mt-1">{formErrors.type}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Value *</label>
                <input
                  type="number"
                  name="value"
                  value={form.value}
                  onChange={handleInputChange}
                  className={`w-full border rounded-lg px-4 py-3 ${formErrors.value ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                  placeholder="e.g. 10 for 10%"
                  min="0"
                  step="0.01"
                />
                {formErrors.value && <p className="text-sm text-red-600 mt-1">{formErrors.value}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <input
                  type="text"
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-4 py-3 border-gray-300"
                  placeholder="Short description"
                  maxLength={100}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Minimum Order Amount</label>
                <input
                  type="number"
                  name="minimum_amount"
                  value={form.minimum_amount}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-4 py-3 border-gray-300"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Maximum Discount</label>
                <input
                  type="number"
                  name="maximum_discount"
                  value={form.maximum_discount}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-4 py-3 border-gray-300"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Usage Limit</label>
                <input
                  type="number"
                  name="usage_limit"
                  value={form.usage_limit}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-4 py-3 border-gray-300"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Usage Limit Per User</label>
                <input
                  type="number"
                  name="usage_limit_per_user"
                  value={form.usage_limit_per_user}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-4 py-3 border-gray-300"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Start Date</label>
                <input
                  type="datetime-local"
                  name="starts_at"
                  value={form.starts_at}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-4 py-3 border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Expiry Date</label>
                <input
                  type="datetime-local"
                  name="expires_at"
                  value={form.expires_at}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-4 py-3 border-gray-300"
                />
              </div>
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={form.is_active}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label className="text-sm font-medium">Active</label>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center"
                onClick={handleCancel}
                disabled={actionLoading}
              >
                <FiX className="mr-2" /> Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center disabled:opacity-50"
                disabled={actionLoading}
              >
                {actionLoading ? <FiLoader className="animate-spin w-4 h-4 mr-2" /> : <FiSave className="w-4 h-4 mr-2" />}
                {editing ? 'Update Coupon' : 'Create Coupon'}
              </button>
            </div>
          </form>
        )}

        {/* Coupon List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8">
                    <FiLoader className="animate-spin w-6 h-6 text-blue-500 mx-auto" />
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">No coupons found.</td>
                </tr>
              ) : (
                coupons.map(coupon => (
                  <tr key={coupon.id}>
                    <td className="px-6 py-4 font-mono">{coupon.code}</td>
                    <td className="px-6 py-4">{coupon.name}</td>
                    <td className="px-6 py-4 capitalize">{coupon.type.replace('_', ' ')}</td>
                    <td className="px-6 py-4">{coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        coupon.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {coupon.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex space-x-2">
                      <button
                        className="bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100 flex items-center"
                        onClick={() => handleEdit(coupon)}
                        disabled={actionLoading === coupon.id}
                      >
                        <FiEdit className="w-4 h-4 mr-1" /> Edit
                      </button>
                      <button
                        className="bg-red-50 text-red-600 px-3 py-1 rounded hover:bg-red-100 flex items-center"
                        onClick={() => handleDelete(coupon)}
                        disabled={actionLoading === coupon.id}
                      >
                        <FiTrash2 className="w-4 h-4 mr-1" /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CouponDiscountPage;