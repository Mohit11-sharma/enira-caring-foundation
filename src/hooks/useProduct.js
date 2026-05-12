import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/productService';

export const useProduct = (productId) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProduct = useCallback(async (id) => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      
   
      
      const response = await productService.getProduct(id);

      if (response.success) {
        setProduct(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch product');
      }
    } catch (err) {
     
      setError(err.message || 'Failed to fetch product');
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    }
  }, [productId, fetchProduct]);

  const refetch = useCallback(() => {
    if (productId) {
      return fetchProduct(productId);
    }
  }, [productId, fetchProduct]);

  return {
    product,
    loading,
    error,
    refetch
  };
};

export default useProduct;