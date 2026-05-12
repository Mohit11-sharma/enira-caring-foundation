import { apiService } from './api.js';

class PaymentService {
  constructor() {
    console.log('💳 PaymentService initialized');
  }

  /**
   * Get payment methods
   * @returns {Promise<Object>} Available payment methods
   */
  async getPaymentMethods() {
    try {
      
      const response = await apiService.get('/payments/methods');
      
      return response.data;
    } catch (error) {
      
      throw new Error(error.message || 'Failed to retrieve payment methods');
    }
  }

  /**
   * Extract payment URL from response with multiple fallback paths
   * @param {Object} response - Payment response
   * @returns {string|null} Payment URL or null if not found
   */
  extractPaymentUrl(response) {
    
    const possiblePaths = [
      'data.payment_url',
      'data.url',
      'data.redirect_url', 
      'data.checkout_url',
      'data.gateway_url',
      'data.gateway_response.payment_url',
      'data.payment.gateway_response.payment_url',
      'payment_url',
      'url',
      'redirect_url',
      'checkout_url',
      'gateway_url'
    ];

    for (const path of possiblePaths) {
      const pathSegments = path.split('.');
      let value = response;
      
      for (const segment of pathSegments) {
        value = value?.[segment];
        if (value === undefined) break;
      }
      
      // Check if the value is a valid URL and not an error message
      if (value && typeof value === 'string') {
        // Skip if it's an error message
        if (value.toLowerCase().includes('something went wrong') || 
            value.toLowerCase().includes('error') ||
            value.toLowerCase().includes('failed')) {
          console.warn(`⚠️ Found error message instead of URL at path "${path}":`, value);
          continue;
        }
        
        // Check if it's a valid URL
        if (value.startsWith('http') || value.startsWith('//')) {
          console.log(`✅ Found payment URL at path "${path}":`, value);
          return value;
        }
      }
    }
    
    return null;
  }

  /**
   * Initiate payment for order
   * @param {Object} paymentData - Payment information
   * @returns {Promise<Object>} Payment initiation data
   */
  async initiatePayment(paymentData) {
    try {
      
      // Validate required data
      if (!paymentData.orderId) {
        throw new Error('Order ID is required for payment initiation');
      }
      
      const data = {
        order_id: paymentData.orderId,
        payment_method: paymentData.paymentMethod || 'easybuzz',
        return_url: paymentData.returnUrl || `${window.location.origin}/checkout/success`,
        cancel_url: paymentData.cancelUrl || `${window.location.origin}/checkout/cancel`,
        failure_url: paymentData.failureUrl || `${window.location.origin}/checkout/failure`
      };

      
      const response = await apiService.post('/payments/initiate', data);
      
      // Handle different response formats
      let processedResponse;
      
      if (response && typeof response === 'object') {
        // If response has data property, use it
        if (response.data) {
          processedResponse = {
            success: response.success !== false, // Default to true unless explicitly false
            data: response.data,
            message: response.message || 'Payment initiated successfully'
          };
        } else {
          // If no data property, treat entire response as data
          processedResponse = {
            success: response.success !== false,
            data: response,
            message: response.message || 'Payment initiated successfully'
          };
        }
      } else {
        throw new Error('Invalid response format from payment service');
      }
      
      
      // Check for explicit error indicators
      if (processedResponse.success === false) {
        const errorMessage = processedResponse.message || 
                           processedResponse.data?.message || 
                           processedResponse.data?.error ||
                           'Payment initiation failed';
        throw new Error(errorMessage);
      }
      
      // Check for EasyBuzz specific errors in gateway response
      if (processedResponse.data?.gateway_response?.status === 0 || 
          processedResponse.data?.payment?.gateway_response?.gateway_response?.status === 0) {
        
        const gatewayError = processedResponse.data?.gateway_response?.error_desc || 
                            processedResponse.data?.payment?.gateway_response?.gateway_response?.error_desc ||
                            'EasyBuzz gateway error';
        
       
        throw new Error(`Payment gateway error: ${gatewayError}`);
      }
      
      // Check if payment URL contains error messages
      const paymentUrl = this.extractPaymentUrl(processedResponse);
      if (!paymentUrl) {
        // Check for error messages in the response
        const errorMessage = processedResponse.data?.gateway_response?.error_desc ||
                            processedResponse.data?.payment?.gateway_response?.gateway_response?.error_desc ||
                            processedResponse.data?.gateway_response?.data ||
                            'Failed to get valid payment URL from EasyBuzz gateway';
        
        
        throw new Error(errorMessage);
      }
      
      // Add the extracted payment URL to the response
      processedResponse.data.payment_url = paymentUrl;
      
      return processedResponse;
      
    } catch (error) {
      
      
      // Enhanced error handling with specific error types
      if (error.response) {
        // API returned an error response
        const status = error.response.status;
        const responseData = error.response.data;
        
      
        
        if (status === 404) {
          throw new Error('Payment service not found. Please contact customer support.');
        }
        
        if (status === 400) {
          const apiMessage = responseData?.message || responseData?.error || 'Invalid payment data';
          throw new Error(apiMessage);
        }
        
        if (status === 401 || status === 403) {
          throw new Error('Payment authorization failed. Please contact customer support.');
        }
        
        if (status === 422) {
          const validationErrors = responseData?.errors;
          if (validationErrors && typeof validationErrors === 'object') {
            const errorMessages = Object.values(validationErrors).flat();
            throw new Error(errorMessages.join(', '));
          }
          throw new Error(responseData?.message || 'Validation failed');
        }
        
        if (status === 500) {
          throw new Error('Payment gateway is temporarily unavailable. Please try again later.');
        }
        
        // Generic API error
        const apiMessage = responseData?.message || responseData?.error || `API Error (${status})`;
        throw new Error(apiMessage);
        
      } else if (error.request) {
        // Network error
        
        throw new Error('Unable to connect to payment service. Please check your internet connection.');
        
      } else if (error.message.includes('Order ID is required')) {
        // Validation error
        throw error;
        
      } else {
        // Other errors - check if it contains EasyBuzz error codes
        if (error.message.includes('GC0E01') || error.message.includes('Please retry your transaction')) {
          throw new Error('EasyBuzz payment gateway is experiencing issues. Please check your EasyBuzz configuration or try again later.');
        }
        
        throw new Error(error.message || 'Failed to initiate payment');
      }
    }
  }

  /**
   * Verify payment status
   * @param {string} paymentId - Payment ID
   * @returns {Promise<Object>} Payment verification data
   */
  async verifyPayment(paymentId) {
    try {
      
      if (!paymentId) {
        throw new Error('Payment ID is required for verification');
      }
      
      const response = await apiService.post(`/payments/${paymentId}/verify`);
     
      return {
        success: true,
        data: response.data || response
      };
    } catch (error) {
      
      throw new Error(error.message || 'Failed to verify payment');
    }
  }

  /**
   * Get payment status
   * @param {string} paymentId - Payment ID
   * @returns {Promise<Object>} Payment status data
   */
  async getPaymentStatus(paymentId) {
    try {
      
      if (!paymentId) {
        throw new Error('Payment ID is required to get status');
      }
      
      const response = await apiService.get(`/payments/${paymentId}/status`);
      return {
        success: true,
        data: response.data || response
      };
    } catch (error) {

      throw new Error(error.message || 'Failed to get payment status');
    }
  }

  /**
   * Create EasyBuzz payment order
   * @param {Object} orderData - Order data for EasyBuzz
   * @returns {Promise<Object>} EasyBuzz order data
   */
  async createEasyBuzzOrder(orderData) {
    try {
      
      if (!orderData.orderId) {
        throw new Error('Order ID is required for EasyBuzz payment');
      }
      
      const data = {
        order_id: orderData.orderId,
        return_url: orderData.returnUrl || `${window.location.origin}/checkout/success`,
        cancel_url: orderData.cancelUrl || `${window.location.origin}/checkout/failure`
      };

      const response = await apiService.post('/payments/easybuzz/create-order', data);
      
      return response.data;
    } catch (error) {
      
      throw new Error(error.message || 'Failed to create EasyBuzz payment order');
    }
  }

  /**
   * Verify EasyBuzz payment
   * @param {Object} verificationData - EasyBuzz verification data
   * @returns {Promise<Object>} Verification result
   */
  async verifyEasyBuzzPayment(verificationData) {
    try {
      
      const response = await apiService.post('/payments/easybuzz/verify', verificationData);
      
      return response.data;
    } catch (error) {
      
      throw new Error(error.message || 'Failed to verify EasyBuzz payment');
    }
  }

  /**
   * Get EasyBuzz payment status
   * @param {string} transactionId - EasyBuzz transaction ID
   * @returns {Promise<Object>} Payment status from EasyBuzz
   */
  async getEasyBuzzPaymentStatus(transactionId) {
    try {
     
      if (!transactionId) {
        throw new Error('Transaction ID is required to get EasyBuzz payment status');
      }
      
      const response = await apiService.get(`/payments/easybuzz/status/${transactionId}`);
      
      return response.data;
    } catch (error) {
      
      throw new Error(error.message || 'Failed to get EasyBuzz payment status');
    }
  }

  /**
   * Request payment refund
   * @param {Object} refundData - Refund information
   * @returns {Promise<Object>} Refund request data
   */
  async requestRefund(refundData) {
    try {
      
      if (!refundData.paymentId) {
        throw new Error('Payment ID is required for refund request');
      }
      
      const data = {
        payment_id: refundData.paymentId,
        refund_amount: refundData.amount,
        reason: refundData.reason
      };

      const response = await apiService.post('/payments/refund', data);
      
      return response.data;
    } catch (error) {
      
      throw new Error(error.message || 'Failed to request refund');
    }
  }

  /**
   * Get refund status
   * @param {string} refundId - Refund ID
   * @returns {Promise<Object>} Refund status data
   */
  async getRefundStatus(refundId) {
    try {
      
      if (!refundId) {
        throw new Error('Refund ID is required to get status');
      }
      
      const response = await apiService.get(`/payments/refunds/${refundId}/status`);
     
      return response.data;
    } catch (error) {
     
      throw new Error(error.message || 'Failed to get refund status');
    }
  }

  /**
   * Handle payment success callback
   * @param {Object} callbackData - Payment success callback data
   * @returns {Promise<Object>} Success handling result
   */
  async handlePaymentSuccess(callbackData) {
    try {
         
      const response = await apiService.post('/payments/success', callbackData);
      
      return {
        success: true,
        data: response.data || response
      };
    } catch (error) {
      
      throw new Error(error.message || 'Failed to handle payment success');
    }
  }

  /**
   * Handle payment failure callback
   * @param {Object} callbackData - Payment failure callback data
   * @returns {Promise<Object>} Failure handling result
   */
  async handlePaymentFailure(callbackData) {
    try {
      
      const response = await apiService.post('/payments/failure', callbackData);
      
      return {
        success: true,
        data: response.data || response
      };
    } catch (error) {
      
      throw new Error(error.message || 'Failed to handle payment failure');
    }
  }
}

// Export singleton instance
export const paymentService = new PaymentService();
export default paymentService;