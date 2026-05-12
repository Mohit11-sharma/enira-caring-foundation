import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiUsers, FiX } from 'react-icons/fi';
import { authService } from '../../services/authService';
import TeamRegister from './TeamRegister';

const TeamMembers = () => {
  const [members, setMembers] = useState([]);
  const [showRegister, setShowRegister] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editMember, setEditMember] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch team members from API
  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await authService.getTeamMembers();
        setMembers(response || []);
      } catch (err) {
        setError('Failed to load team members');
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, [showRegister, showEdit, success]);

  // Remove member
  const handleRemove = async (id) => {
    if (!window.confirm('Are you sure you want to remove this team member?')) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await authService.deleteTeamMember(id);
      setSuccess('Team member removed successfully!');
      setMembers(members.filter(m => m.id !== id));
    } catch (err) {
      setError('Failed to remove team member');
    } finally {
      setLoading(false);
    }
  };

  // Edit member
  const handleEdit = (member) => {
    setEditMember(member);
    setShowEdit(true);
  };

  // Save edited member
  const handleEditSave = async (updatedData) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await authService.updateTeamMember(editMember.id, updatedData);
      setSuccess('Team member updated successfully!');
      setShowEdit(false);
      setEditMember(null);
    } catch (err) {
      setError('Failed to update team member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <FiUsers className="w-5 h-5 mr-2" />
              Team Members
            </h3>
            <p className="text-sm text-gray-500 mt-1">Manage team access and permissions</p>
          </div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
            onClick={() => setShowRegister(true)}
          >
            <FiPlus className="w-4 h-4 mr-2" />
            Add Member
          </button>
        </div>

        {/* Register Modal */}
        {showRegister && (
          <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                onClick={() => setShowRegister(false)}
              >
                <FiX className="w-6 h-6" />
              </button>
              <TeamRegister />
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEdit && editMember && (
          <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                onClick={() => { setShowEdit(false); setEditMember(null); }}
              >
                <FiX className="w-6 h-6" />
              </button>
              <EditMemberForm member={editMember} onSave={handleEditSave} loading={loading} />
            </div>
          </div>
        )}

        <div className="p-6">
          {loading ? (
            <div className="text-blue-600">Loading team members...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.length === 0 ? (
                <div className="col-span-full text-center text-gray-500 py-12">
                  No team members found.
                </div>
              ) : (
                members.map((member, index) => (
                  <div key={member.id || index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                        {member.photo ? (
                          <img src={member.photo} alt={member.name} className="w-12 h-12 object-cover rounded-full" />
                        ) : (
                          <span className="text-white font-semibold">{member.name?.split(' ').map(n => n[0]).join('')}</span>
                        )}
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {member.status || 'active'}
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">{member.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{member.email}</p>
                    <p className="text-sm text-blue-600 font-medium mb-4">{member.role}</p>
                    <div className="flex space-x-2">
                      <button
                        className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded text-sm hover:bg-blue-100 transition-colors"
                        onClick={() => handleEdit(member)}
                      >
                        <FiEdit className="w-4 h-4 mr-1 inline" /> Edit
                      </button>
                      <button
                        className="flex-1 bg-red-50 text-red-600 py-2 px-3 rounded text-sm hover:bg-red-100 transition-colors"
                        onClick={() => handleRemove(member.id)}
                      >
                        <FiTrash2 className="w-4 h-4 mr-1 inline" /> Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          {success && <div className="text-green-600 mt-4">{success}</div>}
        </div>
      </div>
    </div>
  );
};

// Simple edit form for manager
const EditMemberForm = ({ member, onSave, loading }) => {
  const [form, setForm] = useState({
    name: member.name || '',
    email: member.email || '',
    phone: member.phone || '',
    address: member.address || '',
    photo: member.photo || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold mb-2">Edit Team Member</h3>
      <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Full Name"
        required
        className="w-full border border-gray-300 rounded-lg px-4 py-2"
      />
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        required
        className="w-full border border-gray-300 rounded-lg px-4 py-2"
      />
      <input
        type="text"
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="Phone"
        className="w-full border border-gray-300 rounded-lg px-4 py-2"
      />
      <input
        type="text"
        name="address"
        value={form.address}
        onChange={handleChange}
        placeholder="Address"
        className="w-full border border-gray-300 rounded-lg px-4 py-2"
      />
      <input
        type="text"
        name="photo"
        value={form.photo}
        onChange={handleChange}
        placeholder="Photo URL"
        className="w-full border border-gray-300 rounded-lg px-4 py-2"
      />
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 rounded-lg font-semibold text-white transition-colors ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
};

export default TeamMembers;