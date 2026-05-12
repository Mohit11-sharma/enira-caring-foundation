import { useState, useEffect, useCallback, useMemo } from 'react';
import { productService } from '../services/productService';

export const useProducts = (initialParams = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 12,
    total: 0
  });

  // Memoize the initial params to prevent infinite re-renders
  const memoizedInitialParams = useMemo(() => initialParams, [
    initialParams.category,
    initialParams.search,
    initialParams.status,
    initialParams.per_page,
    initialParams.sort_by,
    initialParams.sort_order
  ]);

  const fetchProducts = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const mergedParams = { 
        per_page: 12,
        ...memoizedInitialParams, 
        ...params 
      };
      
    
      const response = await productService.getProducts(mergedParams);

      if (response.success) {
        setProducts(response.data.data || response.data || []);
        setPagination({
          current_page: response.data.current_page || 1,
          last_page: response.data.last_page || 1,
          per_page: response.data.per_page || 12,
          total: response.data.total || 0
        });
      } else {
        throw new Error(response.message || 'Failed to fetch products');
      }
    } catch (err) {
    
      setError(err.message || 'Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [memoizedInitialParams]);

  // Initial fetch - only run once when hook mounts or params change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const refetch = useCallback((params = {}) => {
    return fetchProducts(params);
  }, [fetchProducts]);

  const nextPage = useCallback(() => {
    if (pagination.current_page < pagination.last_page) {
      fetchProducts({ page: pagination.current_page + 1 });
    }
  }, [pagination.current_page, pagination.last_page, fetchProducts]);

  const previousPage = useCallback(() => {
    if (pagination.current_page > 1) {
      fetchProducts({ page: pagination.current_page - 1 });
    }
  }, [pagination.current_page, fetchProducts]);

  const goToPage = useCallback((page) => {
    if (page >= 1 && page <= pagination.last_page) {
      fetchProducts({ page });
    }
  }, [pagination.last_page, fetchProducts]);

  return {
    products,
    loading,
    error,
    pagination,
    refetch,
    nextPage,
    previousPage,
    goToPage
  };
};

export default useProducts;