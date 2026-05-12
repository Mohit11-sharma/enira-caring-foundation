import React, { useState, useEffect } from 'react';

const InstagramLinks = () => {
  const [links, setLinks] = useState([]);
  const [newLink, setNewLink] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Load existing links from storage
  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    try {
      const result = await window.storage.get('instagram_links');
      if (result && result.value) {
        setLinks(JSON.parse(result.value));
      }
    } catch (error) {
      console.log('No existing links found');
    } finally {
      setLoading(false);
    }
  };

  const saveLinks = async (updatedLinks) => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      await window.storage.set('instagram_links', JSON.stringify(updatedLinks), true);
      setLinks(updatedLinks);
      setMessage({ type: 'success', text: 'Links successfully saved!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Error saving links. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const addLink = () => {
    if (!newLink.trim()) {
      setMessage({ type: 'error', text: 'Please enter a valid link' });
      return;
    }

    // Convert Instagram post/reel URL to embed URL
    let embedUrl = newLink.trim();
    if (embedUrl.includes('instagram.com') && !embedUrl.includes('/embed')) {
      // Remove trailing slash if exists
      embedUrl = embedUrl.replace(/\/$/, '');
      // Add /embed at the end
      embedUrl = `${embedUrl}/embed`;
    }

    const updatedLinks = [...links, embedUrl];
    saveLinks(updatedLinks);
    setNewLink('');
  };

  const removeLink = (index) => {
    const updatedLinks = links.filter((_, i) => i !== index);
    saveLinks(updatedLinks);
  };

  const moveLink = (index, direction) => {
    const newLinks = [...links];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < links.length) {
      [newLinks[index], newLinks[newIndex]] = [newLinks[newIndex], newLinks[index]];
      saveLinks(newLinks);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Manage Instagram Links
      </h1>

      {message.text && (
        <div className={`mb-4 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Add New Instagram Post</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={newLink}
            onChange={(e) => setNewLink(e.target.value)}
            placeholder="Paste Instagram post/reel URL here"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            onKeyPress={(e) => e.key === 'Enter' && addLink()}
          />
          <button
            onClick={addLink}
            disabled={saving}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
          >
            Add
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Example: https://www.instagram.com/p/ABC123/ or https://www.instagram.com/reel/XYZ789/
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">
          Current Links ({links.length})
        </h2>
        
        {links.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No Instagram links added yet. Add your first link above!
          </p>
        ) : (
          <div className="space-y-3">
            {links.map((link, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
              >
                <span className="text-gray-500 font-semibold min-w-[30px]">
                  #{index + 1}
                </span>
                
                <div className="flex-1 truncate text-sm text-gray-700">
                  {link}
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => moveLink(index, 'up')}
                    disabled={index === 0 || saving}
                    className="p-2 text-gray-600 hover:text-purple-600 disabled:text-gray-300 transition-colors"
                    title="Move up"
                  >
                    ↑
                  </button>
                  
                  <button
                    onClick={() => moveLink(index, 'down')}
                    disabled={index === links.length - 1 || saving}
                    className="p-2 text-gray-600 hover:text-purple-600 disabled:text-gray-300 transition-colors"
                    title="Move down"
                  >
                    ↓
                  </button>
                  
                  <button
                    onClick={() => removeLink(index)}
                    disabled={saving}
                    className="px-3 py-1 text-red-600 hover:bg-red-50 rounded disabled:text-gray-300 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstagramLinks;