import React from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import { useCartContext } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

export default function FloatingCartButton() {
  const { cartCount, toggleCart } = useCartContext();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Show button on shop page and product pages
  const isShopPage = location.pathname === '/shop' || 
                     location.pathname.includes('/shop') ||
                     location.pathname.includes('/product');
  
  // Don't render if not on relevant pages
  if (!isShopPage) return null;
  
  // Don't show if cart is empty
  if (cartCount === 0) return null;
  
  const handleCartClick = () => {
    if (!user) {
      // If user is not logged in, redirect to login with current location
      navigate('/auth', { state: { from: location.pathname } });
    } else {
      // If user is logged in, toggle cart normally
      toggleCart();
    }
  };
  
  return (
    <button
      onClick={handleCartClick}
      className="fixed bottom-6 right-6 z-50 bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
      title={user ? "View Cart" : "Login to checkout"}
    >
      <div className="relative">
        <FiShoppingCart size={24} />
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
          {cartCount}
        </span>
      </div>
    </button>
  );
}