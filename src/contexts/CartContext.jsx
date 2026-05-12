import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Fetch cart data
  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      setCartCount(0);
      setCartTotal(0);
      return;
    }

    try {
      setLoading(true);
      const response = await cartService.getCart();
      
      if (response) {
        const items = response.cart?.items || [];
        setCartItems(items);
        setCartCount(items.reduce((total, item) => total + item.quantity, 0));
        
        // Calculate total
        const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        setCartTotal(total);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      return { success: false, message: 'Please login to add items to cart' };
    }

    try {
      setLoading(true);
      const response = await cartService.addItem(productId, quantity);
      
      if (response) {
        await fetchCart();
        setIsCartOpen(true); // Show cart drawer after adding
        return { success: true, message: 'Item added to cart successfully' };
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { success: false, message: error.message || 'Failed to add item to cart' };
    } finally {
      setLoading(false);
    }
  };

  // Update cart item quantity
  const updateCartItem = async (cartItemId, quantity) => {
    try {
      setLoading(true);
      const response = await cartService.updateItem(cartItemId, quantity);
      
      if (response) {
        await fetchCart();
        return { success: true };
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (cartItemId) => {
    try {
      setLoading(true);
      const response = await cartService.removeItem(cartItemId);
      
      if (response) {
        await fetchCart();
        return { success: true };
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      setLoading(true);
      const response = await cartService.clearCart();
      
      if (response) {
        setCartItems([]);
        setCartCount(0);
        setCartTotal(0);
        return { success: true };
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Toggle cart drawer
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  // Fetch cart on mount and auth change
  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  const value = {
    cartItems,
    cartCount,
    cartTotal,
    isCartOpen,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    toggleCart,
    closeCart,
    fetchCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};