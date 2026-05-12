import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FiUser, FiMail, FiPhone, FiCalendar, FiCamera } from 'react-icons/fi';

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Access Denied</h2>
          <p className="text-gray-500">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8 mt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-yellow-500 px-8 py-12">
            <div className="flex items-center space-x-6">
              <div className="relative">
                {user.photo ? (
                  <img
                    src={user.photo}
                    alt={user.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-3xl font-bold text-green-600 border-4 border-white shadow-lg">
                    {getUserInitials(user.name)}
                  </div>
                )}
                <div className="absolute bottom-0 right-0 bg-yellow-500 rounded-full p-2 shadow-lg">
                  <FiCamera className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                <p className="text-green-100">{user.email}</p>
                {user.phone && (
                  <p className="text-green-100">{user.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <FiUser className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Full Name</h3>
                </div>
                <p className="text-gray-700">{user.name}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <FiMail className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Email Address</h3>
                </div>
                <p className="text-gray-700">{user.email}</p>
              </div>

              {user.phone && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <FiPhone className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Phone Number</h3>
                  </div>
                  <p className="text-gray-700">{user.phone}</p>
                </div>
              )}

              {user.address && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Address</h3>
                  </div>
                  <p className="text-gray-700">{user.address}</p>
                </div>
              )}

              {user.created_at && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <FiCalendar className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Member Since</h3>
                  </div>
                  <p className="text-gray-700">
                    {new Date(user.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}

              {user.role && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Role</h3>
                  </div>
                  <span className="inline-block bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}