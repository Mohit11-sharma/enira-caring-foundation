'use client';

import React, { useState, useEffect } from 'react';
import {
  FiPackage,
  FiSearch,
  FiFilter,
  FiDownload,
  FiRefreshCw,
  FiEye,
  FiEdit,
  FiTruck,
  FiUser,
  FiCalendar,
  FiDollarSign,
  FiMapPin,
  FiPhone,
  FiMail,
  FiX,
  FiCheck,
  FiClock,
  FiAlertCircle,
  FiMoreVertical,
  FiArrowUp,
  FiArrowDown,
  FiShoppingBag,
  FiCreditCard,
  FiFileText,
  FiPrinter
} from 'react-icons/fi';
import { orderService } from '../../services/orderService';

const OrderPage = () => {
  // State management
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(15); // <-- Fix here

  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  // UI state
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [orderToUpdate, setOrderToUpdate] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  // Order statuses configuration
  const orderStatuses = [
    { value: 'all', label: 'All Orders', count: 0 },
    { value: 'pending', label: 'Pending', count: 0, color: 'bg-yellow-100 text-yellow-800' },
    { value: 'processing', label: 'Processing', count: 0, color: 'bg-blue-100 text-blue-800' },
    { value: 'shipped', label: 'Shipped', count: 0, color: 'bg-purple-100 text-purple-800' },
    { value: 'delivered', label: 'Delivered', count: 0, color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelled', count: 0, color: 'bg-red-100 text-red-800' },
    { value: 'refunded', label: 'Refunded', count: 0, color: 'bg-gray-100 text-gray-800' }
  ];

  // Load orders on component mount and when filters change
  useEffect(() => {
    loadOrders();
  }, [currentPage, statusFilter, sortBy, sortOrder, dateFilter]);

  // Filter orders when search term changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== '') {
        setCurrentPage(1);
        loadOrders();
      } else {
        loadOrders();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        per_page: itemsPerPage,
        sort_by: sortBy,
        sort_order: sortOrder,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchTerm || undefined,
        date_filter: dateFilter !== 'all' ? dateFilter : undefined,
      };

      const response = await orderService.getAdminOrders(params);

      // Use the correct response structure

      const mappedOrders = response.data.map(order => ({
        ...order,
        customer_name: order.shipping_name,
        customer_email: order.shipping_email,
        customer_phone: order.shipping_phone,
        items_count: order.items?.length || 0,
        items: order.items?.map(item => ({
          name: item.product_name || item.product?.name,
          quantity: item.quantity,
          price: parseFloat(item.unit_price)
        })) || []
      }));

      setOrders(mappedOrders);
      setTotalPages(response.data.last_page || 1);
      setTotalOrders(response.data.total || mappedOrders.length);

    } catch (err) {
      setError('Failed to load orders');
      setOrders([]);
      setTotalOrders(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const generateMockOrders = () => {
    return [
      {
        id: 1,
        order_number: 'ORD-2024-001',
        customer_name: 'John Doe',
        customer_email: 'john.doe@example.com',
        customer_phone: '+1 (555) 123-4567',
        status: 'pending',
        total_amount: 299.99,
        created_at: '2024-01-15T10:30:00Z',
        items_count: 3,
        shipping_address: '123 Main St, New York, NY 10001',
        shipping_city: 'New York',
        shipping_state: 'NY',
        shipping_postal_code: '10001',
        payment_method: 'credit_card',
        payment_status: 'paid',
        items: [
          { name: 'iPhone 14 Pro', quantity: 1, price: 199.99 },
          { name: 'AirPods Pro', quantity: 2, price: 50.00 }
        ]
      },
      {
        id: 2,
        order_number: 'ORD-2024-002',
        customer_name: 'Jane Smith',
        customer_email: 'jane.smith@example.com',
        customer_phone: '+1 (555) 987-6543',
        status: 'processing',
        total_amount: 159.99,
        created_at: '2024-01-14T14:20:00Z',
        items_count: 2,
        shipping_address: '456 Oak Ave, Los Angeles, CA 90210',
        shipping_city: 'Los Angeles',
        shipping_state: 'CA',
        shipping_postal_code: '90210',
        payment_method: 'paypal',
        payment_status: 'paid',
        items: [
          { name: 'Samsung Galaxy S23', quantity: 1, price: 159.99 }
        ]
      },
      {
        id: 3,
        order_number: 'ORD-2024-003',
        customer_name: 'Mike Johnson',
        customer_email: 'mike.johnson@example.com',
        customer_phone: '+1 (555) 456-7890',
        status: 'shipped',
        total_amount: 79.99,
        created_at: '2024-01-13T09:15:00Z',
        items_count: 1,
        shipping_address: '789 Pine St, Chicago, IL 60601',
        shipping_city: 'Chicago',
        shipping_state: 'IL',
        shipping_postal_code: '60601',
        payment_method: 'credit_card',
        payment_status: 'paid',
        items: [
          { name: 'Wireless Headphones', quantity: 1, price: 79.99 }
        ]
      },
      {
        id: 4,
        order_number: 'ORD-2024-004',
        customer_name: 'Sarah Wilson',
        customer_email: 'sarah.wilson@example.com',
        customer_phone: '+1 (555) 321-0987',
        status: 'delivered',
        total_amount: 199.99,
        created_at: '2024-01-12T16:45:00Z',
        items_count: 4,
        shipping_address: '321 Elm St, Miami, FL 33101',
        shipping_city: 'Miami',
        shipping_state: 'FL',
        shipping_postal_code: '33101',
        payment_method: 'credit_card',
        payment_status: 'paid',
        items: [
          { name: 'Laptop Stand', quantity: 2, price: 49.99 },
          { name: 'USB-C Hub', quantity: 2, price: 50.00 }
        ]
      },
      {
        id: 5,
        order_number: 'ORD-2024-005',
        customer_name: 'Robert Brown',
        customer_email: 'robert.brown@example.com',
        customer_phone: '+1 (555) 654-3210',
        status: 'cancelled',
        total_amount: 349.99,
        created_at: '2024-01-11T11:30:00Z',
        items_count: 2,
        shipping_address: '654 Maple Ave, Seattle, WA 98101',
        shipping_city: 'Seattle',
        shipping_state: 'WA',
        shipping_postal_code: '98101',
        payment_method: 'credit_card',
        payment_status: 'refunded',
        items: [
          { name: 'MacBook Pro M2', quantity: 1, price: 299.99 },
          { name: 'Magic Mouse', quantity: 1, price: 50.00 }
        ]
      }
    ];
  };

  const handleStatusUpdate = async (orderId, newOrderStatus) => {
    try {
      setLoading(true);
      await orderService.updateOrderStatus(orderId, newOrderStatus);

      // Update local state
      setOrders(prev => prev.map(order =>
        order.id === orderId
          ? { ...order, status: newOrderStatus }
          : order
      ));

      setShowStatusModal(false);
      setOrderToUpdate(null);
      setNewStatus('');

    } catch (err) {

      setError('Failed to update order status');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderSelect = (orderId) => {
    setSelectedOrders(prev => {
      if (prev.includes(orderId)) {
        return prev.filter(id => id !== orderId);
      } else {
        return [...prev, orderId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map(order => order.id));
    }
  };

  const getStatusColor = (status) => {
    const statusConfig = orderStatuses.find(s => s.value === status);
    return statusConfig?.color || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return <FiClock className="w-4 h-4" />;
      case 'processing': return <FiRefreshCw className="w-4 h-4" />;
      case 'shipped': return <FiTruck className="w-4 h-4" />;
      case 'delivered': return <FiCheck className="w-4 h-4" />;
      case 'cancelled': return <FiX className="w-4 h-4" />;
      case 'refunded': return <FiArrowUp className="w-4 h-4" />;
      default: return <FiPackage className="w-4 h-4" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    if (searchTerm) {
      return (
        order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return true;
  });

  if (loading && orders.length === 0) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      setLoading(true);
      await orderService.cancelOrder(orderId, 'Deleted by admin');
      setOrders(prev => prev.filter(order => order.id !== orderId));
      setSelectedOrders(prev => prev.filter(id => id !== orderId));
      setShowOrderModal(false);
      setOrderToUpdate(null);
      setNewStatus('');
      setError(null);
    } catch (err) {
      setError('Failed to delete order');
    } finally {
      setLoading(false);
    }
  };

  const handlePrintInvoice = async (orderId) => {
    try {
      setLoading(true);
      const downloadUrl = await orderService.printInvoice(orderId);
      // Create a temporary link to trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `invoice_order_${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError('Failed to generate invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async (orderId, invoiceId) => {
    try {
      setLoading(true);
      let id = orderId;
      
      // Download the invoice PDF
      const downloadUrl = await orderService.downloadInvoicePdf(id);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `invoice_${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError(err.message || 'Failed to download invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
                <p className="text-gray-600 mt-1">
                  Track and manage all customer orders ({totalOrders} total orders)
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={loadOrders}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FiRefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </button>
                <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <FiDownload className="w-4 h-4 mr-2" />
                  Export Orders
                </button>
              </div>
            </div>
          </div>

          {/* Status Overview */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {orderStatuses.map((status) => {
                const count = status.value === 'all'
                  ? totalOrders
                  : orders.filter(order => order.status === status.value).length;

                return (
                  <button
                    key={status.value}
                    onClick={() => setStatusFilter(status.value)}
                    className={`p-4 rounded-lg border transition-all ${statusFilter === status.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-lg ${status.color || 'bg-gray-100'}`}>
                        {getStatusIcon(status.value)}
                      </div>
                      <span className="text-2xl font-bold text-gray-900">{count}</span>
                    </div>
                    <p className="text-sm text-gray-600 text-left">{status.label}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filters and Search */}
          <div className="p-6 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search orders, customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Date Filter */}
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="this_week">This Week</option>
                <option value="this_month">This Month</option>
                <option value="last_month">Last Month</option>
              </select>

              {/* Sort */}
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="created_at-desc">Newest First</option>
                <option value="created_at-asc">Oldest First</option>
                <option value="total_amount-desc">Highest Value</option>
                <option value="total_amount-asc">Lowest Value</option>
                <option value="customer_name-asc">Customer A-Z</option>
                <option value="customer_name-desc">Customer Z-A</option>
              </select>

              {/* Items per page */}
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={10}>10 per page</option>
                <option value={15}>15 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>

            {/* Bulk Actions */}
            {selectedOrders.length > 0 && (
              <div className="mt-4 flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
                <span className="text-sm text-blue-800">
                  {selectedOrders.length} order{selectedOrders.length > 1 ? 's' : ''} selected
                </span>
                <div className="flex gap-2">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors">
                    Update Status
                  </button>
                  <button className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors">
                    Export Selected
                  </button>
                  <button
                    onClick={() => setSelectedOrders([])}
                    className="border border-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-50 transition-colors"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {error && (
            <div className="p-4 bg-red-50 border-b border-red-200">
              <div className="flex items-center">
                <FiAlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedOrders.length === orders.length && orders.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <FiPackage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                      <p className="text-gray-500">
                        {searchTerm || statusFilter !== 'all'
                          ? 'Try adjusting your search or filters'
                          : 'No orders have been placed yet'
                        }
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order.id)}
                          onChange={() => handleOrderSelect(order.id)}
                          className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-blue-600">
                            {order.order_number}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.items_count} item{order.items_count !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-sm font-medium">
                              {order.customer_name?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {order.customer_name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {order.customer_email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            setOrderToUpdate(order);
                            setNewStatus(order.status);
                            setShowStatusModal(true);
                          }}
                          className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full transition-colors hover:opacity-80 ${getStatusColor(order.status)}`}
                        >
                          {getStatusIcon(order.status)}
                          <span className="ml-1">
                            {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                          </span>
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          ${Number(order.total_amount).toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.payment_method}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {new Date(order.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(order.created_at).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowOrderModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="View Details"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setOrderToUpdate(order);
                              setNewStatus(order.status);
                              setShowStatusModal(true);
                            }}
                            className="text-green-600 hover:text-green-900 transition-colors"
                            title="Edit Status"
                          >
                            <FiEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Delete Order"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalOrders)} of {totalOrders} orders
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded text-sm transition-colors ${currentPage === page
                          ? 'bg-blue-500 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return <span key={page} className="px-2 text-gray-400">...</span>;
                  }
                  return null;
                })}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Details Modal */}
        {showOrderModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Order Details - {selectedOrder.order_number}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Placed on {new Date(selectedOrder.created_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Order Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Status</span>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}>
                        {getStatusIcon(selectedOrder.status)}
                        <span className="ml-1">
                          {selectedOrder.status?.charAt(0).toUpperCase() + selectedOrder.status?.slice(1)}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Total Amount</span>
                      <span className="text-lg font-semibold text-gray-900">
                        ${Number(selectedOrder.total_amount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Payment</span>
                      <span className="text-sm font-medium text-green-600">
                        {selectedOrder.payment_status || 'Paid'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FiUser className="w-5 h-5 mr-2" />
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium text-gray-900">{selectedOrder.customer_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">{selectedOrder.customer_email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium text-gray-900">{selectedOrder.customer_phone}</p>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FiMapPin className="w-5 h-5 mr-2" />
                    Shipping Address
                  </h3>
                  <p className="text-gray-900">{selectedOrder.shipping_address}</p>
                  <p className="text-gray-600">
                    {selectedOrder.shipping_city}, {selectedOrder.shipping_state} {selectedOrder.shipping_postal_code}
                  </p>
                </div>

                {/* Order Items */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FiShoppingBag className="w-5 h-5 mr-2" />
                    Order Items ({selectedOrder.items_count})
                  </h3>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-4 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mr-4">
                            <FiPackage className="w-6 h-6 text-gray-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">${item.price?.toFixed(2)}</p>
                          <p className="text-sm text-gray-600">
                            ${(item.price * item.quantity)?.toFixed(2)} total
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                {/* <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                  onClick={() => handlePrintInvoice(selectedOrder.id)}
                  disabled={loading}
                >
                  <FiPrinter className="w-4 h-4 mr-2" />
                  Print Invoice
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                  onClick={() => handleDownloadInvoice(selectedOrder.order_number, selectedOrder.order_number)}
                  disabled={loading}
                >
                  {loading ? (
                    <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                  ) : (
                    <FiDownload className="w-4 h-4 mr-2" />
                  )}
                  {loading ? 'Downloading...' : 'Download Invoice PDF'}
                </button> */}
              </div>
            </div>
          </div>
        )}

        {/* Status Update Modal */}
        {showStatusModal && orderToUpdate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Update Order Status</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Order: {orderToUpdate.order_number}
                </p>
              </div>

              <div className="p-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select New Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {orderStatuses.filter(s => s.value !== 'all').map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowStatusModal(false);
                    setOrderToUpdate(null);
                    setNewStatus('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleStatusUpdate(orderToUpdate.id, newStatus)}
                  disabled={loading || newStatus === orderToUpdate.status}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;