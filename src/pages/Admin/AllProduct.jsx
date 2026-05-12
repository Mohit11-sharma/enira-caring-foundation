import React, { useState, useEffect } from 'react';
import { 
  FiSearch, 
  FiFilter, 
  FiEdit, 
  FiTrash2, 
  FiEye, 
  FiPlus,
  FiDownload,
  FiRefreshCw,
  FiMoreVertical,
  FiLoader,
  FiAlertCircle,
  FiCheck,
  FiX,
  FiPackage,
  FiImage,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import { productService } from '../../services/productService';

const AllProduct = ({ onEditProduct, onAddProduct, refreshTrigger }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [itemsPerPage] = useState(12);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [imageIndices, setImageIndices] = useState({});

  useEffect(() => {
    loadProducts();
  }, [currentPage, searchTerm, selectedCategory, selectedStatus, sortBy, sortOrder, refreshTrigger]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: currentPage,
        per_page: itemsPerPage,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory && { category: selectedCategory }),
        ...(selectedStatus && { status: selectedStatus }),
        sort_by: sortBy,
        sort_order: sortOrder
      };

      const response = await productService.getProducts(params);
 
      let productsData = [];
      let totalCount = 0;
      let totalPagesCount = 1;

      if (response && response.data) {
        productsData = Array.isArray(response.data) ? response.data : [];
        totalCount = response.total || response.meta?.total || productsData.length;
        totalPagesCount = response.last_page || response.meta?.last_page || Math.ceil(totalCount / itemsPerPage);
      } else if (Array.isArray(response)) {
        productsData = response;
        totalCount = response.length;
        totalPagesCount = Math.ceil(totalCount / itemsPerPage);
      } else if (response && Array.isArray(response.products)) {
        productsData = response.products;
        totalCount = response.total || productsData.length;
        totalPagesCount = response.pages || Math.ceil(totalCount / itemsPerPage);
      }

      setProducts(productsData);
      setTotalProducts(totalCount);
      setTotalPages(Math.max(1, totalPagesCount));
      
      // Initialize image indices
      const indices = {};
      productsData.forEach(p => {
        indices[p.id] = 0;
      });
      setImageIndices(indices);
      
    } catch (error) {
      setError(error.message || 'Failed to load products');
      setProducts([]);
      setTotalProducts(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    loadProducts();
  };

  const handleProductSelect = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p.id));
    }
  };

  const handleDeleteProduct = async (product) => {
    try {
      await productService.deleteProduct(product.id);
      await loadProducts();
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (error) {
      setError(error.message || 'Failed to delete product');
    }
  };

  const handleBulkDelete = async () => {
    try {
      await productService.bulkDeleteProducts(selectedProducts);
      setSelectedProducts([]);
      await loadProducts();
    } catch (error) {
      setError(error.message || 'Failed to delete products');
    }
  };

  const handleBulkStatusUpdate = async (status) => {
    try {
      await productService.bulkUpdateStatus(selectedProducts, status);
      setSelectedProducts([]);
      await loadProducts();
    } catch (error) {
      setError(error.message || 'Failed to update product status');
    }
  };

  const handleExportProducts = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Name,Description,Price,Category,Stock,Status\n"
      + products.map(p => `"${p.name}","${p.description}","${p.price}","${p.category}","${p.stock}","${p.status}"`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "products.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedStatus('');
    setCurrentPage(1);
  };

  const handlePrevImage = (productId, imagesLength) => {
    setImageIndices(prev => ({
      ...prev,
      [productId]: (prev[productId] - 1 + imagesLength) % imagesLength
    }));
  };

  const handleNextImage = (productId, imagesLength) => {
    setImageIndices(prev => ({
      ...prev,
      [productId]: (prev[productId] + 1) % imagesLength
    }));
  };

  const DeleteModal = ({ show, product, onConfirm, onCancel }) => {
    if (!show) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex items-center mb-4">
            <FiAlertCircle className="w-6 h-6 text-red-500 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Delete Product</h3>
          </div>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete "{product?.name}"? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(product)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (error && !products.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full mx-4">
          <FiAlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Products</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleRetry}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <FiRefreshCw className="w-4 h-4 inline mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const categories = [
    'electronics',
    'clothing',
    'books',
    'crafts',
    'home',
    'sports',
    'toys',
    'beauty',
    'health',
    'food',
    'education',
    'accessories'
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900">
                All Products
                {totalProducts > 0 && (
                  <span className="ml-2 text-sm font-medium text-gray-500">
                    ({totalProducts} total)
                  </span>
                )}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your product inventory and listings
              </p>
            </div>
            
            <div className="mt-4 flex flex-col sm:flex-row gap-3 lg:mt-0 lg:ml-4">
              <button
                onClick={handleExportProducts}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiDownload className="w-4 h-4 mr-2" />
                Export
              </button>
              
              <button
                onClick={() => onAddProduct && onAddProduct()}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiPlus className="w-4 h-4 mr-2" />
                Add Product
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="w-full lg:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full lg:w-40">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div className="w-full lg:w-40">
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="created_at-desc">Newest First</option>
                <option value="created_at-asc">Oldest First</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="price-asc">Price Low-High</option>
                <option value="price-desc">Price High-Low</option>
              </select>
            </div>

            {(searchTerm || selectedCategory || selectedStatus) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {selectedProducts.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-sm font-medium text-blue-800">
                  {selectedProducts.length} product{selectedProducts.length > 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleBulkStatusUpdate('active')}
                  className="text-sm text-green-700 hover:text-green-800 font-medium"
                >
                  Activate
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate('inactive')}
                  className="text-sm text-yellow-700 hover:text-yellow-800 font-medium"
                >
                  Deactivate
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="text-sm text-red-700 hover:text-red-800 font-medium"
                >
                  Delete
                </button>
                <button
                  onClick={() => setSelectedProducts([])}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="bg-white rounded-lg shadow-sm border p-12">
            <div className="flex flex-col items-center justify-center">
              <FiLoader className="w-8 h-8 text-blue-500 animate-spin mb-4" />
              <p className="text-gray-600">Loading products...</p>
            </div>
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-12">
            <div className="text-center">
              <FiPackage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedCategory || selectedStatus 
                  ? 'Try adjusting your filters or search terms'
                  : 'Get started by adding your first product'
                }
              </p>
              {!searchTerm && !selectedCategory && !selectedStatus && (
                <button
                  onClick={() => onAddProduct && onAddProduct()}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <FiPlus className="w-4 h-4 inline mr-2" />
                  Add Your First Product
                </button>
              )}
            </div>
          </div>
        )}

        {!loading && products.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={products.length > 0 && selectedProducts.length === products.length}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-3 text-sm font-medium text-gray-700">
                  Select All
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <FiPackage className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded ${viewMode === 'table' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <FiMoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {viewMode === 'grid' && (
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => {
                    const images = product.images || [];
                    const currentIndex = imageIndices[product.id] || 0;
                    const hasMultipleImages = images.length > 1;

                    return (
                      <div key={product.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        <div className="relative">
                          <div className="h-48 bg-gray-100 flex items-center justify-center relative group">
                            {images.length > 0 ? (
                              <img
                                src={images[currentIndex]}
                                alt={`${product.name} - Image ${currentIndex + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div className={`w-full h-full flex items-center justify-center ${images.length > 0 ? 'hidden' : ''}`}>
                              <FiImage className="w-12 h-12 text-gray-400" />
                            </div>

                            {hasMultipleImages && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePrevImage(product.id, images.length);
                                  }}
                                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-70"
                                >
                                  <FiChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleNextImage(product.id, images.length);
                                  }}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-70"
                                >
                                  <FiChevronRight className="w-5 h-5" />
                                </button>
                                
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                                  {images.map((_, idx) => (
                                    <button
                                      key={idx}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setImageIndices(prev => ({
                                          ...prev,
                                          [product.id]: idx
                                        }));
                                      }}
                                      className={`w-2 h-2 rounded-full transition-all ${
                                        idx === currentIndex 
                                          ? 'bg-white w-6' 
                                          : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                          
                          <div className="absolute top-2 left-2">
                            <input
                              type="checkbox"
                              checked={selectedProducts.includes(product.id)}
                              onChange={() => handleProductSelect(product.id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-white"
                            />
                          </div>

                          <div className="absolute top-2 right-2 flex flex-col space-y-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              product.status === 'active' ? 'bg-green-100 text-green-800' :
                              product.status === 'inactive' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {product.status}
                            </span>
                            {images.length > 1 && (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 flex items-center">
                                <FiImage className="w-3 h-3 mr-1" />
                                {images.length}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="p-4">
                          <h3 className="font-semibold text-gray-800 truncate" title={product.name}>
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2" title={product.description}>
                            {product.description || 'No description available'}
                          </p>
                          <div className="flex justify-between items-center mt-3">
                            <span className="text-lg font-bold text-blue-600">
                              ₹{product.price}
                            </span>
                            <span className="text-sm text-gray-500">
                              Stock: {product.stock}
                            </span>
                          </div>
                          
                          <div className="flex space-x-2 mt-4">
                            <button
                              onClick={() => onEditProduct && onEditProduct(product)}
                              className="flex-1 bg-blue-500 text-white py-2 px-3 rounded text-sm hover:bg-blue-600 transition-colors"
                            >
                              <FiEdit className="w-4 h-4 inline mr-1" />
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                setProductToDelete(product);
                                setShowDeleteModal(true);
                              }}
                              className="flex-1 bg-red-500 text-white py-2 px-3 rounded text-sm hover:bg-red-600 transition-colors"
                            >
                              <FiTrash2 className="w-4 h-4 inline mr-1" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalProducts)} of {totalProducts} products
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {[...Array(Math.min(5, totalPages))].map((_, index) => {
                    const pageNumber = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + index;
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`px-3 py-1 rounded text-sm transition-colors ${
                          currentPage === pageNumber
                            ? 'bg-blue-500 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <DeleteModal
        show={showDeleteModal}
        product={productToDelete}
        onConfirm={handleDeleteProduct}
        onCancel={() => {
          setShowDeleteModal(false);
          setProductToDelete(null);
        }}
      />
    </div>
  );
};

export default AllProduct;