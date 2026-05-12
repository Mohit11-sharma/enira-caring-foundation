import { apiService } from './api';

class AuthService {
  // Register user
  async register(userData) {
    try {
      // Use regular POST since we're sending JSON data with photo URL
      const response = await apiService.post('/register', userData);
      
      if (response.success) {
        // Store token and user data
        this.setAuthData(response.token, response.user);
        return response;
      }
      
      throw new Error(response.message || 'Registration failed');
    } catch (error) {
      // Enhanced error handling for validation errors
      if (error.status === 422 && error.errors) {
        // Create a more descriptive error object
        const validationError = new Error('Validation failed');
        validationError.status = 422;
        validationError.errors = error.errors;
        validationError.validationErrors = error.errors;
        throw validationError;
      }
      
      throw error;
    }
  }

  // Login user
  async login(credentials) {
    try {
      const response = await apiService.post('/login', credentials);
      
      if (response.success) {
        // Store token and user data
        this.setAuthData(response.token, response.user);
        return response;
      }
      
      throw new Error(response.message || 'Login failed');
    } catch (error) {
      // Enhanced error handling for validation errors

      
      throw error;
    }
  }

  // Logout user
  async logout() {
    try {
      await apiService.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API call success
      this.clearAuthData();
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      const response = await apiService.get('/me');
      return response.user;
    } catch (error) {
      this.clearAuthData();
      throw error;
    }
  }

  // Get team members
  async getTeamMembers() {
    const response = await apiService.get('/team-members');
    return response.data;
  }

  // Get single team member by ID
  async getTeamMember(id) {
    const response = await apiService.get(`/team-members/${id}`);
    return response.data;
  }

  // Update team member by ID
  async updateTeamMember(id, data) {
    const response = await apiService.put(`/team-members/${id}`, data);
    return response.data;
  }

  // Delete team member by ID
  async deleteTeamMember(id) {
    const response = await apiService.delete(`/team-members/${id}`);
    return response.data;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  // Get stored token
  getToken() {
    return localStorage.getItem('token');
  }

  // Get stored user
  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Set auth data in localStorage
  setAuthData(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Clear auth data from localStorage
  clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Check if user has specific role
  hasRole(role) {
    const user = this.getUser();
    return user && user.role === role;
  }

  // Check if user has any of the specified roles
  hasAnyRole(roles) {
    const user = this.getUser();
    return user && roles.includes(user.role);
  }


}

export const authService = new AuthService();
export default authService;