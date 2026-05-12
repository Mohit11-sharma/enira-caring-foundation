import { useState, useEffect, useCallback } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from '../contexts/AuthContext';

export const useCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [cartSummary, setCartSummary] = useState({
    total_items: 0,
    total_amount: 0,
    subtotal: 0,
    tax: 0,
    shipping: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  // Fetch cart data
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      setCartSummary({
        total_items: 0,
        total_amount: 0,
        subtotal: 0,
        tax: 0,
        shipping: 0
      });
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await cartService.getCart();

      if (response) {
        setCartItems(response.cart?.items || []);
        // Get cart totals
        const totalData = await cartService.getCartTotal();
        setCartSummary({
          total_items: totalData.items_count || 0,
          total_amount: totalData.total_amount || 0,
          subtotal: totalData.total_amount || 0,
          tax: 0,
          shipping: 0
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Add item to cart
  const addToCart = useCallback(async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      setError('Please login to add items to cart');
      return { success: false, message: 'Please login to add items to cart' };
    }

    try {
      setLoading(true);
      setError(null);

      
      const response = await cartService.addItem(productId, quantity);

      if (response) {
        // Refresh cart after adding
        await fetchCart();
        return { success: true, message: 'Item added to cart successfully' };
      } else {
        throw new Error('Failed to add item to cart');
      }
    } catch (err) {

      const errorMessage = err.message || 'Failed to add item to cart';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, fetchCart]);

  // Update cart item quantity
  const updateCartItem = useCallback(async (cartItemId, quantity) => {
    try {
      setLoading(true);
      setError(null);
      

      
      const response = await cartService.updateItem(cartItemId, quantity);

      if (response) {
        // Refresh cart after updating
        await fetchCart();
        return { success: true, message: 'Cart updated successfully' };
      } else {
        throw new Error('Failed to update cart item');
      }
    } catch (err) {

      const errorMessage = err.message || 'Failed to update cart item';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [fetchCart]);

  // Remove item from cart
  const removeFromCart = useCallback(async (cartItemId) => {
    try {
      setLoading(true);
      setError(null);
      

      
      const response = await cartService.removeItem(cartItemId);

      if (response) {
        // Refresh cart after removing
        await fetchCart();
        return { success: true, message: 'Item removed from cart successfully' };
      } else {
        throw new Error('Failed to remove item from cart');
      }
    } catch (err) {

      const errorMessage = err.message || 'Failed to remove item from cart';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [fetchCart]);

  // Clear entire cart
  const clearCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
 
      
      const response = await cartService.clearCart();

      if (response) {
        // Refresh cart after clearing
        await fetchCart();
        return { success: true, message: 'Cart cleared successfully' };
      } else {
        throw new Error('Failed to clear cart');
      }
    } catch (err) {

      const errorMessage = err.message || 'Failed to clear cart';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [fetchCart]);

  // Initial fetch
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return {
    cartItems,
    cartSummary,
    loading,
    error,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refetch: fetchCart
  };
};

export default useCart;