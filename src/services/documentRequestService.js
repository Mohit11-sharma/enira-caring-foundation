import { apiService } from './api';

class DocumentRequestService {
  /**
   * Get all document requests with optional filters
   * @param {Object} params - Query parameters (page, per_page, status, etc.)
   */
  async getAllRequests(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/document-requests${queryString ? `?${queryString}` : ''}`;
      return await apiService.get(endpoint);
    } catch (error) {
      console.error('Error fetching document requests:', error);
      throw error;
    }
  }

  /**
   * Get statistics for document requests
   */
  async getStats() {
    try {
      return await apiService.get('/document-requests/stats');
    } catch (error) {
      console.error('Error fetching stats:', error);
      return { total: 0, pending: 0, approved: 0, declined: 0 };
    }
  }

  /**
   * Get a single document request by ID
   * @param {number} id - Request ID
   */
  async getRequest(id) {
    try {
      return await apiService.get(`/document-requests/${id}`);
    } catch (error) {
      console.error(`Error fetching request ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new document request (from public form)
   * @param {Object} data - Request data (name, email, phone, message, requested_documents)
   */
  async createRequest(data) {
    try {
      // Sanitize and validate the data before sending
      const sanitizedData = {
        name: String(data.name || '').trim(),
        email: String(data.email || '').trim(),
        phone: String(data.phone || '').trim().substring(0, 20), // Limit phone to 20 chars
        message: String(data.message || '').trim(),
        requested_documents: Array.isArray(data.requested_documents) 
          ? data.requested_documents 
          : []
      };

      console.log('📤 Sanitized payload:', sanitizedData);
      
      return await apiService.post('/document-requests', sanitizedData);
    } catch (error) {
      console.error('Error creating document request:', error);
      throw error;
    }
  }

  /**
   * Approve a document request
   * @param {number} id - Request ID
   */
  async approveRequest(id) {
    try {
      // Send empty object as Laravel endpoint likely doesn't expect body data
      // The route just triggers the approve action based on the ID
      const url = `/document-requests/${id}/approve`;
      return await apiService.request(url, {
        method: 'POST',
      });
    } catch (error) {
      console.error(`Error approving request ${id}:`, error);
      throw error;
    }
  }

  /**
   * Decline a document request
   * @param {number} id - Request ID
   * @param {string} reason - Reason for declining
   */
  async declineRequest(id, reason = '') {
    try {
      return await apiService.post(`/document-requests/${id}/decline`, { 
        status: 'declined',
        reason 
      });
    } catch (error) {
      console.error(`Error declining request ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a document request
   * @param {number} id - Request ID
   */
  async deleteRequest(id) {
    try {
      return await apiService.delete(`/document-requests/${id}`);
    } catch (error) {
      console.error(`Error deleting request ${id}:`, error);
      throw error;
    }
  }
}

export const documentRequestService = new DocumentRequestService();
export default documentRequestService;