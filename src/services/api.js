const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      ...options,
    };

    // Merge headers properly to avoid overwriting
    if (options.headers) {
      config.headers = {
        ...config.headers,
        ...options.headers,
      };
    }

    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log('⚠️ No auth token found in localStorage');
    }

    // Log the actual body content if it exists
    if (config.body) {
      try {
        const parsedBody = JSON.parse(config.body);
        console.log('📤 Request body:', parsedBody);
      } catch (e) {
        console.log('📄 Raw request body (not JSON):', config.body);
      }
    }

    try {
      console.log('🌐 Making request to:', url);
      const response = await fetch(url, config);
      
      // Try to parse JSON response
      let data;
      try {
        const responseText = await response.text();
        console.log('📥 Raw response:', responseText);
        
        if (responseText) {
          data = JSON.parse(responseText);
        } else {
          data = {};
        }
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError);
        throw new Error('Invalid response format from server');
      }

      if (!response.ok) {
        console.error('❌ HTTP error response:', {
          status: response.status,
          statusText: response.statusText,
          data
        });
        
        // Handle validation errors specifically
        if (response.status === 422 && data.errors) {
          const validationError = new Error(data.message || 'Validation failed');
          validationError.status = 422;
          validationError.errors = data.errors;
          validationError.message = data.message || 'Validation failed';
          throw validationError;
        }
        
        // Handle other HTTP errors
        const error = new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      console.log('✅ Request successful:', data);
      return data;
    } catch (error) {
      console.error('❌ Request failed:', error);
      
      // If it's already our custom error, re-throw it
      if (error.status) {
        throw error;
      }
      
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to server');
      }
      
      // Generic error
      throw new Error(error.message || 'Request failed');
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, {
      method: 'GET',
    });
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // POST request with FormData (for file uploads)
  async postFormData(endpoint, formData) {
    console.log('📤 Sending FormData to:', endpoint);
    
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        // Don't set Content-Type for FormData, let browser set it with boundary
      },
      body: formData,
    };

    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔐 Auth token added to FormData request');
    }
    
    try {
      console.log('🌐 Making FormData request to:', url);
      const response = await fetch(url, config);
      
      let data;
      try {
        const responseText = await response.text();
        console.log('📥 FormData raw response:', responseText);
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError);
        throw new Error('Invalid response format from server');
      }

      if (!response.ok) {
        console.error('❌ FormData HTTP error response:', {
          status: response.status,
          statusText: response.statusText,
          data
        });
        
        // Handle validation errors specifically
        if (response.status === 422 && data.errors) {
          const validationError = new Error(data.message || 'Validation failed');
          validationError.status = 422;
          validationError.errors = data.errors;
          throw validationError;
        }
        
        const error = new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      console.log('✅ FormData request successful, returning data:', data);
      return data;
    } catch (error) {
      console.error('❌ FormData request failed:', error);
      
      if (error.status) {
        throw error;
      }
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to server');
      }
      
      throw new Error(error.message || 'Request failed');
    }
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();