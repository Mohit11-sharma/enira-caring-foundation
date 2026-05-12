import React, { useState, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiShare2, FiEye, FiLoader, FiStar, FiTag, FiPackage } from 'react-icons/fi';
import { useProducts } from '../../hooks/useProducts';
import { useCartContext } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

const categories = ['All', 'Crafts', 'Clothing', 'Accessories', 'Other', 'Decorative'];

export default function ShopGrid() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredId, setHoveredId] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null);

  const navigate = useNavigate();
  const { user } = useAuth(); // Get current user

  // Memoize the initial params to prevent unnecessary re-renders
  const initialParams = useMemo(() => ({
    category: selectedCategory === 'All' ? '' : selectedCategory,
    search: searchTerm,
    status: 'active'
  }), [selectedCategory, searchTerm]);

  // Get products with category filter
  const { products, loading, error, pagination, refetch } = useProducts(initialParams);

  // Replace useCart hook with useCartContext
  const { addToCart } = useCartContext();

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  const handleSearch = useCallback((e) => {
    const value = e.target.value;
    setSearchTerm(value);
  }, []);

  // Debounced search effect
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      // The search will automatically trigger through the initialParams change
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleAddToCart = useCallback(async (productId) => {
    // Check if user is logged in
    if (!user) {
      // Store the intended action in sessionStorage for redirect back
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
      sessionStorage.setItem('pendingCartItem', productId);
      
      // Redirect to login page
      navigate('/auth');
      return;
    }

    setAddingToCart(productId);
    
    try {
      const result = await addToCart(productId, 1);
    } catch (error) {
      console.error('❌ Add to cart error:', error);
    } finally {
      setAddingToCart(null);
    }
  }, [addToCart, user, navigate]);

  const handleShareProduct = useCallback((product) => {
    const productUrl = `${window.location.origin}/shop/product/${product.id}`;
    
    if (navigator.share) {
      // Use native share API if available
      navigator.share({
        title: product.name,
        text: `Check out this amazing product: ${product.name}`,
        url: productUrl,
      }).catch((error) => {
        // Fallback to clipboard
        copyToClipboard(productUrl);
      });
    } else {
      // Fallback to clipboard copy
      copyToClipboard(productUrl);
    }
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // You could show a toast notification here
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    });
  };

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  const handlePreviousPage = useCallback(() => {
    if (pagination.current_page > 1) {
      refetch({ page: pagination.current_page - 1 });
    }
  }, [refetch, pagination.current_page]);

  const handleNextPage = useCallback(() => {
    if (pagination.current_page < pagination.last_page) {
      refetch({ page: pagination.current_page + 1 });
    }
  }, [refetch, pagination.current_page, pagination.last_page]);

  if (error) {
    return (
      <div className="flex gap-8 bg-gray-50 min-h-screen">
        <aside className="min-w-[220px] border-r border-gray-200 bg-white p-8 shadow-lg">
          <h3 className="text-xl font-bold mb-6 text-gray-800">Categories</h3>
          <ul className="space-y-4">
            {categories.map(cat => (
              <li key={cat}>
                <button 
                  onClick={() => handleCategoryChange(cat)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition font-medium ${
                    selectedCategory === cat
                      ? 'bg-green-600 text-white'
                      : 'text-gray-700 hover:bg-green-100'
                  }`}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </aside>
        
        <main className="flex-1 py-8 px-4 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-xl font-bold text-red-600 mb-4">Error Loading Products</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={handleRetry}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-0 md:gap-8 bg-gray-50 min-h-screen">
      {/* Sidebar (Categories & Search) */}
      <aside className="w-full md:w-[240px] border-b md:border-b-0 md:border-r border-gray-200 bg-white p-4 md:p-8 shadow-lg">
        <h3 className="text-xl font-bold mb-4 md:mb-6 text-gray-800">Categories</h3>
        <ul className="flex md:block gap-2 md:gap-0 overflow-x-auto md:overflow-visible mb-4 md:mb-8">
          {categories.map(cat => (
            <li key={cat} className="flex-shrink-0">
              <button 
                onClick={() => handleCategoryChange(cat)}
                className={`w-full text-left px-4 py-2 rounded-lg transition font-medium whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-green-600 text-white'
                    : 'text-gray-700 hover:bg-green-100'
                }`}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
        {/* Search */}
        <div className="mt-4 md:mt-8">
          <h4 className="text-lg font-semibold mb-2 md:mb-4 text-gray-800">Search</h4>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </aside>

      {/* Product Grid */}
      <main className="flex-1 py-6 px-2 sm:px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-2">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            {selectedCategory === 'All' ? 'All Products' : selectedCategory}
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            {loading ? 'Loading...' : `${pagination.total} products found`}
          </p>
        </div>

        {/* Guest Notice Banner */}
        {!user && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
            <div className="flex-shrink-0">
              <FiShoppingCart className="text-yellow-600" size={20} />
            </div>
            <div className="flex-1">
              <p className="text-yellow-800 text-sm font-medium">
                You're browsing as a guest. 
                <Link to="/auth" className="ml-1 underline font-semibold hover:text-yellow-900">
                  Login
                </Link> to add items to your cart!
              </p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <FiLoader className="animate-spin mx-auto mb-4 text-4xl text-green-600" />
              <p className="text-gray-600">Loading products...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Products Found</h3>
              <p className="text-gray-500">Try searching with different keywords or browse other categories.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map(product => (
              <div
                key={product.id}
                className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                onMouseEnter={() => setHoveredId(product.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Product Image Container */}
                <div className="relative overflow-hidden bg-gray-50">
                  <div className="aspect-square p-4">
                    <img
                      src={product.image || 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg'}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  
                  {/* Floating Action Buttons */}
                  <div className={`absolute top-4 right-4 flex flex-col gap-2 transition-all duration-300 ${
                    hoveredId === product.id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
                  }`}>
                    <Link
                      to={`/shop/product/${product.id}`}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-green-600 hover:text-white transition-colors border border-gray-200"
                      title="View Details"
                    >
                      <FiEye size={16} />
                    </Link>
                    <button 
                      onClick={() => handleShareProduct(product)}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-colors border border-gray-200"
                      title="Share Product"
                    >
                      <FiShare2 size={16} />
                    </button>
                  </div>

                  {/* Stock Badges */}
                  {product.stock === 0 ? (
                    <div className="absolute top-4 left-4">
                      <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        Out of Stock
                      </span>
                    </div>
                  ) : product.stock <= 5 ? (
                    <div className="absolute top-4 left-4">
                      <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        Only {product.stock} left
                      </span>
                    </div>
                  ) : null}

                  {/* Discount Badge (if applicable) */}
                  {product.discount_percentage && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                        <FiTag size={12} />
                        {product.discount_percentage}% OFF
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-5 space-y-3">
                  {/* Category and Rating */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-semibold px-2 py-1 rounded-full border border-green-200">
                      <FiPackage size={10} />
                      {product.category}
                    </span>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <FiStar size={12} fill="currentColor" />
                      <span className="text-xs text-gray-600 font-medium">
                        {product.rating || '4.5'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Product Name */}
                  <h4 className="text-base font-semibold text-gray-900 line-clamp-2 leading-tight min-h-[2.5rem]">
                    {product.name}
                  </h4>
                  
                  {/* Product Description */}
                  <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed min-h-[2.5rem]">
                    {product.description || 'Premium quality product crafted with care and attention to detail.'}
                  </p>
                  
                  {/* Price and Add to Cart */}
                  <div className="flex items-center gap-1 justify-between pt-2 border-t border-gray-100">
                    <div className="flex flex-col">
                      <span className="text-xl font-bold text-green-600">
                        ₹{product.price}
                      </span>
                      {product.original_price && product.original_price > product.price && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{product.original_price}
                        </span>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      disabled={addingToCart === product.id || product.stock === 0}
                      className={`flex items-center gap-2 px-2 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                        product.stock === 0
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : addingToCart === product.id
                          ? 'bg-green-500 text-white cursor-not-allowed'
                          : user
                          ? 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg'
                          : 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-md hover:shadow-lg'
                      }`}
                    >
                      {addingToCart === product.id ? (
                        <>
                          <FiLoader className="animate-spin" size={14} />
                          <span>Adding...</span>
                        </>
                      ) : product.stock === 0 ? (
                        <span>Out of Stock</span>
                      ) : !user ? (
                        <>
                          <FiShoppingCart size={14} />
                          <span>Buy Now</span>
                        </>
                      ) : (
                        <>
                          <FiShoppingCart size={14} />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Product Features */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 pt-2">
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Free Shipping
                    </span>
                    
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.last_page > 1 && (
          <div className="flex flex-wrap items-center justify-center mt-10 gap-2 sm:gap-3">
            <button
              onClick={handlePreviousPage}
              disabled={pagination.current_page === 1 || loading}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span>Previous</span>
            </button>
            <div className="flex items-center gap-1 sm:gap-2">
              {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                const page = i + 1;
                const isActive = page === pagination.current_page;
                return (
                  <button
                    key={page}
                    onClick={() => refetch({ page })}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg font-medium text-sm transition-colors ${
                      isActive
                        ? 'bg-green-600 text-white shadow-md'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
            <button
              onClick={handleNextPage}
              disabled={pagination.current_page === pagination.last_page || loading}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span>Next</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}