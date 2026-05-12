import { apiService } from './api.js';

class CartService {
  constructor() {
  }

  /**
   * Get user's cart with all items
   * @returns {Promise<Object>} Cart data with items
   */
  async getCart() {
    try {

      const response = await apiService.get('/cart');
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to retrieve cart');
    }
  }

  /**
   * Add item to cart
   * @param {number} productId - Product ID to add
   * @param {number} quantity - Quantity to add (default: 1)
   * @returns {Promise<Object>} Updated cart item data
   */
  async addItem(productId, quantity = 1) {
    try {
     
      const data = {
        product_id: productId,
        quantity: quantity
      };

      const response = await apiService.post('/cart/add', data);
      
      return response.data;
    } catch (error) {
   
      
      // Handle specific error cases
      if (error.status === 400 && error.message.includes('stock')) {
        throw new Error('Insufficient stock available');
      }
      
      if (error.status === 422) {
        throw new Error('Invalid product or quantity');
      }
      
      throw new Error(error.message || 'Failed to add item to cart');
    }
  }

  /**
   * Update cart item quantity
   * @param {number} cartItemId - Cart item ID to update
   * @param {number} quantity - New quantity (0 to remove)
   * @returns {Promise<Object>} Updated cart data
   */
  async updateItem(cartItemId, quantity) {
    try {
     
      const data = {
        quantity: quantity
      };

      const response = await apiService.put(`/cart/update/${cartItemId}`, data);
     
      return response.data;
    } catch (error) {
      
      
      if (error.status === 403) {
        throw new Error('Unauthorized access to cart item');
      }
      
      if (error.status === 400 && error.message.includes('stock')) {
        throw new Error('Insufficient stock available');
      }
      
      throw new Error(error.message || 'Failed to update cart item');
    }
  }

  /**
   * Remove item from cart
   * @param {number} cartItemId - Cart item ID to remove
   * @returns {Promise<Object>} Updated cart data
   */
  async removeItem(cartItemId) {
    try {
     
      const response = await apiService.delete(`/cart/remove/${cartItemId}`);
      
      return response.data;
    } catch (error) {
     
      if (error.status === 403) {
        throw new Error('Unauthorized access to cart item');
      }
      
      throw new Error(error.message || 'Failed to remove cart item');
    }
  }

  /**
   * Clear entire cart
   * @returns {Promise<Object>} Success response
   */
  async clearCart() {
    try {
     
      const response = await apiService.delete('/cart/clear');
      
    } catch (error) {
     
      throw new Error(error.message || 'Failed to clear cart');
    }
  }

  /**
   * Get cart item count
   * @returns {Promise<number>} Number of items in cart
   */
  async getItemCount() {
    try {
     
      const response = await apiService.get('/cart/count');
      
      return response.data.items_count;
    } catch (error) {
     
      throw new Error(error.message || 'Failed to get cart item count');
    }
  }

  /**
   * Get cart total amount and item count
   * @returns {Promise<Object>} Cart total data
   */
  async getCartTotal() {
    try {
      
      const response = await apiService.get('/cart/total');
     
      return response.data;
    } catch (error) {
   
      throw new Error(error.message || 'Failed to get cart total');
    }
  }

  /**
   * Quick add to cart with error handling
   * @param {Object} product - Product object
   * @param {number} quantity - Quantity to add
   * @returns {Promise<Object>} Result with success status and data
   */
  async quickAddToCart(product, quantity = 1) {
    try {
     
      // Validate stock before adding
      if (product.stock_quantity !== undefined && product.stock_quantity < quantity) {
        throw new Error(`Only ${product.stock_quantity} items available in stock`);
      }

      const result = await this.addItem(product.id, quantity);
      
      return {
        success: true,
        message: `${product.name} added to cart successfully`,
        data: result
      };
    } catch (error) {
     
      return {
        success: false,
        message: error.message || 'Failed to add item to cart',
        error: error
      };
    }
  }

  /**
   * Update multiple cart items at once
   * @param {Array} updates - Array of {cartItemId, quantity} objects
   * @returns {Promise<Array>} Array of update results
   */
  async updateMultipleItems(updates) {
    try {
     
      const promises = updates.map(update => 
        this.updateItem(update.cartItemId, update.quantity)
      );
      
      const results = await Promise.allSettled(promises);
      
      const successfulUpdates = results.filter(result => result.status === 'fulfilled');
      const failedUpdates = results.filter(result => result.status === 'rejected');
      
      
      
      return {
        successful: successfulUpdates.map(result => result.value),
        failed: failedUpdates.map(result => result.reason.message)
      };
    } catch (error) {
      
      throw new Error(error.message || 'Failed to update cart items');
    }
  }

  /**
   * Get cart summary with totals and counts
   * @returns {Promise<Object>} Complete cart summary
   */
  async getCartSummary() {
    try {
     
      const [cart, total] = await Promise.all([
        this.getCart(),
        this.getCartTotal()
      ]);
      
      const summary = {
        items: cart.cart?.items || [],
        itemCount: total.items_count || 0,
        subtotal: total.total_amount || 0,
        currency: 'INR',
        isEmpty: (total.items_count || 0) === 0
      };
      
      
      return summary;
    } catch (error) {
     
      throw new Error(error.message || 'Failed to get cart summary');
    }
  }

  /**
   * Check if product is already in cart
   * @param {number} productId - Product ID to check
   * @returns {Promise<Object>} Cart item if exists, null otherwise
   */
  async findProductInCart(productId) {
    try {
     
      const cart = await this.getCart();
      const cartItem = cart.cart?.items?.find(item => item.product_id === productId);
      
      
      return cartItem || null;
    } catch (error) {
     
      return null;
    }
  }

  /**
   * Get cart validation (check stock availability)
   * @returns {Promise<Object>} Validation result
   */
  async validateCart() {
    try {
     
      const cart = await this.getCart();
      const items = cart.cart?.items || [];
      
      const validationResults = items.map(item => {
        const isValid = item.product && item.product.stock_quantity >= item.quantity;
        return {
          cartItemId: item.id,
          productId: item.product_id,
          productName: item.product?.name,
          requestedQuantity: item.quantity,
          availableStock: item.product?.stock_quantity,
          isValid,
          message: isValid ? 'Valid' : `Only ${item.product?.stock_quantity || 0} items available`
        };
      });
      
      const hasInvalidItems = validationResults.some(result => !result.isValid);
      
      const validation = {
        isValid: !hasInvalidItems,
        items: validationResults,
        invalidItems: validationResults.filter(result => !result.isValid),
        validItems: validationResults.filter(result => result.isValid)
      };
      
      
      return validation;
    } catch (error) {
      
      throw new Error(error.message || 'Failed to validate cart');
    }
  }

  /**
   * Calculate cart totals with tax and shipping
   * @param {Object} options - Calculation options
   * @returns {Promise<Object>} Detailed cart totals
   */
  async calculateCartTotals(options = {}) {
    try {
     
      const cart = await this.getCart();
      const items = cart.cart?.items || [];
      
      const subtotal = items.reduce((total, item) => {
        return total + (item.quantity * item.price);
      }, 0);
      
      const taxRate = options.taxRate || 0.1; // 10% default tax
      const taxAmount = subtotal * taxRate;
      
      const shippingThreshold = options.freeShippingThreshold || 50;
      const shippingCost = options.shippingCost || 10;
      const shippingAmount = subtotal >= shippingThreshold ? 0 : shippingCost;
      
      const discountAmount = options.discountAmount || 0;
      const total = subtotal + taxAmount + shippingAmount - discountAmount;
      
      const totals = {
        subtotal,
        taxAmount,
        shippingAmount,
        discountAmount,
        total,
        itemCount: items.length,
        totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
        currency: 'INR',
        breakdown: {
          subtotal: `₹${subtotal.toFixed(2)}`,
          tax: `₹${taxAmount.toFixed(2)}`,
          shipping: shippingAmount > 0 ? `₹${shippingAmount.toFixed(2)}` : 'Free',
          discount: discountAmount > 0 ? `-₹${discountAmount.toFixed(2)}` : '₹0.00',
          total: `₹${total.toFixed(2)}`
        }
      };
      
      
      return totals;
    } catch (error) {
      
      throw new Error(error.message || 'Failed to calculate cart totals');
    }
  }
}

// Export singleton instance
export const cartService = new CartService();