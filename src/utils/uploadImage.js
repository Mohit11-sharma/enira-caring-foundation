const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export async function uploadImageToLaravel(file) {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_BASE_URL}/upload-image`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  if (data.success) {
    return data.url; // Public URL to use in your app
  }
  throw new Error(data.message || 'Image upload failed');
}