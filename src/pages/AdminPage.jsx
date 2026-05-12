'use client';

import React, { useEffect, useState } from "react";
import {
  FiHome,
  FiShoppingBag,
  FiPackage,
  FiPlus,
  FiTag,
  FiUsers,
  FiMenu,
  FiX,
  FiSettings,
  FiLogOut,
  FiStar,
  FiSearch,
  FiBell,
  FiChevronDown,
  FiChevronRight,
  FiImage,
  FiUpload,
  FiLoader,
  FiSave,
  FiEdit,
  FiTrash2,
  FiFileText,
  FiEye,
  FiRefreshCw,
  FiDownload,
  FiGift,
  FiBarChart,
  FiTrendingUp,
  FiDollarSign,
  FiShoppingCart,
  FiCloudSnow,
  FiInstagram
} from 'react-icons/fi';
import AllProduct from './Admin/AllProduct';
import { productService } from '../services/productService';
import OrderPage from './Admin/OrderPage';
import CouponDiscountPage from './Admin/Coupon&Discount';
import TeamMembers from './Admin/TeamMembers';
import Donations from './Admin/Donations';
import DocumentRequests from './Admin/DocumentRequests';
import UploadSlides from './Admin/UploadSlides';
import InstagramLinks from './Admin/InstagramLinks';
import orderService from "../services/orderService";
import donationService from "../services/donationService";
import authService from "../services/authService";
import { useAuth } from "../contexts/AuthContext";
import { uploadImageToLaravel } from "../utils/uploadImage";


// Sidebar Component
const AdminSidebar = ({ isOpen, onClose, activeTab, setActiveTab }) => {
  const [expandedMenu, setExpandedMenu] = useState('products');
  const { isAuthenticated, user, logout, loading } = useAuth();
  

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: FiHome,
      description: 'Overview and analytics'
    },
    {
      id: 'document-requests',
      label: 'Document Requests',
      icon: FiFileText,
      description: 'Manage document requests'
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: FiShoppingBag,
      description: 'Manage customer orders'
    },
    {
      id: 'products',
      label: 'Products',
      icon: FiPackage,
      description: 'Product management',
      submenu: [
        { id: 'all-products', label: 'All Products', description: 'View and manage all products' },
        { id: 'add-product', label: 'Add Product', description: 'Create new product' },
        { id: 'coupons', label: 'Coupons & Discounts', description: 'Manage promotional offers' }
      ]
    },
    {
      id: 'team',
      label: 'Team Members',
      icon: FiUsers,
      description: 'Manage team access'
    },
    {
      id: 'donations',
      label: 'Donations',
      icon: FiGift,
      description: 'View all donations'
    },
    {
      id: 'instagram-links',
      label: 'Instagram Links',
      icon: FiInstagram,
      description: 'Manage Instagram posts'
    }
    // {
    //   id: 'upload',
    //   label: 'Upload Slides',
    //   icon: FiCloudSnow,
    //   description: 'Upload Image for Slides'
    // }
  ];

  const handleMenuClick = (itemId) => {
    if (itemId === 'products') {
      setExpandedMenu(expandedMenu === 'products' ? null : 'products');
    } else {
      setActiveTab(itemId);
      if (window.innerWidth < 1024) {
        onClose();
      }
    }
  };

  const handleSubmenuClick = (itemId) => {
    setActiveTab(itemId);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out border-r border-gray-200
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        

        {/* User Profile */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">AD</span>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <FiSettings className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => handleMenuClick(item.id)}
                className={`
                  w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 group
                  ${(activeTab === item.id || (item.submenu && item.submenu.some(sub => sub.id === activeTab)))
                    ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <div className={`
                  p-2 rounded-lg mr-3 transition-colors
                  ${(activeTab === item.id || (item.submenu && item.submenu.some(sub => sub.id === activeTab)))
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                  }
                `}>
                  <item.icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{item.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                </div>
                {item.submenu && (
                  <div className="transition-transform duration-200">
                    {expandedMenu === item.id ? (
                      <FiChevronDown className="w-4 h-4" />
                    ) : (
                      <FiChevronRight className="w-4 h-4" />
                    )}
                  </div>
                )}
              </button>

              {/* Submenu */}
              {item.submenu && expandedMenu === item.id && (
                <div className="ml-6 mt-2 space-y-1 animate-in slide-in-from-top-1 duration-200">
                  {item.submenu.map((subItem) => (
                    <button
                      key={subItem.id}
                      onClick={() => handleSubmenuClick(subItem.id)}
                      className={`
                        w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all duration-200
                        ${activeTab === subItem.id
                          ? 'bg-blue-100 text-blue-700 font-medium border-l-2 border-blue-500'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }
                      `}
                    >
                      <div className="font-medium">{subItem.label}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{subItem.description}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>


      </div>
    </>
  );
};

// Header Component
const AdminHeader = ({ onMenuClick, activeTab }) => {
  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return { title: 'Dashboard', subtitle: 'Overview and key metrics' };
      case 'orders': return { title: 'Orders Management', subtitle: 'Track and manage customer orders' };
      case 'all-products': return { title: 'All Products', subtitle: 'Manage your product inventory' };
      case 'add-product': return { title: 'Add New Product', subtitle: 'Create a new product listing' };
      case 'document-requests': return { title: 'Document Requests', subtitle: 'Manage and process document requests' };      
      case 'categories': return { title: 'Product Categories', subtitle: 'Organize your products' };
      case 'coupons': return { title: 'Coupons & Discounts', subtitle: 'Manage promotional offers' };
      case 'team': return { title: 'Team Members', subtitle: 'Manage team access and permissions' };
      case 'instagram-links': return { title: 'Instagram Links', subtitle: 'Manage Instagram posts for initiatives page' };
      default: return { title: 'Admin Panel', subtitle: 'Manage your platform' };
    }
  };

  const { title, subtitle } = getPageTitle();
  const { isAuthenticated, user, logout, loading } = useAuth();


  return (
    <header className="bg-white shadow-sm border-b mt-0 border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 mr-3 transition-colors"
          >
            <FiMenu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* <div className="relative hidden sm:block">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search anything..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80 text-sm"
            />
          </div> */}

          <button className="p-2 rounded-lg hover:bg-gray-100 relative transition-colors">
            
            
          </button>

          <div className="flex items-center space-x-2 pl-4 border-l border-gray-200">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">A</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">Super Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// Dashboard Content Component
const DashboardContent = ({ setActiveTab }) => {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    products: 0,
    donations: 0,
    team: 0,
    growth: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    setLoading(true);
    setErr("");
    Promise.all([
      // Orders stats
      orderService.getOrders({ per_page: 1 }).then(res => ({
        orders: res.total || 0,
        revenue: res.data?.reduce((sum, o) => sum + (parseFloat(o.total_amount) || 0), 0) || 0,
      })),
      // Products count
      productService.getProducts({ per_page: 1 }).then(res => ({
        products: res.total || 0,
      })),
      // Recent orders
      orderService.getOrders({ per_page: 4, sort_by: "created_at", sort_order: "desc" }).then(res => res.data || []),
      // Donations stats
      donationService.getAll().then(res => ({
        donations: Array.isArray(res.data)
          ? res.data.reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0)
          : 0,
      })),
      // Team stats
      authService.getTeamMembers().then(res => ({
        team: Array.isArray(res) ? res.length : 0,
      })),
    ])
      .then(([orderStats, productStats, recent, donationStats, teamStats]) => {
        setStats({
          revenue: orderStats.revenue,
          orders: orderStats.orders,
          products: productStats.products,
          donations: donationStats.donations,
          team: teamStats.team,
          growth: 0, // You can calculate growth if you have previous period data
        });
        setRecentOrders(recent);
      })
      .catch(() => setErr("Failed to load dashboard data"))
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    {
      title: "Total Revenue",
      value: `₹${Number(stats.revenue).toLocaleString()}`,
      color: "bg-gradient-to-r from-green-500 to-emerald-600",
      icon: FiDollarSign,
    },
    {
      title: "Total Orders",
      value: stats.orders,
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      icon: FiShoppingCart,
    },
    {
      title: "Total Products",
      value: stats.products,
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      icon: FiPackage,
    },
    {
      title: "Total Donations",
      value: `₹${Number(stats.donations).toLocaleString()}`,
      color: "bg-gradient-to-r from-pink-500 to-pink-600",
      icon: FiTrendingUp,
    },
    {
      title: "Team Members",
      value: stats.team,
      color: "bg-gradient-to-r from-yellow-500 to-yellow-600",
      icon: FiUsers,
    },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome back, Admin! 👋</h2>
            <p className="text-blue-100">
              Here&apos;s what&apos;s happening with your NGO platform today.
            </p>
          </div>
          {/* <div className="hidden sm:block">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <FiBarChart className="w-10 h-10 text-white" />
            </div>
          </div> */}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <button
              className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer font-medium"
              onClick={() => setActiveTab("orders")}
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center text-gray-400 py-8">Loading...</div>
            ) : err ? (
              <div className="text-center text-red-500 py-8">{err}</div>
            ) : recentOrders.length === 0 ? (
              <div className="text-center text-gray-400 py-8">No recent orders.</div>
            ) : (
              recentOrders.map((order, index) => (
                <div
                  key={order.id || index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        {order.shipping_name
                          ? order.shipping_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                          : "U"}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {order.order_number || order.id}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.shipping_name || "Unknown"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.created_at
                          ? new Date(order.created_at).toLocaleString()
                          : ""}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 text-sm">
                      ₹{Number(order.total_amount).toFixed(2)}
                    </p>
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "processing"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            <FiSettings className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {[
              {
                label: "Add New Product",
                icon: FiPlus,
                color: "bg-blue-500 hover:bg-blue-600",
                action: "add-product",
              },
              {
                label: "Create Discount Coupon",
                icon: FiTag,
                color: "bg-green-500 hover:bg-green-600",
                action: "coupons",
              },
              {
                label: "Invite Team Member",
                icon: FiUsers,
                color: "bg-purple-500 hover:bg-purple-600",
                action: "team",
              },
            ].map((action, index) => (
              <button
                key={index}
                className={`w-full flex items-center p-4 rounded-lg transition-all duration-200 ${action.color} text-white group`}
                onClick={() => setActiveTab(action.action)}
              >
                <div className="p-2 bg-white bg-opacity-20 rounded-lg mr-4 group-hover:bg-opacity-30 transition-all">
                  <action.icon className="w-5 h-5" />
                </div>
                <span className="font-medium">{action.label}</span>
                <FiChevronRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Orders Content Component
const OrdersContent = () => <OrderPage />;

// Add Product Content Component with Multiple Image Support
const AddProductContent = ({ editingProduct = null, onCancel, onProductSaved }) => {
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
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);

  const MAX_IMAGES = 8;

  // Populate form if editing
  React.useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name || '',
        description: editingProduct.description || '',
        price: editingProduct.price || '',
        category: editingProduct.category || '',
        stock_quantity: editingProduct.stock_quantity || '',
        sku: editingProduct.sku || '',
        status: editingProduct.status || 'active',
        image: editingProduct.image || null,
        images: editingProduct.images || (editingProduct.image ? [editingProduct.image] : [])
      });
      
      if (editingProduct.images && Array.isArray(editingProduct.images) && editingProduct.images.length > 0) {
        setImagesPreview(editingProduct.images);
        setImagePreview(editingProduct.images[0] || null);
      } else if (editingProduct.image) {
        setImagePreview(editingProduct.image);
        setImagesPreview(editingProduct.image ? [editingProduct.image] : []);
      }
    } else {
      // Reset form for new product
      setFormData({
        name: '', description: '', price: '', category: '',
        stock_quantity: '', sku: '', status: 'active', image: null, images: []
      });
      setImagePreview(null);
      setImagesPreview([]);
      setPrimaryImageIndex(0);
    }
  }, [editingProduct]);

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
      setImagePreview(imagesPreview[0] || null);
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
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.stock_quantity || isNaN(formData.stock_quantity) || parseInt(formData.stock_quantity) < 0) {
      newErrors.stock_quantity = 'Valid stock quantity is required';
    }
    if (!editingProduct && (!formData.images || formData.images.length === 0)) {
      newErrors.image = 'At least one product image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

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

      let response;
      if (editingProduct) {
        response = await productService.updateProduct(editingProduct.id, productData);
        setSuccess('Product updated successfully!');
      } else {
        response = await productService.createProduct(productData);
        setSuccess('Product created successfully!');
      }

      setTimeout(() => {
        if (onProductSaved) {
          onProductSaved();
        }
      }, 1500);

    } catch (error) {
      console.error('Submit error:', error);
      if (error.response) {
        const errorData = error.response.data;
        if (errorData.errors && typeof errorData.errors === 'object') {
          setErrors(errorData.errors);
        } else {
          setErrors({
            general: errorData.message || `Failed to ${editingProduct ? 'update' : 'create'} product`
          });
        }
      } else if (error.message) {
        setErrors({ general: error.message });
      } else {
        setErrors({
          general: `An error occurred while ${editingProduct ? 'updating' : 'creating'} the product`
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {editingProduct ? 'Update the product details below' : 'Fill in the product details to create a new listing'}
                </p>
              </div>
              {editingProduct && (
                <button
                  onClick={onCancel}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  title="Cancel editing"
                >
                  <FiX className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          <div className="p-6">
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-5 h-5 text-green-500">✓</div>
                  </div>
                  <p className="ml-3 text-green-700 text-sm font-medium">{success}</p>
                </div>
              </div>
            )}

            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-5 h-5 text-red-500">⚠</div>
                  </div>
                  <p className="ml-3 text-red-700 text-sm font-medium">{errors.general}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="text-md font-medium text-gray-900 mb-4">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                      placeholder="Enter product name"
                    />
                    {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        className={`w-full border rounded-lg pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.price ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                        placeholder="0.00"
                      />
                    </div>
                    {errors.price && <p className="mt-2 text-sm text-red-600">{errors.price}</p>}
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Enter product description..."
                  />
                </div>
              </div>

              {/* Product Details */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="text-md font-medium text-gray-900 mb-4">Product Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.category ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                    >
                      <option value="">Select category</option>
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
                    {errors.category && <p className="mt-2 text-sm text-red-600">{errors.category}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity *</label>
                    <input
                      type="number"
                      name="stock_quantity"
                      value={formData.stock_quantity}
                      onChange={handleInputChange}
                      min="0"
                      className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.stock_quantity ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                      placeholder="0"
                    />
                    {errors.stock_quantity && <p className="mt-2 text-sm text-red-600">{errors.stock_quantity}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Product SKU"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Product Images - Multiple Upload */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-md font-medium text-gray-900">
                      Product Images {!editingProduct && '*'}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Upload up to {MAX_IMAGES} images ({imagesPreview.length}/{MAX_IMAGES})
                    </p>
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
                    {errors.image}
                  </p>
                )}

                {imagesPreview.length >= MAX_IMAGES && (
                  <p className="mt-3 text-sm text-amber-600 flex items-center">
                    Maximum number of images reached. Remove an image to add a new one.
                  </p>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  disabled={loading || uploadingImage}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || uploadingImage}
                  className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-medium shadow-sm"
                >
                  {loading ? (
                    <>
                      <FiLoader className="animate-spin w-4 h-4 mr-2" />
                      {editingProduct ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <FiSave className="w-4 h-4 mr-2" />
                      {editingProduct ? 'Update Product' : 'Create Product'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Team Members Content Component
const TeamContent = () => (
  <div className="p-6 bg-gray-50 min-h-screen">
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
            <p className="text-sm text-gray-500 mt-1">Manage team access and permissions</p>
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center">
            <FiPlus className="w-4 h-4 mr-2" />
            Add Member
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: 'John Doe', email: 'john@ngo.org', role: 'Super Admin', status: 'active', avatar: 'JD' },
            { name: 'Jane Smith', email: 'jane@ngo.org', role: 'Product Manager', status: 'active', avatar: 'JS' },
            { name: 'Mike Johnson', email: 'mike@ngo.org', role: 'Content Editor', status: 'inactive', avatar: 'MJ' },
            { name: 'Sarah Wilson', email: 'sarah@ngo.org', role: 'Marketing Manager', status: 'active', avatar: 'SW' }
          ].map((member, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">{member.avatar}</span>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                  {member.status}
                </span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">{member.name}</h4>
              <p className="text-sm text-gray-600 mb-2">{member.email}</p>
              <p className="text-sm text-blue-600 font-medium mb-4">{member.role}</p>
              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded text-sm hover:bg-blue-100 transition-colors">
                  Edit
                </button>
                <button className="flex-1 bg-red-50 text-red-600 py-2 px-3 rounded text-sm hover:bg-red-100 transition-colors">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Main AdminPage Component
const AdminPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingProduct, setEditingProduct] = useState(null);
  const [refreshProducts, setRefreshProducts] = useState(0);

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setActiveTab('add-product');
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setActiveTab('add-product');
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setActiveTab('all-products');
  };

  const handleProductSaved = () => {
    setEditingProduct(null);
    setActiveTab('all-products');
    setRefreshProducts(prev => prev + 1);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent setActiveTab={setActiveTab} />;
      case 'orders':
        return <OrdersContent />;
      case 'document-requests':
        return <DocumentRequests />;
      case 'all-products':
        return (
          <div className="p-6 bg-gray-50 min-h-screen">
            <AllProduct
              onEditProduct={handleEditProduct}
              onAddProduct={handleAddProduct}
              refreshTrigger={refreshProducts}
            />
          </div>
        );
      case 'add-product':
        return (
          <AddProductContent
            editingProduct={editingProduct}
            onCancel={handleCancelEdit}
            onProductSaved={handleProductSaved}
          />
        );
      case 'team':
        return <TeamMembers />;
      case 'coupons':
        return (
          <CouponDiscountPage />
        );
      case 'donations':
        return <Donations />;
      case 'upload':
        return <UploadSlides />;
      case 'instagram-links':
        return <InstagramLinks />;
      default:
        return <DashboardContent setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader
          onMenuClick={() => setSidebarOpen(true)}
          activeTab={activeTab}
        />

        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminPage;