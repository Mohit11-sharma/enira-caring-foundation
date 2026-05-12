import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiShield,
  FiTruck,
  FiCreditCard,
  FiCheck,
  FiX,
  FiTag,
  FiLoader,
  FiMapPin,
  FiUser,
  FiMail,
  FiPhone,
  FiDollarSign,
  FiAlertCircle
} from 'react-icons/fi';
import { useCartContext } from '../contexts/CartContext';
import { useCheckout } from '../hooks/useCheckout';
import { apiService } from '../services/api';

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

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, cartCount, clearCart } = useCartContext();
  const {
    formData,
    couponData,
    orderSummary,
    loading,
    errors,
    step,
    setStep,
    updateFormData,
    validateCoupon,
    removeCoupon,
    createOrder,
    validateForm
  } = useCheckout();

  const [couponCode, setCouponCode] = useState('');
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState('');

  // Load Razorpay script
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
          setPaymentError('Payment gateway failed to load. Please refresh the page.');
          setRazorpayLoaded(false);
          resolve(false);
        };
        document.body.appendChild(script);
      });
    };

    loadRazorpayScript();
  }, []);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartCount === 0) {
      navigate('/cart');
    }
  }, [cartCount, navigate]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      alert('Please enter a coupon code');
      return;
    }

    console.log('🔍 Applying coupon:', couponCode);
    await validateCoupon(couponCode.trim());
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponCode('');
  };

  useEffect(() => {
    if (couponData.isValid) {
      console.log('✅ Coupon applied successfully');
    }
  }, [couponData.isValid]);

  const handleNextStep = () => {
    if (step === 1 && validateForm()) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  // Razorpay payment initialization
  const initializeRazorpayPayment = async (orderData, orderId) => {
    // Check if Razorpay is loaded
    if (!window.Razorpay) {
      setPaymentError('Payment gateway not loaded. Please refresh the page and try again.');
      setProcessingPayment(false);
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
          setProcessingPayment(true);
          
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
            setPaymentSuccess('Payment successful! Redirecting...');
            await clearCart();
            setTimeout(() => {
              navigate(`/checkout/success?orderId=${orderId}`);
            }, 1000);
          } else {
            console.error('❌ Payment verification failed');
            setPaymentError('Payment verification failed. Please contact support.');
          }
        } catch (error) {
          console.error('❌ Payment verification error:', error);
          setPaymentError('Payment verification failed. Please contact support.');
        } finally {
          setProcessingPayment(false);
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
          setProcessingPayment(false);
          setPaymentError('Payment was cancelled. You can try again.');
        }
      }
    };

    console.log('🎯 Opening Razorpay modal...');
    const rzp = new window.Razorpay(options);
    
    rzp.on('payment.failed', function (response) {
      console.error('❌ Payment failed:', response.error);
      setProcessingPayment(false);
      setPaymentError(`Payment failed: ${response.error.description || 'Please try again'}`);
    });

    rzp.open();
  };

  const handlePlaceOrder = async () => {
    setPaymentError('');
    setPaymentSuccess('');

    try {
      // Prepare order data
      const orderData = {
        cart_items: cartItems.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          unit_price: item.product.price,
        })),
        shipping_name: `${formData.firstName} ${formData.lastName}`,
        shipping_email: formData.email,
        shipping_phone: formData.phone,
        shipping_address: formData.address,
        shipping_city: formData.city,
        shipping_state: formData.state,
        shipping_postal_code: formData.zipCode,
        shipping_country: formData.country,
        billing_name: `${formData.firstName} ${formData.lastName}`,
        billing_email: formData.email,
        billing_phone: formData.phone,
        billing_address: formData.billingAddress || formData.address,
        billing_city: formData.billingCity || formData.city,
        billing_state: formData.billingState || formData.state,
        billing_postal_code: formData.billingZipCode || formData.zipCode,
        billing_country: formData.country,
        notes: formData.notes,
        payment_method: formData.paymentMethod,
        coupon_code: couponData.isValid ? couponData.code : null,
        billing_same_as_shipping: true,
        currency: 'INR'
      };

      if (formData.paymentMethod === 'cod') {
        // COD: create order immediately
        console.log('💵 Processing COD order...');
        setProcessingPayment(true);
        
        const token = localStorage.getItem('token');
        const orderResponse = await fetch(`${API_BASE_URL}/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          body: JSON.stringify(orderData)
        });

        const orderResult = await orderResponse.json();

        if (!orderResult.success) {
          throw new Error(orderResult.message || 'Failed to create order');
        }

        console.log('✅ COD order created successfully');
        setPaymentSuccess('Order placed successfully!');
        await clearCart();
        setTimeout(() => {
          navigate(`/checkout/success?orderId=${orderResult.data.id}`);
        }, 1000);
      } else if (formData.paymentMethod === 'razorpay') {
        // Razorpay: Check if loaded
        if (!window.Razorpay) {
          setPaymentError('Payment gateway not loaded. Please refresh the page and try again.');
          return;
        }

        console.log('💳 Processing Razorpay payment...');
        setProcessingPayment(true);

        // Create order with pending payment status to prevent email trigger
        const token = localStorage.getItem('token');
        const orderResponse = await fetch(`${API_BASE_URL}/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          body: JSON.stringify({
            ...orderData,
            payment_status: 'pending' // Explicitly set pending status
          })
        });

        const orderResult = await orderResponse.json();

        if (!orderResult.success) {
          throw new Error(orderResult.message || 'Failed to create order');
        }

        const orderId = orderResult.data.id;
        console.log('✅ Order created with ID (pending payment):', orderId);
        console.log('✅ Order created with ID:', orderId);

        // Check if order has razorpay details
        if (!orderResult.data.razorpay_order_id) {
          // Try to initiate payment
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
            console.error('Payment initiation failed, using order data:', paymentErr);
            
            // Fallback: Use order data
            const paymentDetails = {
              razorpay_order_id: orderResult.data.payment_id || orderResult.data.order_number,
              amount: orderResult.data.total_amount * 100,
              currency: orderResult.data.currency || 'INR',
              order_number: orderResult.data.order_number,
              customer: {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                contact: formData.phone
              }
            };
            
            console.log('✅ Using order data for payment');
            await initializeRazorpayPayment(paymentDetails, orderId);
          }
        } else {
          // Order has razorpay details
          const paymentDetails = {
            razorpay_order_id: orderResult.data.razorpay_order_id,
            amount: orderResult.data.total_amount * 100,
            currency: orderResult.data.currency || 'INR',
            order_number: orderResult.data.order_number,
            customer: {
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              contact: formData.phone
            }
          };
          
          console.log('✅ Order contains payment details');
          await initializeRazorpayPayment(paymentDetails, orderId);
        }
      } else if (formData.paymentMethod === 'easybuzz') {
        // EasyBuzz payment
        console.log('💳 Processing EasyBuzz payment...');
        setProcessingPayment(true);

        const paymentResponse = await apiService.post('/payments/initiate', {
          ...orderData,
          return_url: window.location.origin + '/checkout/success',
          cancel_url: window.location.origin + '/checkout/failure',
          failure_url: window.location.origin + '/checkout/failure'
        });

        if (paymentResponse.success && paymentResponse.payment_url) {
          console.log('✅ Redirecting to EasyBuzz...');
          window.location.href = paymentResponse.payment_url;
        } else {
          throw new Error(paymentResponse.message || 'Payment initiation failed');
        }
      }
    } catch (error) {
      console.error('❌ Checkout error:', error);
      setPaymentError(error.message || 'Failed to process payment. Please try again.');
      setProcessingPayment(false);
    }
  };

  if (cartCount === 0) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/cart"
              className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
            >
              <FiArrowLeft size={16} />
              Back to Cart
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${step >= stepNumber
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-600'
                  }`}>
                  {step > stepNumber ? <FiCheck size={14} /> : stepNumber}
                </div>
                <span className={`text-sm font-medium ${step >= stepNumber ? 'text-green-600' : 'text-gray-500'
                  }`}>
                  {stepNumber === 1 ? 'Shipping' : stepNumber === 2 ? 'Payment' : 'Review'}
                </span>
                {stepNumber < 3 && (
                  <div className={`w-8 h-px ${step > stepNumber ? 'bg-green-600' : 'bg-gray-300'
                    }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Razorpay Status */}
        {!razorpayLoaded && formData.paymentMethod === 'razorpay' && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg flex items-center gap-2">
            <FiAlertCircle className="flex-shrink-0" />
            <span>Payment gateway is loading... Please wait.</span>
          </div>
        )}

        {/* Success Message */}
        {paymentSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
            <FiCheck className="flex-shrink-0" />
            <span>{paymentSuccess}</span>
          </div>
        )}

        {/* Error Message */}
        {paymentError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
            <FiAlertCircle className="flex-shrink-0" />
            <span>{paymentError}</span>
            <button 
              onClick={() => setPaymentError('')}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              <FiX size={18} />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping Information */}
            {step === 1 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <FiUser className="text-green-600" />
                  Shipping Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => updateFormData('firstName', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.firstName ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Enter first name"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => updateFormData('lastName', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.lastName ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Enter last name"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiMail className="inline mr-1" size={14} />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Enter email address"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiPhone className="inline mr-1" size={14} />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Enter phone number"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiMapPin className="inline mr-1" size={14} />
                      Address *
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => updateFormData('address', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.address ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Enter full address"
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => updateFormData('city', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Enter city"
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => updateFormData('state', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.state ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Enter state"
                    />
                    {errors.state && (
                      <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      value={formData.zipCode}
                      onChange={(e) => updateFormData('zipCode', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.zipCode ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Enter ZIP code"
                    />
                    {errors.zipCode && (
                      <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <select
                      value={formData.country}
                      onChange={(e) => updateFormData('country', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="India">India</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleNextStep}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Payment Method */}
            {step === 2 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <FiCreditCard className="text-green-600" />
                  Payment Method
                </h2>

                <div className="space-y-4">
                  {/* Razorpay Payment */}
                  <div className={`border rounded-lg p-4 cursor-pointer transition-colors ${formData.paymentMethod === 'razorpay'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-green-300'
                    }`}>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="razorpay"
                        checked={formData.paymentMethod === 'razorpay'}
                        onChange={(e) => updateFormData('paymentMethod', e.target.value)}
                        className="text-green-600 focus:ring-green-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <FiCreditCard className="text-green-600" />
                          <span className="font-medium">Razorpay Payment Gateway</span>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Secure</span>
                          {!razorpayLoaded && formData.paymentMethod === 'razorpay' && (
                            <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">Loading...</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Secure payment with Credit Card, Debit Card, Net Banking, UPI, and Wallets
                        </p>
                        <div className="flex gap-2 mt-2">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Visa</span>
                          <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Mastercard</span>
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">UPI</span>
                          <span className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded">Net Banking</span>
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* EasyBuzz Payment */}
                  {/* <div className={`border rounded-lg p-4 cursor-pointer transition-colors ${formData.paymentMethod === 'easybuzz'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-green-300'
                    }`}>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="easybuzz"
                        checked={formData.paymentMethod === 'easybuzz'}
                        onChange={(e) => updateFormData('paymentMethod', e.target.value)}
                        className="text-green-600 focus:ring-green-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <FiCreditCard className="text-blue-600" />
                          <span className="font-medium">EasyBuzz Payment Gateway</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Alternative payment gateway with multiple payment options
                        </p>
                      </div>
                    </label>
                  </div> */}

                  {/* Cash on Delivery */}
                  <div className={`border rounded-lg p-4 cursor-pointer transition-colors ${formData.paymentMethod === 'cod'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-green-300'
                    }`}>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={(e) => updateFormData('paymentMethod', e.target.value)}
                        className="text-green-600 focus:ring-green-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <FiDollarSign className="text-orange-600" />
                          <span className="font-medium">Cash on Delivery (COD)</span>
                          <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">₹25 fee</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Pay when your order is delivered to your doorstep
                        </p>
                        <p className="text-xs text-orange-600 mt-1">
                          Additional ₹25 handling fee applies for COD orders
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => updateFormData('notes', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Any special instructions for your order..."
                  />
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Back to Shipping
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review Order */}
            {step === 3 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <FiCheck className="text-green-600" />
                  Review Your Order
                </h2>

                {/* Order Items */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-4">Order Items</h3>
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                        <img
                          src={(item.product.images && item.product.images.length > 0) ? item.product.images[0] : (item.product.image || 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg')}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            ₹{(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Information Summary */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Shipping Information</h3>
                  <div className="text-sm text-gray-600">
                    <p>{formData.firstName} {formData.lastName}</p>
                    <p>{formData.email}</p>
                    <p>{formData.phone}</p>
                    <p>{formData.address}</p>
                    <p>{formData.city}, {formData.state} {formData.zipCode}</p>
                    <p>{formData.country}</p>
                  </div>
                </div>

                {/* Payment Method Summary */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Payment Method</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    {formData.paymentMethod === 'razorpay' ? (
                      <>
                        <FiCreditCard className="text-green-600" />
                        <span>Razorpay Payment Gateway</span>
                      </>
                    ) : formData.paymentMethod === 'easybuzz' ? (
                      <>
                        <FiCreditCard className="text-blue-600" />
                        <span>EasyBuzz Payment Gateway</span>
                      </>
                    ) : (
                      <>
                        <FiDollarSign className="text-orange-600" />
                        <span>Cash on Delivery (₹25 fee)</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Back to Payment
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={processingPayment || (formData.paymentMethod === 'razorpay' && !razorpayLoaded)}
                    className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {processingPayment && <FiLoader className="animate-spin" size={16} />}
                    {processingPayment ? 'Processing...' :
                      formData.paymentMethod === 'cod' ? 'Place Order' : 'Proceed to Payment'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

              {/* Cart Items Summary */}
              <div className="space-y-3 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={(item.product.images && item.product.images.length > 0) ? item.product.images[0] : (item.product.image || 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg')}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-sm">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Coupon Section */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <FiTag className="text-green-600" />
                  Coupon Code
                </h3>

                {couponData.isValid ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-green-800">{couponData.code}</p>
                      <p className="text-sm text-green-600">{couponData.message}</p>
                      <p className="text-xs text-green-500 mt-1">
                        Discount: ₹{couponData.discount.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-red-500 hover:text-red-700 ml-2"
                      title="Remove Coupon"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Enter coupon code"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleApplyCoupon();
                          }
                        }}
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={loading.coupon || !couponCode.trim()}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-1"
                      >
                        {loading.coupon ? (
                          <FiLoader className="animate-spin" size={14} />
                        ) : (
                          'Apply'
                        )}
                      </button>
                    </div>

                    {couponData.message && !couponData.isValid && (
                      <div className="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                        {couponData.message}
                      </div>
                    )}

                    <p className="text-xs text-gray-500">
                      Enter a valid coupon code to get discount on your order
                    </p>
                  </div>
                )}
              </div>

              {/* Order Totals */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold">₹{orderSummary.subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span className={`font-semibold ${orderSummary.shipping === 0 ? 'text-green-600' : ''}`}>
                    {orderSummary.shipping === 0 ? 'Free' : `₹${orderSummary.shipping.toFixed(2)}`}
                  </span>
                </div>

                {/* COD Fee */}
                {formData.paymentMethod === 'cod' && (
                  <div className="flex justify-between">
                    <span>COD Fee:</span>
                    <span className="font-semibold">₹25.00</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>GST (18%):</span>
                  <span className="font-semibold">₹{orderSummary.tax.toFixed(2)}</span>
                </div>

                {couponData.isValid && orderSummary.couponDiscount > 0 && (
                  <div className="flex justify-between text-green-600 bg-green-50 px-2 py-1 rounded">
                    <span className="font-medium">Coupon Discount ({couponData.code}):</span>
                    <span className="font-bold">-₹{orderSummary.couponDiscount.toFixed(2)}</span>
                  </div>
                )}

                <hr className="border-gray-200" />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-green-600">
                    ₹{(orderSummary.total + (formData.paymentMethod === 'cod' ? 25 : 0)).toFixed(2)}
                  </span>
                </div>

                {/* Show savings if coupon applied */}
                {couponData.isValid && orderSummary.couponDiscount > 0 && (
                  <div className="text-center p-2 bg-green-100 border border-green-300 rounded-lg">
                    <p className="text-sm text-green-700 font-medium">
                      🎉 You saved ₹{orderSummary.couponDiscount.toFixed(2)} with coupon "{couponData.code}"!
                    </p>
                  </div>
                )}
              </div>

              {/* Security Features */}
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <FiShield className="text-green-500" size={14} />
                  <span>Secure checkout with SSL encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiTruck className="text-blue-500" size={14} />
                  <span>Free shipping on orders above ₹500</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCheck className="text-purple-500" size={14} />
                  <span>30-day return policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}