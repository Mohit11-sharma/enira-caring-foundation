import { apiService } from './api';

export const couponService = {
  // Get all coupons with filters
  getCoupons: async (params = {}) => {
    try {
      const response = await apiService.get('/coupons', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single coupon
  getCoupon: async (id) => {
    try {
      const response = await apiService.get(`/coupons/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create new coupon
  createCoupon: async (data) => {
    try {
      const response = await apiService.post('/coupons', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update coupon
  updateCoupon: async (id, data) => {
    try {
      const response = await apiService.put(`/coupons/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete coupon
  deleteCoupon: async (id) => {
    try {
      const response = await apiService.delete(`/coupons/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Validate coupon
  validateCoupon: async (code, orderData = {}) => {
    try {
      const response = await apiService.post('/coupons/validate', {
        code,
        ...orderData
      });
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Apply coupon
  applyCoupon: async (code, orderData) => {
    try {
      const response = await apiService.post('/coupons/apply', {
        code,
        ...orderData
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get coupon usage history
  getUsageHistory: async (id, params = {}) => {
    try {
      const response = await apiService.get(`/coupons/${id}/usage-history`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};