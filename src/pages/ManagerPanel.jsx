import React from "react";
import AllProduct from "./Admin/AllProduct";
import AddProduct from "./Admin/AddProduct";
import OrderPage from "./Admin/OrderPage";
import CouponDiscountPage from "./Admin/Coupon&Discount";
import { Routes, Route, NavLink } from "react-router-dom";

export default function ManagerPanel() {
  return (
    <div className="min-h-screen mt-20 bg-gray-50">
      <div className="bg-white shadow-sm border-b mb-6">
        <div className="max-w-7xl mx-auto px-4 py-6 flex gap-4">
          <NavLink
            to="/manager/products"
            className={({ isActive }) =>
              `px-4 py-2 rounded font-semibold ${
                isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-blue-50"
              }`
            }
          >
            Products
          </NavLink>
          <NavLink
            to="/manager/orders"
            className={({ isActive }) =>
              `px-4 py-2 rounded font-semibold ${
                isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-blue-50"
              }`
            }
          >
            Orders
          </NavLink>
          <NavLink
            to="/manager/coupons"
            className={({ isActive }) =>
              `px-4 py-2 rounded font-semibold ${
                isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-blue-50"
              }`
            }
          >
            Coupons & Discounts
          </NavLink>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4">
        <Routes>
          <Route path="products" element={<AllProduct />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/edit/:id" element={<AddProduct />} />
          <Route path="orders" element={<OrderPage />} />
          <Route path="coupons" element={<CouponDiscountPage />} />
        </Routes>
      </div>
    </div>
  );
}