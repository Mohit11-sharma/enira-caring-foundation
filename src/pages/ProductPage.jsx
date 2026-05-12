import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FiLoader, FiShoppingCart, FiHeart, FiMinus, FiPlus, FiX, FiTruck, FiPackage, FiClock, FiShield, FiRefreshCw, FiMail, FiInfo } from 'react-icons/fi';
import { useProduct } from '../hooks/useProduct';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../contexts/AuthContext';

// Static categories mapping
const categoryLabels = {
  'Craft': 'Craft',
  'Clothing': 'Clothing', 
  'Accessories': 'Accessories',
  'Other': 'Other',
  'Decorative': 'Decorative'
};

// Shipping Policy Modal Component
function ShippingPolicyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={handleBackdropClick}
    >
      {/* Backdrop with blur effect */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md animate-fadeIn" />
      
      {/* Modal Content */}
      <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="sticky top-0 bg-white/90 backdrop-blur-xl border-b border-gray-200/50 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiTruck className="text-green-600" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Shipping Policy</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <FiX size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          <div className="prose prose-green max-w-none">
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Our Shipping Policy outlines the key information regarding the delivery of your orders. 
              Please take a moment to review the following details:
            </p>

            <div className="grid gap-8">
              {/* Shipping Methods */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-center space-x-3 mb-4">
                  <FiPackage className="text-blue-600" size={20} />
                  <h3 className="text-xl font-semibold text-gray-900">1.1 Shipping Methods</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  We strive to provide efficient and secure delivery options. Our primary shipping method is through trusted carriers. 
                  The selection of the carrier and shipping method may vary based on the specific items in your order.
                </p>
              </div>

              {/* Processing Time */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                <div className="flex items-center space-x-3 mb-4">
                  <FiClock className="text-green-600" size={20} />
                  <h3 className="text-xl font-semibold text-gray-900">1.2 Processing Time</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Orders placed through ENIRA are typically processed within <strong>1-2 business days</strong>. 
                  This processing time allows us to verify and prepare your order for shipment.
                </p>
              </div>

              {/* Shipping Time */}
              <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-100">
                <div className="flex items-center space-x-3 mb-4">
                  <FiTruck className="text-purple-600" size={20} />
                  <h3 className="text-xl font-semibold text-gray-900">1.3 Shipping Time</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  The estimated delivery time for your order will depend on your location and the shipping method chosen at checkout. 
                  Generally, you can expect your order to arrive within <strong>3-7 business days</strong> from the date of purchase. 
                  Please note that this timeframe may vary during peak seasons or due to unforeseen circumstances.
                </p>
              </div>

              {/* Shipping Costs */}
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100">
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-orange-600 text-xl font-bold">$</span>
                  <h3 className="text-xl font-semibold text-gray-900">1.4 Shipping Costs</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Shipping costs will be calculated and displayed during the checkout process. These costs are determined based on factors 
                  such as the shipping method selected, the weight of your order, and your delivery address.
                </p>
              </div>

              {/* Order Tracking */}
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-100">
                <div className="flex items-center space-x-3 mb-4">
                  <FiShield className="text-teal-600" size={20} />
                  <h3 className="text-xl font-semibold text-gray-900">1.5 Order Tracking</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  For your convenience, we provide order tracking information once your order has been shipped. 
                  You will receive a confirmation email with tracking details to monitor the progress of your delivery.
                </p>
              </div>

              {/* Additional Policies */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">1.6 Order Status Updates</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    You can check the status of your order at any time by logging into your account. 
                    Additionally, we will notify you via email about any significant changes in your order's status.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">1.7 Shipping Restrictions</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Please be aware that some items may have shipping restrictions due to size, weight, or legal regulations. 
                    We will notify you during the checkout process if any such restrictions apply to your order.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">1.8 Multiple Items</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    If your order contains multiple items, it is possible that these items will be shipped separately, 
                    depending on their availability and shipping requirements. You will receive separate tracking information for each shipment.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">1.9 Shipping Issues</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    In the unlikely event that you encounter any issues with your shipment, such as delays or damage, 
                    please contact our customer support team.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white">
                <h4 className="text-xl font-semibold mb-3">Our Commitment</h4>
                <p className="leading-relaxed">
                  ENIRA is committed to delivering quality products to your doorstep in a timely and reliable manner. 
                  If you have any questions or require further assistance, please do not hesitate to reach out to our friendly customer support team.
                </p>
                <p className="mt-4 font-medium">We appreciate your trust and support.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white/90 backdrop-blur-xl border-t border-gray-200/50 p-6">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors duration-200"
          >
            Got it, thanks!
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

// Refund & Cancellation Policy Modal Component
function RefundPolicyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={handleBackdropClick}
    >
      {/* Backdrop with blur effect */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md animate-fadeIn" />
      
      {/* Modal Content */}
      <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="sticky top-0 bg-white/90 backdrop-blur-xl border-b border-gray-200/50 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <FiRefreshCw className="text-red-600" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Refund & Cancellation Policy</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <FiX size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          <div className="prose prose-red max-w-none">
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Our organization makes public its policy on refund and cancellation of donations received for the social cause on payment gateway as outlined below:
            </p>

            <div className="grid gap-8">
              {/* No Refund Policy */}
              <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-xl p-6 border border-red-100">
                <div className="flex items-center space-x-3 mb-4">
                  <FiX className="text-red-600" size={20} />
                  <h3 className="text-xl font-semibold text-gray-900">No Refund Policy</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  <strong>No refund/cancellation for the donated amount by any donor will be entertained for online donations</strong> since refund is a cumbersome process. The donation will be used for the education, healthcare, social welfare, and women empowerment of the poorest of the poor in far-flung villages.
                </p>
              </div>

              {/* Voluntary Donation */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-center space-x-3 mb-4">
                  <FiHeart className="text-blue-600" size={20} />
                  <h3 className="text-xl font-semibold text-gray-900">Voluntary Contribution</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Development Focus does not compel any person or organization to donate money. It depends on your wish whether you are willing to contribute some portion of your income towards the philanthropic activities for the establishment of universal justice and peace.
                </p>
              </div>

              {/* Transparency */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                <div className="flex items-center space-x-3 mb-4">
                  <FiInfo className="text-green-600" size={20} />
                  <h3 className="text-xl font-semibold text-gray-900">Transparency & Information</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  If at any time you feel that you wish to collect any information on how your money was spent, you are most welcome to contact us. While donating the money, you are free to ask any query or doubt which you have in your mind. Our experts will guide you through the entire process and how the money is utilized.
                </p>
                <div className="mt-4 p-4 bg-green-100 rounded-lg">
                  <p className="text-green-800 font-medium">
                    <strong>It is your right to know where the donation is being used.</strong>
                  </p>
                </div>
              </div>

              {/* Confirmation & Receipt */}
              <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-100">
                <div className="flex items-center space-x-3 mb-4">
                  <FiMail className="text-purple-600" size={20} />
                  <h3 className="text-xl font-semibold text-gray-900">Donation Confirmation</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Once online payment is made, we will send a confirmation email regarding the donation along with a <strong>tax-exempted receipt valid u/s 80G of IT for Indian donations.</strong>
                </p>
              </div>

              {/* Contact Information */}
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100">
                <div className="flex items-center space-x-3 mb-4">
                  <FiMail className="text-orange-600" size={20} />
                  <h3 className="text-xl font-semibold text-gray-900">Contact for Information</h3>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  The request for any donation-related information can be sent to:
                </p>
                <div className="bg-white rounded-lg p-4 border border-orange-200">
                  <a 
                    href="mailto:eniracaring@gmail.com" 
                    className="text-orange-600 font-semibold hover:text-orange-700 transition-colors text-lg"
                  >
                    eniracaring@gmail.com
                  </a>
                </div>
              </div>

              {/* Our Mission */}
              <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white">
                <h4 className="text-xl font-semibold mb-3">Our Mission</h4>
                <p className="leading-relaxed mb-4">
                  Every donation contributes to meaningful change in the lives of those who need it most. Your contribution supports:
                </p>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Education initiatives</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Healthcare programs</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Social welfare projects</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Women empowerment</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white/90 backdrop-blur-xl border-t border-gray-200/50 p-6">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors duration-200"
          >
            I understand
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [showShippingPolicy, setShowShippingPolicy] = useState(false);
  const [showRefundPolicy, setShowRefundPolicy] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { user, isAuthenticated } = useAuth(); 
  // Use custom hooks
  const { product, loading, error } = useProduct(id);
  const { addToCart } = useCart();

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 99)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Redirect to login with return URL
      navigate('/auth', { 
        state: { 
          from: `/product/${id}`,
          message: 'Please log in to add items to your cart' 
        } 
      });
      return;
    }
    
    setAddingToCart(true);
    
    try {
      const result = await addToCart(product.id, quantity);
      
      // Show success message (you can use a toast library here)
      console.log('✅ Added to cart successfully:', result);
      
    } catch (error) {
      console.error('❌ Add to cart error:', error);
      // You could show an error toast here
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="animate-spin mx-auto mb-4 text-4xl text-green-600" />
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Product</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <Link
            to="/shop"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Product Not Found</h2>
          <p className="text-gray-500 mb-6">Sorry, we couldn't find that product.</p>
          <Link
            to="/shop"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock <= 5 && product.stock > 0;

  return (
    <>
      {/* <Head>
        <title>{product.title}</title>
        <meta property="og:title" content={product.title} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={product.imageUrl} />
        <meta property="og:url" content={`https://mystore.com/product/${product.id}`} />
        <meta property="product:price:amount" content={product.price} />
        <meta property="product:price:currency" content="INR" />
      </Head> */}
      <main className="min-h-screen bg-gray-50 py-8 mt-20 px-4">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-green-600 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-green-600 transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Product Image Gallery */}
              <div>
                <div className="bg-gradient-to-br from-yellow-100 via-green-100 to-white rounded-2xl p-6 flex items-center justify-center">
                  <img
                    src={(product.images && product.images.length > 0) ? product.images[selectedImageIndex] : (product.image || 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg')}
                    alt={product.name}
                    className="w-full h-[560px] object-contain rounded-xl shadow-lg border border-gray-200 bg-white p-4"
                    style={{ maxHeight: '560px' }}
                  />
                </div>

                {/* Thumbnails */}
                {((product.images && product.images.length > 1) || product.image) && (
                  <div className="mt-4 flex items-center gap-3 overflow-x-auto">
                    {(product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : [])).map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border ${selectedImageIndex === idx ? 'ring-2 ring-green-600' : 'border-gray-200'} focus:outline-none`}
                      >
                        <img src={img} alt={`${product.name} ${idx+1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="flex flex-col justify-center space-y-6">
                <div className="flex items-center justify-between">
                  <span className="inline-block bg-green-600/80 text-white text-xs font-semibold px-4 py-2 rounded-full shadow">
                    {categoryLabels[product.category] || product.category}
                  </span>
                  
                  {/* Stock Status */}
                  {isOutOfStock && (
                    <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Out of Stock
                    </span>
                  )}
                  {isLowStock && (
                    <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Only {product.stock} left
                    </span>
                  )}
                </div>

                <h1 className="text-4xl font-extrabold text-gray-900">{product.name}</h1>

                {/* <p className="text-gray-600 text-lg leading-relaxed">
                  {product.description || 'No description available for this product.'}
                </p> */}

                <div className="flex items-center space-x-4">
                  <span className="text-4xl font-bold text-green-600">₹{product.price}</span>
                  {product.sku && (
                    <span className="text-sm text-gray-500">SKU: {product.sku}</span>
                  )}
                </div>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {product.description || 'No description available for this product.'}
                </p>
                {!isOutOfStock && (
                  <div className="space-y-4">
                    {/* Quantity Selector */}
                    <div className="flex items-center space-x-4">
                      <label className="text-sm text-gray-700 font-medium">Quantity:</label>
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => handleQuantityChange(quantity - 1)}
                          disabled={quantity <= 1}
                          className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FiMinus size={16} />
                        </button>
                        <input
                          type="number"
                          min={1}
                          max={product.stock}
                          value={quantity}
                          onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                          className="w-20 px-3 py-2 text-center border-none focus:outline-none font-semibold"
                        />
                        <button
                          onClick={() => handleQuantityChange(quantity + 1)}
                          disabled={quantity >= product.stock}
                          className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FiPlus size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <button 
                        onClick={handleAddToCart}
                        disabled={addingToCart}
                        className="flex-1 px-8 py-4 rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold text-lg shadow-xl transition duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {addingToCart ? (
                          <FiLoader className="animate-spin" size={20} />
                        ) : (
                          <FiShoppingCart size={20} />
                        )}
                        <span>{addingToCart ? 'Adding...' : 'Add to Cart'}</span>
                      </button>
                      
                      {/* <button className="px-6 py-4 rounded-xl border-2 border-gray-300 hover:border-red-500 hover:text-red-500 transition duration-200 flex items-center justify-center">
                        <FiHeart size={20} />
                      </button> */}
                    </div>
                  </div>
                )}

                {isOutOfStock && (
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-red-700 font-medium">This product is currently out of stock.</p>
                  </div>
                )}

                {/* Product Features - Updated with both policies */}
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowShippingPolicy(true)}
                    className="flex items-center space-x-2 text-sm text-green-600 hover:text-green-700 font-medium transition-colors group"
                  >
                    <FiTruck size={16} className="group-hover:scale-110 transition-transform" />
                    <span className="underline decoration-dotted underline-offset-2">Shipping Policy</span>
                  </button>
                  
                  <button
                    onClick={() => setShowRefundPolicy(true)}
                    className="flex items-center space-x-2 text-sm text-red-600 hover:text-red-700 font-medium transition-colors group"
                  >
                    <FiRefreshCw size={16} className="group-hover:scale-110 transition-transform" />
                    <span className="underline decoration-dotted underline-offset-2">Refund Policy</span>
                  </button>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-white"></span>
                    </span>
                    <span>Secure payment</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Shipping Policy Modal */}
      <ShippingPolicyModal 
        isOpen={showShippingPolicy} 
        onClose={() => setShowShippingPolicy(false)} 
      />

      {/* Refund Policy Modal */}
      <RefundPolicyModal 
        isOpen={showRefundPolicy} 
        onClose={() => setShowRefundPolicy(false)} 
      />
    </>
  );
}