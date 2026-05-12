import { apiService } from './api';

class OrderService {
  constructor() {
   
  }

  /**
   * Create new order from cart
   * @param {Object} orderData - Order information
   * @returns {Promise<Object>} Created order data
   */
  async createOrder(orderData) {
    try {
      
      // Handle both formats - direct order data and nested address format
      let data;

      if (orderData.shippingAddress) {
        // Nested format (from previous implementation)
        data = {
          shipping_name: orderData.shippingAddress.name,
          shipping_email: orderData.shippingAddress.email,
          shipping_phone: orderData.shippingAddress.phone,
          shipping_address: orderData.shippingAddress.address,
          shipping_city: orderData.shippingAddress.city,
          shipping_state: orderData.shippingAddress.state,
          shipping_postal_code: orderData.shippingAddress.postal_code,
          shipping_country: orderData.shippingAddress.country || 'India',

          // Billing address (optional, defaults to shipping if not provided)
          billing_name: orderData.billingAddress?.name || orderData.shippingAddress.name,
          billing_email: orderData.billingAddress?.email || orderData.shippingAddress.email,
          billing_phone: orderData.billingAddress?.phone || orderData.shippingAddress.phone,
          billing_address: orderData.billingAddress?.address || orderData.shippingAddress.address,
          billing_city: orderData.billingAddress?.city || orderData.shippingAddress.city,
          billing_state: orderData.billingAddress?.state || orderData.shippingAddress.state,
          billing_postal_code: orderData.billingAddress?.postal_code || orderData.shippingAddress.postal_code,
          billing_country: orderData.billingAddress?.country || orderData.shippingAddress.country || 'India',

          // Coupon information
          coupon_code: orderData.couponCode || null,

          // Additional notes
          notes: orderData.notes || null
        };
      } else {
        // Direct format (current implementation)
        data = {
          shipping_name: orderData.shipping_name,
          shipping_email: orderData.shipping_email,
          shipping_phone: orderData.shipping_phone,
          shipping_address: orderData.shipping_address,
          shipping_city: orderData.shipping_city,
          shipping_state: orderData.shipping_state,
          shipping_postal_code: orderData.shipping_postal_code,
          shipping_country: orderData.shipping_country || 'India',

          billing_name: orderData.billing_name,
          billing_email: orderData.billing_email,
          billing_phone: orderData.billing_phone,
          billing_address: orderData.billing_address,
          billing_city: orderData.billing_city,
          billing_state: orderData.billing_state,
          billing_postal_code: orderData.billing_postal_code,
          billing_country: orderData.billing_country || 'India',

          coupon_code: orderData.coupon_code || null,
          payment_method: orderData.payment_method || 'easybuzz',
          subtotal: orderData.subtotal || 0,
          tax_amount: orderData.tax_amount || 0,
          shipping_amount: orderData.shipping_amount || 0,
          discount_amount: orderData.discount_amount || 0,
          total_amount: orderData.total_amount || 0,
          notes: orderData.notes || null
        };
      }

      
      const response = await apiService.post('/orders', data);
      if (response && response.success && response.data && response.data.id) {
        // Success: order created
        return {
          success: true,
          orderId: response.data.id,
          ...response.data
        };
      }
      return response.data;
    } catch (error) {
      
      // Handle specific stock-related errors
      if (error.status === 400 && error.message.includes('Insufficient stock')) {
        const productName = error.message.match(/Insufficient stock for (.+?)(?:\s*$|\s*,)/)?.[1] || 'a product';
        throw new Error(`Sorry, "${productName}" is currently out of stock or has insufficient quantity available. Please reduce the quantity or remove it from your cart.`);
      }

      // Handle stock availability errors
      if (error.status === 400 && error.data?.available_stock !== undefined) {
        const availableStock = error.data.available_stock;
        if (availableStock === null || availableStock === 0) {
          throw new Error(`This item is currently out of stock. Please remove it from your cart or contact support for availability.`);
        } else {
          throw new Error(`Only ${availableStock} units are available. Please reduce the quantity in your cart.`);
        }
      }

      // Handle general validation errors
      if (error.status === 400) {
        throw new Error('Invalid order data. Please check your cart and shipping information.');
      }

      if (error.status === 422) {
        const errorMessages = Object.values(error.errors || {}).flat().join(', ');
        throw new Error(`Validation failed: ${errorMessages}`);
      }

      if (error.status === 500) {
        throw new Error('Server error occurred. Please try again later.');
      }

      throw new Error(error.message || 'Failed to create order');
    }
  }

  /**
   * Check stock availability for cart items
   * @returns {Promise<Object>} Stock availability data
   */
  async checkStockAvailability() {
    try {
     
      const response = await apiService.get('/orders/check-stock');
     
      return response.data;
    } catch (error) {
      
      throw new Error(error.message || 'Failed to check stock availability');
    }
  }

  /**
   * Get product stock information
   * @param {number} productId - Product ID
   * @returns {Promise<Object>} Stock information
   */
  async getProductStock(productId) {
    try {
     
      const response = await apiService.get(`/products/${productId}/stock`);
     
      return response.data;
    } catch (error) {

      throw new Error(error.message || 'Failed to get product stock information');
    }
  }

  /**
   * Update product stock (admin only)
   * @param {number} productId - Product ID
   * @param {number} quantity - New stock quantity
   * @returns {Promise<Object>} Updated stock data
   */
  async updateProductStock(productId, quantity) {
    try {
      
      const response = await apiService.put(`/products/${productId}/stock`, {
        stock_quantity: quantity
      });
      
      return response.data;
    } catch (error) {
     
      throw new Error(error.message || 'Failed to update product stock');
    }
  }

  /**
   * Get all orders for current user
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Orders data with pagination
   */
  async getOrders(params = {}) {
    try {
      
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.per_page) queryParams.append('per_page', params.per_page);
      if (params.status) queryParams.append('status', params.status);
      if (params.sort_by) queryParams.append('sort_by', params.sort_by);
      if (params.sort_order) queryParams.append('sort_order', params.sort_order);

      const queryString = queryParams.toString();
      const endpoint = queryString ? `/orders?${queryString}` : '/orders';

      const response = await apiService.get(endpoint);
     
      return response.data;
    } catch (error) {
      
      throw new Error(error.message || 'Failed to retrieve orders');
    }
  }

  /**
   * Get single order by ID
   * @param {number} orderId - Order ID
   * @returns {Promise<Object>} Order data
   */
  async getOrder(orderId) {
    try {
     
      const response = await apiService.get(`/orders/${orderId}`);
     
      return response.data;
    } catch (error) {
      
      throw new Error(error.message || 'Failed to retrieve order');
    }
  }

  /**
   * Update order status
   * @param {number} orderId - Order ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated order data
   */
  async updateOrderStatus(orderId, newStatus) {
    try {
      
      const response = await apiService.put(`/orders/${orderId}/status`, { status: newStatus });
      
      return response.data;
    } catch (error) {
      
      throw new Error(error.message || 'Failed to update order status');
    }
  }

  /**
   * Cancel order
   * @param {number} orderId - Order ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise<Object>} Updated order data
   */
  async cancelOrder(orderId, reason = '') {
    try {
      
      const response = await apiService.put(`/orders/${orderId}/cancel`, { reason });
      
      return response.data;
    } catch (error) {
      
      throw new Error(error.message || 'Failed to cancel order');
    }
  }

  /**
   * Get order tracking information
   * @param {number} orderId - Order ID
   * @returns {Promise<Object>} Tracking data
   */
  async getOrderTracking(orderId) {
    try {
      
      const response = await apiService.get(`/orders/track/${orderId}`);
      
      return response;
    } catch (error) {
      
      throw new Error(error.message || 'Failed to retrieve order tracking');
    }
  }

  /**
   * Request order refund
   * @param {number} orderId - Order ID
   * @param {Object} refundData - Refund information
   * @returns {Promise<Object>} Refund request data
   */
  async requestRefund(orderId, refundData) {
    try {
      
      const data = {
        reason: refundData.reason,
        refund_amount: refundData.amount || null,
        items: refundData.items || null,
        comments: refundData.comments || null
      };

      const response = await apiService.post(`/orders/${orderId}/refund`, data);
      
      return response.data;
    } catch (error) {
     
      throw new Error(error.message || 'Failed to request refund');
    }
  }

  /**
   * Get order summary for checkout
   * @returns {Promise<Object>} Order summary from cart
   */
  async getOrderSummary() {
    try {
     
      const response = await apiService.get('/orders/summary');
     
      return response.data;
    } catch (error) {
      
      throw new Error(error.message || 'Failed to get order summary');
    }
  }

  /**
   * Validate order before payment
   * @param {Object} orderData - Order data to validate
   * @returns {Promise<Object>} Validation result
   */
  async validateOrder(orderData) {
    try {
     
      const response = await apiService.post('/orders/validate', orderData);
      
      return response.data;
    } catch (error) {
      
      throw new Error(error.message || 'Order validation failed');
    }
  }

  /**
   * Calculate order totals with shipping and tax
   * @param {Object} calculationData - Data for calculation
   * @returns {Promise<Object>} Calculated totals
   */
  async calculateOrderTotals(calculationData) {
    try {
     
      const data = {
        shipping_state: calculationData.shippingState,
        shipping_country: calculationData.shippingCountry || 'India',
        coupon_code: calculationData.couponCode || null,
        ...calculationData
      };

      const response = await apiService.post('/orders/calculate-totals', data);
      
      return response.data;
    } catch (error) {
      
      throw new Error(error.message || 'Failed to calculate order totals');
    }
  }

  /**
   * Pre-validate checkout before proceeding to payment
   * @param {Object} orderData - Order data to validate
   * @returns {Promise<Object>} Pre-validation result
   */
  async preValidateCheckout(orderData) {
    try {
     
      // Check stock availability first
      await this.checkStockAvailability();

      // Validate order data
      return await this.validateOrder(orderData);
    } catch (error) {
      
      throw error;
    }
  }

  /**
   * Get all orders for admin
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Orders data with pagination
   */
  async getAdminOrders(params = {}) {
    try {
  
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.per_page) queryParams.append('per_page', params.per_page);
      if (params.status) queryParams.append('status', params.status);
      if (params.sort_by) queryParams.append('sort_by', params.sort_by);
      if (params.sort_order) queryParams.append('sort_order', params.sort_order);
      if (params.search) queryParams.append('search', params.search);
      if (params.date_filter) queryParams.append('date_filter', params.date_filter);

      const queryString = queryParams.toString();
      const endpoint = queryString ? `/admin/orders?${queryString}` : '/admin/orders';

      const response = await apiService.get(endpoint);
     
      return response.data;
    } catch (error) {
      
      throw new Error(error.message || 'Failed to retrieve admin orders');
    }
  }

  /**
   * Print invoice for order
   * @param {number} orderId - Order ID
   * @returns {Promise<string>} Download URL for the invoice PDF
   */
  async printInvoice(orderId) {
    try {
      // Call the backend to generate/download invoice PDF for the order
      const response = await apiService.post(`/orders/${orderId}/print-invoice`);
      // The backend should return a download URL for the PDF
      return response.data.data.download_url;
    } catch (error) {
      throw new Error(error.message || 'Failed to print invoice');
    }
  }

  /**
   * Generate invoice for order
   * @param {number} orderId - Order ID
   * @returns {Promise<Object>} Invoice data
   */
  async generateInvoice(orderId) {
    const response = await apiService.post(`/invoices/generate/${orderId}`);
    return response.data;
  }

  /**
   * Download invoice PDF by ID
   * @param {number} invoiceId - Invoice ID
   * @returns {Promise<string>} Download URL for the invoice PDF
   */
  async downloadInvoicePdf(invoiceId) {
    const response = await apiService.get(`/invoices/${invoiceId}/download`);
    return response.data.download_url;
  }
}

// Export singleton instance
export const orderService = new OrderService();
export default orderService;