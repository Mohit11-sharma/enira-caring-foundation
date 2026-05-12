import { useState, useCallback, useEffect } from 'react';
import { couponService } from '../services/couponService';
import { paymentService } from '../services/paymentService';
import { orderService } from '../services/orderService';
import { useCartContext } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

export const useCheckout = () => {
  const [formData, setFormData] = useState({
    // Shipping Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    
    // Billing Information (same as shipping by default)
    billingSameAsShipping: true,
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZipCode: '',
    
    // Payment Information
    paymentMethod: 'easybuzz',
    notes: ''
  });

  const [couponData, setCouponData] = useState({
    code: '',
    discount: 0,
    discountType: '',
    isValid: false,
    message: '',
    appliedCoupon: null
  });

  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    shipping: 0,
    tax: 0,
    couponDiscount: 0,
    total: 0
  });

  const [loading, setLoading] = useState({
    coupon: false,
    order: false,
    payment: false
  });

  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review

  const { cartItems, cartTotal, clearCart } = useCartContext();
  const { user } = useAuth();

  // Calculate order summary
  const calculateOrderSummary = useCallback(() => {
    const subtotal = cartTotal;
    const shipping = subtotal > 500 ? 0 : 50; // Free shipping above ₹500
    const tax = subtotal * 0.18; // 18% GST
    const couponDiscount = couponData.discount || 0;
    const total = subtotal + shipping + tax - couponDiscount;

    setOrderSummary({
      subtotal,
      shipping,
      tax,
      couponDiscount,
      total: Math.max(total, 0)
    });
  }, [cartTotal, couponData.discount]);

  // Update form data
  const updateFormData = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Validate coupon
  const validateCoupon = useCallback(async (code) => {
    if (!code.trim()) {
      setCouponData(prev => ({
        ...prev,
        message: 'Please enter a coupon code',
        isValid: false
      }));
      return;
    }

    setLoading(prev => ({ ...prev, coupon: true }));
    
    try {
      // Calculate current order amount including shipping and tax
      const subtotal = cartTotal;
      const shipping = subtotal > 500 ? 0 : 50;
      const tax = subtotal * 0.18;
      const orderAmount = subtotal + shipping + tax;

      // Prepare order data in the format expected by the API
      const orderData = {
        order_amount: orderAmount,
        subtotal: subtotal,
        shipping_cost: shipping,
        tax_amount: tax,
        items: cartItems.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
          total: item.product.price * item.quantity
        })),
        currency: 'INR',
        customer_id: user?.id || null
      };

  
      const response = await couponService.validateCoupon(code, orderData);



      // Check for success in the response
      if (response && response.success === true) {
        // Extract discount amount from the response
        const discountAmount = response.data?.discount_amount || 0;
        const couponInfo = response.data?.coupon || {};
        
        setCouponData({
          code,
          discount: discountAmount,
          discountType: couponInfo.type || 'fixed',
          isValid: true,
          message: response.message || `Coupon applied! You saved ₹${discountAmount}`,
          appliedCoupon: response.data
        });
        

      } else {
        // Handle failed validation
        setCouponData(prev => ({
          ...prev,
          message: response?.message || 'Invalid coupon code',
          isValid: false,
          discount: 0,
          appliedCoupon: null
        }));
        
       
      }
    } catch (error) {
      
      
      // Handle specific validation errors
      let errorMessage = 'Error validating coupon';
      
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        errorMessage = Object.values(errors).flat().join(', ');
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setCouponData(prev => ({
        ...prev,
        message: errorMessage,
        isValid: false,
        discount: 0,
        appliedCoupon: null
      }));
    } finally {
      setLoading(prev => ({ ...prev, coupon: false }));
    }
  }, [cartTotal, cartItems, user]);

  // Remove coupon
  const removeCoupon = useCallback(() => {
  
    setCouponData({
      code: '',
      discount: 0,
      discountType: '',
      isValid: false,
      message: '',
      appliedCoupon: null
    });
  }, []);

  // Validate form
  const validateForm = useCallback(() => {
    const newErrors = {};

    // Required fields validation
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone', 
      'address', 'city', 'state', 'zipCode'
    ];

    requiredFields.forEach(field => {
      if (!formData[field].trim()) {
        newErrors[field] = 'This field is required';
      }
    });

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Phone validation
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // FIXED: Create order with better response handling
  const createOrder = useCallback(async () => {
    if (!validateForm()) {
      return { success: false, message: 'Please fill all required fields' };
    }

    setLoading(prev => ({ ...prev, order: true }));

    try {
      // Calculate final amounts including COD fee
      const codFee = formData.paymentMethod === 'cod' ? 25 : 0;
      const finalTotal = orderSummary.total + codFee;

      // Prepare order data with the exact field names expected by the API
      const orderData = {
        // Shipping address fields (required by API)
        shipping_name: `${formData.firstName} ${formData.lastName}`,
        shipping_email: formData.email,
        shipping_phone: formData.phone,
        shipping_address: formData.address,
        shipping_city: formData.city,
        shipping_state: formData.state,
        shipping_postal_code: formData.zipCode,
        shipping_country: formData.country,
        
        // Billing address fields (use shipping if same)
        billing_name: formData.billingSameAsShipping 
          ? `${formData.firstName} ${formData.lastName}`
          : `${formData.billingFirstName || formData.firstName} ${formData.billingLastName || formData.lastName}`,
        billing_email: formData.billingSameAsShipping 
          ? formData.email 
          : (formData.billingEmail || formData.email),
        billing_phone: formData.billingSameAsShipping 
          ? formData.phone 
          : (formData.billingPhone || formData.phone),
        billing_address: formData.billingSameAsShipping 
          ? formData.address 
          : (formData.billingAddress || formData.address),
        billing_city: formData.billingSameAsShipping 
          ? formData.city 
          : (formData.billingCity || formData.city),
        billing_state: formData.billingSameAsShipping 
          ? formData.state 
          : (formData.billingState || formData.state),
        billing_postal_code: formData.billingSameAsShipping 
          ? formData.zipCode 
          : (formData.billingZipCode || formData.zipCode),
        billing_country: formData.billingSameAsShipping 
          ? formData.country 
          : (formData.billingCountry || formData.country),
        
        // Order items
        items: cartItems.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
          total: item.product.price * item.quantity
        })),
        
        // Order totals
        subtotal: orderSummary.subtotal,
        shipping_amount: orderSummary.shipping,
        tax_amount: orderSummary.tax,
        discount_amount: orderSummary.couponDiscount,
        cod_fee: codFee,
        total_amount: finalTotal,
        
        // Coupon information
        coupon_code: couponData.isValid ? couponData.code : null,
        
        // Payment method
        payment_method: formData.paymentMethod,
        
        // Notes
        notes: formData.notes || null,
        
        // Additional fields that might be expected
        currency: 'INR',
        status: 'pending'
      };

     

      const response = await orderService.createOrder(orderData);

    

      // FIXED: Better response handling - check multiple possible success indicators
      if (response && (response.success === true || response.status === 'success' || response.data)) {
        const orderId = response.data?.id || response.id || response.order_id;
        
        if (orderId) {
          
          return {
            success: true,
            orderId: orderId,
            orderData: response.data || response
          };
        } else {
          
          // Still consider it successful if we have a response
          return {
            success: true,
            orderId: Date.now(), // Fallback ID
            orderData: response.data || response
          };
        }
      } else {
       
        return {
          success: false,
          message: response?.message || response?.error || 'Failed to create order'
        };
      }
    } catch (error) {
      
      let errorMessage = 'Error creating order';
      
      // Better error message extraction
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        errorMessage = Object.values(errors).flat().join(', ');
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(prev => ({ ...prev, order: false }));
    }
  }, [formData, orderSummary, couponData, cartItems, validateForm]);

  // Process payment using existing paymentService
  const processPayment = useCallback(async (orderId) => {
    setLoading(prev => ({ ...prev, payment: true }));

    try {
     
      // Use the paymentService to initiate payment
      const paymentData = {
        orderId: orderId,
        paymentMethod: formData.paymentMethod,
        returnUrl: `${window.location.origin}/checkout/success?orderId=${orderId}`,
        cancelUrl: `${window.location.origin}/checkout/failure`,
        failureUrl: `${window.location.origin}/checkout/failure`
      };

   
      const response = await paymentService.initiatePayment(paymentData);

     

      if (response && (response.success === true || response.data?.payment_url)) {
        // Clear cart after successful payment initiation
        await clearCart();
        
        return {
          success: true,
          paymentData: response.data || response,
          orderId: orderId
        };
      } else {
        return {
          success: false,
          message: response?.message || 'Payment initialization failed'
        };
      }
    } catch (error) {
     
      let errorMessage = 'Payment processing error';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(prev => ({ ...prev, payment: false }));
    }
  }, [formData.paymentMethod, clearCart]);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [user]);

  // Recalculate order summary when dependencies change
  useEffect(() => {
    calculateOrderSummary();
  }, [calculateOrderSummary]);

  // Debug: Log couponData changes
  useEffect(() => {
    console.log('🔍 Coupon data updated:', couponData);
  }, [couponData]);

  return {
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
    processPayment,
    validateForm
  };
};

export default useCheckout;