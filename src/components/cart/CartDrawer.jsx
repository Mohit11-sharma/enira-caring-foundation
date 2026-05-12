import React from 'react';
import { Link } from 'react-router-dom';
import { FiX, FiPlus, FiMinus, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { useCartContext } from '../../contexts/CartContext';

export default function CartDrawer() {
  const { 
    cartItems, 
    cartTotal, 
    isCartOpen, 
    closeCart, 
    updateCartItem, 
    removeFromCart,
    loading 
  } = useCartContext();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={closeCart}
      />
      
      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <FiShoppingBag className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-6">Add some products to get started!</p>
              <button
                onClick={closeCart}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                  <img
                        src={(item.product.images && item.product.images.length > 0) ? item.product.images[0] : (item.product.image || 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg')}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 line-clamp-1">
                      {item.product.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      ₹{item.product.price} each
                    </p>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateCartItem(item.id, item.quantity - 1)}
                        disabled={loading || item.quantity <= 1}
                        className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                      >
                        <FiMinus size={14} />
                      </button>
                      
                      <span className="px-3 py-1 bg-gray-100 rounded text-sm font-medium">
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => updateCartItem(item.id, item.quantity + 1)}
                        disabled={loading}
                        className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      ₹{(item.product.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      disabled={loading}
                      className="text-red-500 hover:text-red-700 mt-2 disabled:opacity-50"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-6 space-y-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total:</span>
              <span className="text-green-600">₹{cartTotal.toFixed(2)}</span>
            </div>
            
            <div className="space-y-3">
              <Link
                to="/cart"
                onClick={closeCart}
                className="w-full bg-gray-100 text-gray-900 py-3 rounded-lg font-semibold text-center block hover:bg-gray-200 transition-colors"
              >
                View Cart
              </Link>
              
              <Link
                to="/checkout"
                onClick={closeCart}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold text-center block hover:bg-green-700 transition-colors"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}