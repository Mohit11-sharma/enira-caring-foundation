import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FiSave, 
  FiX, 
  FiImage, 
  FiUpload, 
  FiLoader, 
  FiCheck, 
  FiAlertCircle,
  FiArrowLeft,
  FiPackage,
  FiDollarSign,
  FiTag,
  FiShoppingCart,
  FiStar
} from 'react-icons/fi';
import { productService } from '../../services/productService';
import { uploadImageToLaravel } from '../../utils/uploadImage';

const AddProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock_quantity: '',
    sku: '',
    status: 'active',
    image: null,
    images: []
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);

  const MAX_IMAGES = 8;

  useEffect(() => {
    if (isEditing && id) {
      loadProductData(id);
    }
  }, [id, isEditing]);

  const loadProductData = async (productId) => {
    try {
      setLoadingProduct(true);
      const response = await productService.getProduct(productId);
      const product = response.data || response;
      
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || '',
        stock_quantity: product.stock_quantity || '',
        sku: product.sku || '',
        status: product.status || 'active',
        image: product.image || null,
        images: product.images || (product.image ? [product.image] : [])
      });
      
      if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        setImagesPreview(product.images);
        setImagePreview(product.images[0] || null);
      } else if (product.image) {
        setImagePreview(product.image);
        setImagesPreview(product.image ? [product.image] : []);
      }
    } catch (error) {
      setErrors({ general: 'Failed to load product data. Please try again.' });
    } finally {
      setLoadingProduct(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    console.log(`Selected ${files.length} files for upload`);

    const currentCount = formData.images ? formData.images.length : 0;
    if (currentCount + files.length > MAX_IMAGES) {
      setErrors(prev => ({ ...prev, image: `You can upload up to ${MAX_IMAGES} images. Currently have ${currentCount}, trying to add ${files.length}` }));
      return;
    }

    const uploadedUrls = [];
    const newPreviews = [];
    let failedCount = 0;

    try {
      setUploadingImage(true);
      setErrors(prev => ({ ...prev, image: '' }));

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`Processing file ${i + 1}/${files.length}:`, file.name, file.type, file.size);

        if (!file.type.startsWith('image/')) {
          console.warn(`Skipping ${file.name} - not an image`);
          failedCount++;
          continue;
        }
        if (file.size > 8 * 1024 * 1024) {
          console.warn(`Skipping ${file.name} - too large`);
          failedCount++;
          continue;
        }

        try {
          const imageUrl = await uploadImageToLaravel(file);
          console.log(`Uploaded ${file.name} successfully:`, imageUrl);
          
          if (imageUrl) {
            uploadedUrls.push(imageUrl);
            newPreviews.push(imageUrl);
          }
        } catch (uploadError) {
          console.error(`Failed to upload ${file.name}:`, uploadError);
          failedCount++;
        }
      }

      if (uploadedUrls.length > 0) {
        setFormData(prev => ({
          ...prev,
          images: [...(prev.images || []), ...uploadedUrls],
          image: prev.image || uploadedUrls[0]
        }));

        setImagesPreview(prev => ([...prev, ...newPreviews]));
        setImagePreview(prev => prev || newPreviews[0] || null);

        let message = `${uploadedUrls.length} image(s) uploaded successfully!`;
        if (failedCount > 0) {
          message += ` (${failedCount} failed)`;
        }
        setSuccess(message);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setErrors(prev => ({
          ...prev,
          image: 'No images were uploaded successfully. Please check file formats and sizes.'
        }));
      }
    } catch (error) {
      console.error('Upload error:', error);
      setErrors(prev => ({
        ...prev,
        image: error.message || 'Failed to upload image(s). Please try again.'
      }));
    } finally {
      setUploadingImage(false);
      // Reset the file input
      e.target.value = '';
    }
  };

  const removeImageAtIndex = (index) => {
    console.log(`Removing image at index ${index}`);
    setImagesPreview(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => {
      const newImages = (prev.images || []).filter((_, i) => i !== index);
      return {
        ...prev,
        images: newImages,
        image: newImages[0] || null
      };
    });

    if (primaryImageIndex === index) {
      setPrimaryImageIndex(0);
    } else if (primaryImageIndex > index) {
      setPrimaryImageIndex(prev => Math.max(0, prev - 1));
    }
  };

  const setPrimaryImage = (index) => {
    console.log(`Setting primary image to index ${index}`);
    setPrimaryImageIndex(index);
    setFormData(prev => ({
      ...prev,
      image: prev.images[index]
    }));
    setImagePreview(imagesPreview[index]);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.stock_quantity || isNaN(formData.stock_quantity) || parseInt(formData.stock_quantity) < 0) {
      newErrors.stock_quantity = 'Valid stock quantity is required';
    }
    
    if (!isEditing && (!formData.images || formData.images.length === 0)) {
      newErrors.image = 'At least one product image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setErrors({});
      setSuccess('');

      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        stock_quantity: parseInt(formData.stock_quantity),
        sku: formData.sku.trim(),
        status: formData.status,
        image: formData.image || '',
        images: formData.images || []
      };

      console.log('Submitting product data:', productData);

      if (isEditing) {
        await productService.updateProduct(id, productData);
        setSuccess('Product updated successfully!');
      } else {
        await productService.createProduct(productData);
        setSuccess('Product created successfully!');
      }

      setTimeout(() => {
        navigate('/admin/products');
      }, 2000);

    } catch (error) {
      console.error('Submit error:', error);
      if (error.errors && typeof error.errors === 'object') {
        setErrors(error.errors);
      } else {
        setErrors({ 
          general: error.message || `An error occurred while ${isEditing ? 'updating' : 'creating'} the product` 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/products');
  };

  if (isEditing && loadingProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <FiLoader className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading product data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={handleCancel}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isEditing ? 'Edit Product' : 'Add New Product'}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {isEditing 
                    ? 'Update the product details below' 
                    : 'Fill in the product details to create a new listing'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={loading || uploadingImage}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || uploadingImage}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin w-4 h-4 mr-2" />
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <FiSave className="w-4 h-4 mr-2" />
                    {isEditing ? 'Update Product' : 'Create Product'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <FiCheck className="w-5 h-5 text-green-500 mr-3" />
              <p className="text-green-700 font-medium">{success}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <FiAlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <p className="text-red-700 font-medium">{errors.general}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <FiPackage className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter product name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU (Optional)
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Product SKU"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Enter product description..."
              />
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <FiDollarSign className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Pricing & Inventory</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.price ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity *
                </label>
                <div className="relative">
                  <FiShoppingCart className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="number"
                    name="stock_quantity"
                    value={formData.stock_quantity}
                    onChange={handleInputChange}
                    min="0"
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.stock_quantity ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                </div>
                {errors.stock_quantity && (
                  <p className="mt-1 text-sm text-red-600">{errors.stock_quantity}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <FiTag className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Category</h2>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.category ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              >
                <option value="">Select a category</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing & Apparel</option>
                <option value="books">Books & Media</option>
                <option value="crafts">Handicrafts</option>
                <option value="home">Home & Garden</option>
                <option value="sports">Sports & Outdoors</option>
                <option value="toys">Toys & Games</option>
                <option value="beauty">Beauty & Personal Care</option>
                <option value="health">Health & Wellness</option>
                <option value="food">Food & Beverages</option>
                <option value="education">Educational Materials</option>
                <option value="accessories">Accessories</option>
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>
          </div>

          {/* Product Images */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg mr-3">
                  <FiImage className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Product Images {!isEditing && '*'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Upload up to {MAX_IMAGES} images ({imagesPreview.length}/{MAX_IMAGES})
                  </p>
                </div>
              </div>
            </div>

            {/* Uploaded Images Grid */}
            {imagesPreview && imagesPreview.length > 0 && (
              <div className="mb-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {imagesPreview.map((src, idx) => (
                    <div key={idx} className="relative group">
                      <div className={`relative border-2 rounded-lg overflow-hidden ${
                        primaryImageIndex === idx ? 'border-blue-500 shadow-lg' : 'border-gray-300'
                      }`}>
                        <img
                          src={src}
                          alt={`Preview ${idx + 1}`}
                          className="w-full h-36 object-cover"
                        />
                        
                        {primaryImageIndex === idx && (
                          <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center">
                            <FiStar className="w-3 h-3 mr-1 fill-current" />
                            Primary
                          </div>
                        )}

                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="flex flex-col space-y-2">
                            {primaryImageIndex !== idx && (
                              <button
                                type="button"
                                onClick={() => setPrimaryImage(idx)}
                                className="bg-white text-gray-700 px-3 py-1 rounded text-xs font-medium hover:bg-gray-100 transition-colors"
                              >
                                Set Primary
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => removeImageAtIndex(idx)}
                              className="bg-red-500 text-white px-3 py-1 rounded text-xs font-medium hover:bg-red-600 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 text-center mt-1">
                        Image {idx + 1}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Area */}
            {imagesPreview.length < MAX_IMAGES && (
              <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                errors.image ? 'border-red-300 bg-red-50' : 
                uploadingImage ? 'border-blue-400 bg-blue-50' : 
                'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
              }`}>
                {uploadingImage ? (
                  <div className="flex flex-col items-center">
                    <FiLoader className="animate-spin h-12 w-12 text-blue-500 mb-4" />
                    <p className="text-blue-600 mb-2 font-medium">Uploading images...</p>
                    <p className="text-sm text-blue-500">Please wait while we upload your images</p>
                  </div>
                ) : (
                  <>
                    <FiUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-2 font-medium">
                      {imagesPreview.length > 0 ? 'Add more images' : 'Upload product images'}
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      Select multiple images at once (PNG, JPG, GIF up to 8MB each)
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={uploadingImage}
                      className="hidden"
                      id="image-upload"
                      multiple
                    />
                    <label
                      htmlFor="image-upload"
                      className={`inline-flex items-center px-6 py-3 border border-transparent rounded-lg font-medium transition-colors cursor-pointer ${
                        uploadingImage 
                          ? 'bg-gray-400 text-white cursor-not-allowed' 
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      <FiImage className="w-4 h-4 mr-2" />
                      {imagesPreview.length > 0 ? 'Add More Images' : 'Choose Images'}
                    </label>
                    <p className="text-xs text-gray-400 mt-3">
                      💡 Tip: You can select multiple images at once from your file browser
                    </p>
                  </>
                )}
              </div>
            )}
            
            {errors.image && (
              <p className="mt-3 text-sm text-red-600 flex items-center">
                <FiAlertCircle className="w-4 h-4 mr-1" />
                {errors.image}
              </p>
            )}

            {imagesPreview.length >= MAX_IMAGES && (
              <p className="mt-3 text-sm text-amber-600 flex items-center">
                <FiAlertCircle className="w-4 h-4 mr-1" />
                Maximum number of images reached. Remove an image to add a new one.
              </p>
            )}
          </div>

          {/* Form Actions */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={loading || uploadingImage}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || uploadingImage}
                className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin w-4 h-4 mr-2" />
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <FiSave className="w-4 h-4 mr-2" />
                    {isEditing ? 'Update Product' : 'Create Product'}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;