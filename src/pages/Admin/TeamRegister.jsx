import React, { useState } from 'react';
import { authService } from '../../services/authService';
import { uploadImageToLaravel } from '../../utils/uploadImage';

const TeamRegister = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    password_confirmation: '',
    photo: null,
    photo_url: '',
  });
  const [loading, setLoading] = useState(false);
  const [imgUploading, setImgUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // Handle image upload separately
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImgUploading(true);
    setError('');
    try {
      const url = await uploadImageToLaravel(file);
      setForm((prev) => ({
        ...prev,
        photo: file,
        photo_url: url,
      }));
    } catch (err) {
      setError('Image upload failed');
    } finally {
      setImgUploading(false);
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const registrationData = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        password: form.password,
        password_confirmation: form.password_confirmation,
        role: 'manager',
        photo: form.photo_url, // Use the image URL from upload
      };


      const response = await authService.register(registrationData);
      setSuccess('Team member registered successfully!');
      setForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        password_confirmation: '',
        photo: null,
        photo_url: '',
      });
    } catch (err) {
      if (err.errors) {
        setError(Object.values(err.errors).flat().join(' '));
      } else {
        setError(err.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Add Team Member</h2>
      <p className="text-gray-500 mb-6">Register a new manager for your team. Upload a profile photo for a professional touch.</p>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded mb-4">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
        <div className="flex flex-col items-center mb-4">
          <div className="relative w-24 h-24 mb-2">
            {form.photo_url ? (
              <img src={form.photo_url} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-blue-500" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-4xl border-2 border-gray-200">
                <span>+</span>
              </div>
            )}
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
              disabled={imgUploading}
            />
          </div>
          <span className="text-xs text-gray-500">{imgUploading ? 'Uploading...' : 'Profile Photo (optional)'}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="password"
            name="password_confirmation"
            placeholder="Confirm Password"
            value={form.password_confirmation}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading || imgUploading}
          className={`w-full py-3 rounded-lg font-semibold text-white transition-colors ${loading || imgUploading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default TeamRegister;