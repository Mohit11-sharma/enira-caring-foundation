import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiMinus, FiTrash2, FiShoppingBag, FiArrowLeft, FiCreditCard, FiTruck, FiPercent, FiX, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { useCartContext } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

// Environment configuration
const API_BASE_URL = (() => {
  try {
    return import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
  } catch (error) {
    return 'http://localhost:8000/api';
  }
})();

const RAZORPAY_KEY = (() => {
  try {
    return import.meta.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_live_RFZwtzlGSrGl9W';
  } catch (error) {
    return 'rzp_live_RFZwtzlGSrGl9W';
  }
})();

export default function CartPageWithPayment() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    cartItems, 
    cartTotal, 
    updateCartItem, 
    removeFromCart, 
    clearCart,
    loading: cartLoading 
  } = useCartContext();

  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');

  const [checkoutData, setCheckoutData] = useState({
    shipping_name: '',
    shipping_email: '',
    shipping_phone: '',
    shipping_address: '',
    shipping_city: '',
    shipping_state: '',
    shipping_postal_code: '',
    shipping_country: 'India',
    payment_method: 'razorpay',
    notes: ''
  });

  // Load Razorpay script - FIXED VERSION
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        // Check if already loaded
        if (window.Razorpay) {
          console.log('✅ Razorpay already loaded');
          setRazorpayLoaded(true);
          resolve(true);
          return;
        }
        
        // Check if script tag already exists
        const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
        if (existingScript) {
          existingScript.onload = () => {
            console.log('✅ Razorpay script loaded (existing)');
            setRazorpayLoaded(true);
            resolve(true);
          };
          return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => {
          console.log('✅ Razorpay script loaded successfully');
          setRazorpayLoaded(true);
          resolve(true);
        };
        script.onerror = () => {
          console.error('❌ Failed to load Razorpay script');
          setError('Payment gateway failed to load. Please refresh the page.');
          setRazorpayLoaded(false);
          resolve(false);
        };
        document.body.appendChild(script);
      });
    };

    loadRazorpayScript();
  }, []);

  useEffect(() => {
    if (user) {
      setCheckoutData(prev => ({
        ...prev,
        shipping_name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
        shipping_email: user.email || '',
        shipping_phone: user.phone || ''
      }));
    }
  }, [user]);

  const calculateOrderSummary = () => {
    const subtotal = cartTotal;
    const shippingFee = subtotal >= 500 ? 0 : 50;
    const taxRate = 0.18;
    const taxAmount = subtotal * taxRate;
    const discountAmount = appliedCoupon?.discount_amount || 0;
    const codFee = checkoutData.payment_method === 'cod' ? 25 : 0;
    const total = subtotal + shippingFee + taxAmount - discountAmount + codFee;

    return {
      subtotal,
      shippingFee,
      taxAmount,
      discountAmount,
      codFee,
      total: Math.max(total, 0)
    };
  };

  const orderSummary = calculateOrderSummary();

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setCouponLoading(true);
    setCouponError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/coupons/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          code: couponCode,
          order_data: {
            order_amount: orderSummary.total,
            subtotal: orderSummary.subtotal,
            shipping_cost: orderSummary.shippingFee,
            tax_amount: orderSummary.taxAmount,
            items: cartItems.map(item => ({
              product_id: item.product.id,
              quantity: item.quantity,
              price: item.product.price,
              total: item.product.price * item.quantity
            })),
            currency: 'INR',
            customer_id: user?.id || null
          }
        })
      });

      const data = await response.json();

      if (data.success) {
        setAppliedCoupon(data.data);
        setSuccess(`Coupon applied! You saved ₹${data.data.discount_amount}`);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setCouponError(data.message || 'Invalid coupon code');
      }
    } catch (err) {
      console.error('Coupon error:', err);
      setCouponError('Failed to apply coupon. Please try again.');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCheckoutData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const required = ['shipping_name', 'shipping_email', 'shipping_phone', 
                     'shipping_address', 'shipping_city', 'shipping_state', 
                     'shipping_postal_code'];
    
    for (let field of required) {
      if (!checkoutData[field].trim()) {
        setError(`Please fill in ${field.replace('shipping_', '').replace('_', ' ')}`);
        return false;
      }
    }

    if (!/\S+@\S+\.\S+/.test(checkoutData.shipping_email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!/^\d{10}$/.test(checkoutData.shipping_phone.replace(/\D/g, ''))) {
      setError('Please enter a valid 10-digit phone number');
      return false;
    }

    return true;
  };

  const initializeRazorpayPayment = async (orderData, orderId) => {
    // Check if Razorpay is loaded
    if (!window.Razorpay) {
      setError('Payment gateway not loaded. Please refresh the page and try again.');
      setLoading(false);
      return;
    }

    console.log('🎯 Initializing Razorpay payment...');

    const options = {
      key: RAZORPAY_KEY,
      amount: orderData.amount,
      currency: orderData.currency || 'INR',
      name: 'Enira Caring Foundation',
      description: `Order #${orderData.order_number}`,
      image: '/media/logo.png',
      order_id: orderData.razorpay_order_id,
      handler: async function (response) {
        console.log('✅ Payment successful, verifying...');
        try {
          setLoading(true);
          
          const token = localStorage.getItem('token');
          const verifyResponse = await fetch(`${API_BASE_URL}/payments/razorpay/verify`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              ...(token && { 'Authorization': `Bearer ${token}` })
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          });

          const verifyData = await verifyResponse.json();

          if (verifyData.success) {
            console.log('✅ Payment verified successfully');
            setSuccess('Payment successful! Redirecting...');
            await clearCart();
            setTimeout(() => {
              navigate(`/checkout/success?orderId=${orderId}`);
            }, 1000);
          } else {
            console.error('❌ Payment verification failed');
            setError('Payment verification failed. Please contact support.');
          }
        } catch (error) {
          console.error('❌ Payment verification error:', error);
          setError('Payment verification failed. Please contact support.');
        } finally {
          setLoading(false);
        }
      },
      prefill: {
        name: orderData.customer.name,
        email: orderData.customer.email,
        contact: orderData.customer.contact
      },
      notes: {
        order_id: orderId
      },
      theme: {
        color: '#16a34a'
      },
      modal: {
        ondismiss: function() {
          console.log('⚠️ Payment modal dismissed by user');
          setLoading(false);
          setError('Payment was cancelled. You can try again.');
        }
      }
    };

    console.log('🎯 Opening Razorpay modal...');
    const rzp = new window.Razorpay(options);
    
    rzp.on('payment.failed', function (response) {
      console.error('❌ Payment failed:', response.error);
      setLoading(false);
      setError(`Payment failed: ${response.error.description || 'Please try again'}`);
    });

    rzp.open();
  };

  const handleCheckout = async () => {
    if (!validateForm()) return;

    // Check Razorpay availability for online payment
    if (checkoutData.payment_method === 'razorpay' && !window.Razorpay) {
      setError('Payment gateway not loaded. Please refresh the page and try again.');
      return;
    }

    setLoading(true);
    setError('');

    console.log('🚀 Starting checkout process...');

    try {
      // Create order
      console.log('📦 Creating order...');
      const token = localStorage.getItem('token');
      const orderResponse = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          ...checkoutData,
          billing_same_as_shipping: true,
          billing_name: checkoutData.shipping_name,
          billing_email: checkoutData.shipping_email,
          billing_phone: checkoutData.shipping_phone,
          billing_address: checkoutData.shipping_address,
          billing_city: checkoutData.shipping_city,
          billing_state: checkoutData.shipping_state,
          billing_postal_code: checkoutData.shipping_postal_code,
          billing_country: checkoutData.shipping_country,
          coupon_code: appliedCoupon?.coupon?.code || null,
          currency: 'INR',
          cart_items: cartItems.map(item => ({
            product_id: item.product.id,
            quantity: item.quantity,
            price: item.product.price
          }))
        })
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create order');
      }

      const orderId = orderData.data.id;
      console.log('✅ Order created with ID:', orderId);

      // If COD, redirect to success page
      if (checkoutData.payment_method === 'cod') {
        console.log('💵 COD payment - Order created successfully');
        setSuccess('Order placed successfully!');
        await clearCart();
        setTimeout(() => {
          navigate(`/checkout/success?orderId=${orderId}`);
        }, 1000);
        return;
      }

      // For Razorpay payment, we need to get payment details from the order
      // The order should already contain razorpay_order_id
      console.log('💳 Preparing Razorpay payment...');
      
      // Check if order data has razorpay details
      if (!orderData.data.razorpay_order_id) {
        // If not, try to initiate payment
        try {
          const paymentResponse = await fetch(`${API_BASE_URL}/payments/initiate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              ...(token && { 'Authorization': `Bearer ${token}` })
            },
            body: JSON.stringify({
              order_id: orderId,
              payment_method: 'razorpay'
            })
          });

          const paymentData = await paymentResponse.json();

          if (paymentData.success && paymentData.data) {
            console.log('✅ Payment initialized, opening Razorpay...');
            await initializeRazorpayPayment(paymentData.data, orderId);
          } else {
            throw new Error(paymentData.message || 'Payment initialization failed');
          }
        } catch (paymentErr) {
          console.error('Payment initiation failed, trying with order data:', paymentErr);
          
          // Fallback: Use order data to construct payment details
          const paymentDetails = {
            razorpay_order_id: orderData.data.payment_id || orderData.data.order_number,
            amount: orderData.data.total_amount * 100, // Convert to paise
            currency: orderData.data.currency || 'INR',
            order_number: orderData.data.order_number,
            customer: {
              name: checkoutData.shipping_name,
              email: checkoutData.shipping_email,
              contact: checkoutData.shipping_phone
            }
          };
          
          console.log('✅ Using order data for payment, opening Razorpay...');
          await initializeRazorpayPayment(paymentDetails, orderId);
        }
      } else {
        // Order already has razorpay details
        const paymentDetails = {
          razorpay_order_id: orderData.data.razorpay_order_id,
          amount: orderData.data.total_amount * 100,
          currency: orderData.data.currency || 'INR',
          order_number: orderData.data.order_number,
          customer: {
            name: checkoutData.shipping_name,
            email: checkoutData.shipping_email,
            contact: checkoutData.shipping_phone
          }
        };
        
        console.log('✅ Order contains payment details, opening Razorpay...');
        await initializeRazorpayPayment(paymentDetails, orderId);
      }

    } catch (err) {
      console.error('❌ Checkout error:', err);
      setError(err.message || 'Failed to process payment. Please try again.');
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 mt-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-12">
            <FiShoppingBag className="mx-auto text-gray-400 mb-6" size={64} />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-500 mb-8">Looks like you haven't added any products to your cart yet.</p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              <FiArrowLeft size={16} />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 mt-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <Link
            to="/shop"
            className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
          >
            <FiArrowLeft size={16} />
            Continue Shopping
          </Link>
        </div>

        {/* Razorpay Status Indicator */}
        {!razorpayLoaded && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg flex items-center gap-2">
            <FiAlertCircle className="flex-shrink-0" />
            <span>Payment gateway is loading... Please wait.</span>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
            <FiCheck className="flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
            <FiAlertCircle className="flex-shrink-0" />
            <span>{error}</span>
            <button 
              onClick={() => setError('')}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              <FiX size={18} />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Cart Items ({cartItems.length})</h2>
                  <button
                    onClick={clearCart}
                    disabled={cartLoading}
                    className="text-red-500 hover:text-red-700 font-medium disabled:opacity-50"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex items-center gap-6">
                      <img
                        src={(item.product.images && item.product.images.length > 0) ? item.product.images[0] : (item.product.image || 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg')}
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {item.product.name}
                        </h3>
                        <p className="text-gray-500 text-sm mb-2">
                          Category: {item.product.category}
                        </p>
                        <p className="text-lg font-bold text-green-600">
                          ₹{item.product.price}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                          <button
                            onClick={() => updateCartItem(item.id, item.quantity - 1)}
                            disabled={cartLoading || item.quantity <= 1}
                            className="p-2 hover:bg-gray-100 disabled:opacity-50"
                          >
                            <FiMinus size={16} />
                          </button>
                          
                          <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          
                          <button
                            onClick={() => updateCartItem(item.id, item.quantity + 1)}
                            disabled={cartLoading}
                            className="p-2 hover:bg-gray-100 disabled:opacity-50"
                          >
                            <FiPlus size={16} />
                          </button>
                        </div>
                        
                        <div className="text-right min-w-[6rem]">
                          <p className="text-lg font-bold text-gray-900">
                            ₹{(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        
                        <button
                          onClick={() => removeFromCart(item.id)}
                          disabled={cartLoading}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg disabled:opacity-50"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <FiPercent className="text-green-600" size={20} />
                <h3 className="text-lg font-semibold">Apply Coupon</h3>
              </div>

              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <FiCheck className="text-green-600" size={20} />
                    <div>
                      <p className="font-semibold text-green-900">{appliedCoupon.coupon.code}</p>
                      <p className="text-sm text-green-700">
                        You saved ₹{appliedCoupon.discount_amount}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiX size={20} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponCode.trim()}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {couponLoading ? 'Applying...' : 'Apply'}
                  </button>
                </div>
              )}

              {couponError && (
                <p className="mt-2 text-sm text-red-500">{couponError}</p>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{orderSummary.subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={orderSummary.shippingFee === 0 ? 'text-green-600 font-semibold' : ''}>
                    {orderSummary.shippingFee === 0 ? 'FREE' : `₹${orderSummary.shippingFee.toFixed(2)}`}
                  </span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Tax (18% GST)</span>
                  <span>₹{orderSummary.taxAmount.toFixed(2)}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{orderSummary.discountAmount.toFixed(2)}</span>
                  </div>
                )}

                {checkoutData.payment_method === 'cod' && orderSummary.codFee > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>COD Fee</span>
                    <span>₹{orderSummary.codFee.toFixed(2)}</span>
                  </div>
                )}
                
                <hr className="border-gray-200 my-4" />
                
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-green-600">₹{orderSummary.total.toFixed(2)}</span>
                </div>
              </div>

              {orderSummary.subtotal < 500 && (
                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    Add ₹{(500 - orderSummary.subtotal).toFixed(2)} more for FREE shipping!
                  </p>
                </div>
              )}
              
              <button
                onClick={() => setShowCheckoutModal(true)}
                disabled={!razorpayLoaded && checkoutData.payment_method === 'razorpay'}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiCreditCard size={20} />
                Proceed to Checkout
              </button>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Free returns within 30 days</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>24/7 customer support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold">Checkout Details</h2>
              <button
                onClick={() => {
                  setShowCheckoutModal(false);
                  setError('');
                }}
                disabled={loading}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FiTruck size={20} className="text-green-600" />
                  Shipping Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="shipping_name"
                      value={checkoutData.shipping_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="shipping_email"
                      value={checkoutData.shipping_email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="shipping_phone"
                      value={checkoutData.shipping_phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address *
                    </label>
                    <input
                      type="text"
                      name="shipping_address"
                      value={checkoutData.shipping_address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="shipping_city"
                      value={checkoutData.shipping_city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      name="shipping_state"
                      value={checkoutData.shipping_state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      name="shipping_postal_code"
                      value={checkoutData.shipping_postal_code}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country *
                    </label>
                    <input
                      type="text"
                      name="shipping_country"
                      value={checkoutData.shipping_country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FiCreditCard size={20} className="text-green-600" />
                  Payment Method
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:border-green-500 transition-colors"
                    style={{ borderColor: checkoutData.payment_method === 'razorpay' ? '#16a34a' : '#d1d5db' }}>
                    <input
                      type="radio"
                      name="payment_method"
                      value="razorpay"
                      checked={checkoutData.payment_method === 'razorpay'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-green-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">Online Payment (Razorpay)</p>
                          <p className="text-sm text-gray-500">Pay securely with Credit/Debit Card, UPI, Net Banking</p>
                        </div>
                        {!razorpayLoaded && checkoutData.payment_method === 'razorpay' && (
                          <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">Loading...</span>
                        )}
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:border-green-500 transition-colors"
                    style={{ borderColor: checkoutData.payment_method === 'cod' ? '#16a34a' : '#d1d5db' }}>
                    <input
                      type="radio"
                      name="payment_method"
                      value="cod"
                      checked={checkoutData.payment_method === 'cod'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-green-600"
                    />
                    <div className="flex-1">
                      <p className="font-semibold">Cash on Delivery</p>
                      <p className="text-sm text-gray-500">Pay when you receive the product (₹25 COD fee)</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={checkoutData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Any special instructions for delivery?"
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold mb-3">Order Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{orderSummary.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>{orderSummary.shippingFee === 0 ? 'FREE' : `₹${orderSummary.shippingFee.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (18%):</span>
                    <span>₹{orderSummary.taxAmount.toFixed(2)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount:</span>
                      <span>-₹{orderSummary.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {checkoutData.payment_method === 'cod' && orderSummary.codFee > 0 && (
                    <div className="flex justify-between">
                      <span>COD Fee:</span>
                      <span>₹{orderSummary.codFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-300">
                    <span>Total:</span>
                    <span className="text-green-600">₹{orderSummary.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCheckoutModal(false);
                    setError('');
                  }}
                  disabled={loading}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={loading || (checkoutData.payment_method === 'razorpay' && !razorpayLoaded)}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FiCreditCard size={20} />
                      {checkoutData.payment_method === 'cod' ? 'Place Order' : 'Proceed to Payment'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}