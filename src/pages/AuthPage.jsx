"use client"
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FiLoader, FiEye, FiEyeOff, FiCamera, FiUpload, FiX, FiUser } from "react-icons/fi";
import { uploadImageToLaravel } from "../utils/uploadImage"; // <-- Replace imgbb import

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    photo: null,
    photoUrl: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();
  const { login, register, loading } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear password confirmation error when either password field changes
    if (name === 'password' || name === 'confirmPassword') {
      setValidationErrors(prev => ({
        ...prev,
        confirmPassword: ''
      }));
    }
  };

  const validatePasswordConfirmation = () => {
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setValidationErrors(prev => ({
        ...prev,
        confirmPassword: 'Passwords do not match'
      }));
      return false;
    }
    return true;
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      setMessage('');

      // Validate file (optional, you can add your own validation here)
      // Example: check file type and size
      if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
        throw new Error('Please select a valid image file (jpg, png, gif, etc.)');
      }
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size too large. Maximum size is 5MB');
      }

      // Upload to Laravel storage
      const url = await uploadImageToLaravel(file);

      setFormData(prev => ({
        ...prev,
        photo: file,
        photoUrl: url
      }));

      setMessage('Photo uploaded successfully!');
      setTimeout(() => setMessage(''), 3000);

    } catch (error) {
      setMessage(error.message);
      setFormData(prev => ({
        ...prev,
        photo: null,
        photoUrl: ''
      }));
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = () => {
    setFormData(prev => ({
      ...prev,
      photo: null,
      photoUrl: ''
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors({});
    setMessage('');

    // Validate password confirmation for registration
    if (!isLogin && !validatePasswordConfirmation()) {
      return;
    }

    try {
      let result;
      
      if (isLogin) {
        result = await login({
          email: formData.email,
          password: formData.password
        });
      } else {
        // Prepare registration data
        const registrationData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          password: formData.password,
          password_confirmation: formData.confirmPassword,  // Added for backend validation
          role: 'user' // Default role
        };

        // Add photo URL if uploaded
        if (formData.photoUrl) {
          registrationData.photo = formData.photoUrl;
        }

        result = await register(registrationData);
      }

      if (result.success) {
        setMessage(result.message);
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setMessage(result.message);
        
        // Handle validation errors
        if (result.validationErrors) {
          setValidationErrors(result.validationErrors);
        }
      }
    } catch (error) {
      setMessage(error.message || 'An error occurred');
    }
  };

  const getFieldError = (fieldName) => {
    return validationErrors[fieldName] ? validationErrors[fieldName][0] : '';
  };

  const switchToLogin = () => {
    setIsLogin(true);
    setValidationErrors({});
    setMessage('');
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      password: '',
      confirmPassword: '',
      photo: null,
      photoUrl: ''
    });
    removePhoto();
  };

  const switchToRegister = () => {
    setIsLogin(false);
    setValidationErrors({});
    setMessage('');
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      password: '',
      confirmPassword: '',
      photo: null,
      photoUrl: ''
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-yellow-100 to-white">
      <div className="w-full mt-24 mb-7 max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header Tabs */}
        <div className="flex justify-center items-center border-b border-gray-100 bg-gray-50">
          <button
            className={`flex-1 py-4 text-lg font-bold transition ${
              isLogin
                ? "text-green-700 border-b-4 border-green-600 bg-white"
                : "text-gray-400 hover:text-green-700"
            }`}
            onClick={switchToLogin}
          >
            Login
          </button>
          <button
            className={`flex-1 py-4 text-lg font-bold transition ${
              !isLogin
                ? "text-yellow-600 border-b-4 border-yellow-500 bg-white"
                : "text-gray-400 hover:text-yellow-600"
            }`}
            onClick={switchToRegister}
          >
            Register
          </button>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`m-4 p-3 rounded-lg text-center ${
            message.includes('successful') || message.includes('Success') || message.includes('uploaded')
              ? 'bg-green-100 text-green-700 border border-green-300'
              : 'bg-red-100 text-red-700 border border-red-300'
          }`}>
            {message}
          </div>
        )}

        {/* Forms Container */}
        <div className="relative w-full" style={{ minHeight: isLogin ? "540px" : "920px" }}>
          {/* Login Form */}
          <div
            className={`absolute top-0 left-0 w-full transition-all duration-500 ${
              isLogin ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-8">
              <h2 className="text-2xl font-extrabold text-green-700 mb-2 text-center">Welcome Back!</h2>
              <p className="text-center text-gray-500 mb-4">Sign in to your account</p>
              
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    getFieldError('email') ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 font-medium`}
                  required
                />
                {getFieldError('email') && (
                  <p className="text-red-500 text-sm mt-1">{getFieldError('email')}</p>
                )}
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    getFieldError('password') ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 font-medium pr-12`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
                {getFieldError('password') && (
                  <p className="text-red-500 text-sm mt-1">{getFieldError('password')}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-yellow-500 hover:from-yellow-500 hover:to-green-600 text-white font-bold text-lg shadow-lg transition duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin" size={20} />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Login</span>
                )}
              </button>

              <div className="text-center text-gray-600 mt-4">
                <span>Don't have an account? </span>
                <button
                  className="text-yellow-500 font-semibold hover:underline"
                  type="button"
                  onClick={switchToRegister}
                >
                  Register
                </button>
              </div>
            </form>
          </div>

          {/* Register Form */}
          <div
            className={`absolute top-0 left-0 w-full transition-all duration-500 ${
              !isLogin ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-8">
              <h2 className="text-2xl font-extrabold text-yellow-600 mb-2 text-center">Create an Account</h2>
              <p className="text-center text-gray-500 mb-4">Join us for an amazing experience</p>
              
              {/* Photo Upload Section */}
              <div className="flex flex-col items-center mb-3">
                <div className="relative">
                  {formData.photoUrl ? (
                    <div className="relative">
                      <img
                        src={formData.photoUrl}
                        alt="Profile preview"
                        className="w-16 h-16 rounded-full object-cover border-4 border-yellow-400 shadow-lg"
                      />
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <FiX size={10} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full border-4 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                      <FiUser size={20} className="text-gray-400" />
                    </div>
                  )}
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="mt-2 flex items-center gap-2 px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <FiLoader className="animate-spin" size={12} />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <FiCamera size={12} />
                      <span>Upload Photo</span>
                    </>
                  )}
                </button>
              </div>

              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    getFieldError('name') ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-50 font-medium text-sm`}
                  required
                />
                {getFieldError('name') && (
                  <p className="text-red-500 text-xs mt-1">{getFieldError('name')}</p>
                )}
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address"
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    getFieldError('email') ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-50 font-medium text-sm`}
                  required
                />
                {getFieldError('email') && (
                  <p className="text-red-500 text-xs mt-1">{getFieldError('email')}</p>
                )}
              </div>

              <div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    getFieldError('phone') ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-50 font-medium text-sm`}
                  required
                />
                {getFieldError('phone') && (
                  <p className="text-red-500 text-xs mt-1">{getFieldError('phone')}</p>
                )}
              </div>

              <div>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Complete Address"
                  rows={2}
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    getFieldError('address') ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-50 font-medium resize-none text-sm`}
                  required
                />
                {getFieldError('address') && (
                  <p className="text-red-500 text-xs mt-1">{getFieldError('address')}</p>
                )}
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    getFieldError('password') ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-50 font-medium pr-12 text-sm`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
                {getFieldError('password') && (
                  <p className="text-red-500 text-xs mt-1">{getFieldError('password')}</p>
                )}
              </div>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm Password"
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    getFieldError('confirmPassword') || (formData.confirmPassword && formData.password !== formData.confirmPassword) ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-50 font-medium pr-12 text-sm`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
                {getFieldError('confirmPassword') && (
                  <p className="text-red-500 text-xs mt-1">{getFieldError('confirmPassword')}</p>
                )}
                {formData.confirmPassword && formData.password !== formData.confirmPassword && !getFieldError('confirmPassword') && (
                  <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                )}
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <p className="text-green-500 text-xs mt-1">✓ Passwords match</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || uploading || (formData.password !== formData.confirmPassword && formData.confirmPassword)}
                className="mt-3 px-6 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-green-600 hover:from-green-600 hover:to-yellow-500 text-white font-bold text-base shadow-lg transition duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin" size={18} />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <span>Register</span>
                )}
              </button>

              <div className="text-center text-gray-600 mt-3">
                <span className="text-sm">Already have an account? </span>
                <button
                  className="text-green-600 font-semibold hover:underline text-sm"
                  type="button"
                  onClick={switchToLogin}
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}