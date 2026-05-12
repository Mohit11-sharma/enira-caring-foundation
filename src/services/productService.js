import { apiService } from './api';

class ProductService {
  // Get all products with pagination and filters
  async getProducts(params = {}) {
    try {
      
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.per_page) queryParams.append('per_page', params.per_page);
      if (params.search) queryParams.append('search', params.search);
      if (params.category) queryParams.append('category', params.category);
      if (params.status) queryParams.append('status', params.status);
      if (params.sort_by) queryParams.append('sort_by', params.sort_by);
      if (params.sort_order) queryParams.append('sort_order', params.sort_order);

      const queryString = queryParams.toString();
      const endpoint = queryString ? `/products?${queryString}` : '/products';
      
      
      const response = await apiService.get(endpoint);
      
      return response;
    } catch (error) {
      
      throw error;
    }
  }

  // Get single product by ID
  async getProduct(id) {
    try {
      
      const response = await apiService.get(`/products/${id}`);
      
      return response;
    } catch (error) {

      throw error;
    }
  }

  // Create new product
  async createProduct(productData) {
    try {
      
      // Ensure the data format matches what the backend expects
      const formattedData = {
        name: productData.name?.toString() || '',
        description: productData.description?.toString() || '',
        category: productData.category?.toString() || '',
        price: parseFloat(productData.price) || 0,
        stock_quantity: parseInt(productData.stock_quantity) || 0,
        sku: productData.sku?.toString() || '',
        // Keep single image for backward compatibility
        image: productData.image?.toString() || '',
        // New: support multiple images as array of URLs
        images: Array.isArray(productData.images) ? productData.images : (productData.images ? [productData.images] : []),
        status: productData.status?.toLowerCase() || 'active'
      };
      
      
      // Validate required fields before sending
      const requiredFields = ['name', 'category', 'price', 'stock_quantity'];
      const missingFields = requiredFields.filter(field => {
        const value = formattedData[field];
        return value === undefined || value === null || value === '' || 
               (typeof value === 'number' && isNaN(value));
      });
      
      if (missingFields.length > 0) {
        
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }
      
      const response = await apiService.post('/products', formattedData);
      
      return response;
    } catch (error) {
      
      throw error;
    }
  }

  // Update existing product
  async updateProduct(id, productData) {
    try {
      
      // Format data similar to create
      const formattedData = {
        ...(productData.name && { name: productData.name.toString() }),
        ...(productData.description !== undefined && { description: productData.description.toString() }),
        ...(productData.category && { category: productData.category.toString() }),
        ...(productData.price !== undefined && { price: parseFloat(productData.price) }),
        ...(productData.stock_quantity !== undefined && { stock_quantity: parseInt(productData.stock_quantity) }),
        ...(productData.sku !== undefined && { sku: productData.sku.toString() }),
        // Backwards compatible single image
        ...(productData.image !== undefined && { image: productData.image.toString() }),
        // New: images array
        ...(productData.images !== undefined && { images: Array.isArray(productData.images) ? productData.images : [productData.images] }),
        ...(productData.status && { status: productData.status.toLowerCase() })
      };
      
      
      const response = await apiService.put(`/products/${id}`, formattedData);
      
      return response;
    } catch (error) {
      
      throw error;
    }
  }

  // Delete product
  async deleteProduct(id) {
    try {
      
      const response = await apiService.delete(`/products/${id}`);
     
      return response;
    } catch (error) {
      
      throw error;
    }
  }

  // Get product categories
  async getCategories() {
    try {

      const response = await apiService.get('/product-categories');
      
      return response;
    } catch (error) {
      
      throw error;
    }
  }

  // Create new category
  async createCategory(categoryData) {
    try {
     
      const response = await apiService.post('/product-categories', categoryData);
     
      return response;
    } catch (error) {
      
      throw error;
    }
  }

  // Update product status
  async updateProductStatus(id, status) {
    try {
     
      const response = await apiService.put(`/products/${id}/status`, { status });
     
      return response;
    } catch (error) {
    
      throw error;
    }
  }

  // Bulk operations
  async bulkDeleteProducts(productIds) {
    try {
     
      const response = await apiService.post('/products/bulk-delete', { ids: productIds });
     
      return response;
    } catch (error) {
      
      throw error;
    }
  }

  async bulkUpdateStatus(productIds, status) {
    try {
      
      const response = await apiService.post('/products/bulk-status', { ids: productIds, status });
     
      return response;
    } catch (error) {
    
      throw error;
    }
  }
}

export const productService = new ProductService();