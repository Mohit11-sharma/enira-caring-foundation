import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { FaArrowRight, FaBars, FaUser, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import { FaBoxesPacking } from "react-icons/fa6";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About us", href: "/about" },
  { name: "Shop", href: "/shop" },
  { name: "Donate", href: "/donations" },
  { name: "Contact", href: "/contact" },
  ];

export default function Navbar() {
  const [hovered, setHovered] = useState(false);
  const [joinHovered, setJoinHovered] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const { isAuthenticated, user, logout, loading } = useAuth();

  const location = useLocation();
  const currentPath = location.pathname;

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };

  const getUserInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const UserAvatar = ({ user, size = "w-8 h-8" }) => {
    if (user?.photo) {
      return (
        <img
          src={user.photo}
          alt={user.name || "User"}
          className={`${size} rounded-full object-cover border-2 border-white shadow-sm`}
        />
      );
    }

    return (
      <div
        className={`${size} rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold`}
      >
        {getUserInitials(user?.name)}
      </div>
    );
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-500 ${
        hovered ? "bg-green-800/90" : "bg-white/90"
      } shadow-lg border-b border-gray-200`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 py-3 md:py-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-3 md:gap-4">
  <Link to="/">
    <img
      src="/media/logo.png"
      alt="Erina Logo"
      width={60}
      height={40}
      className="-mt-3 cursor-pointer"
    />
  </Link>

  <span
    className={`font-extrabold text-xl md:text-2x1 tracking-tight uppercase ${
      hovered ? "text-white" : "text-gray-900"
    } transition-colors`}
  >
    Enira Caring Foundation
  </span>
</div>


        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 md:gap-10">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`font-medium text-base md:text-lg px-2 md:px-3 py-1 rounded transition-colors duration-200
                ${currentPath === item.href
                  ? "bg-yellow-400 text-white shadow font-bold"
                  : hovered
                  ? "text-white hover:text-yellow-400"
                  : "text-gray-900 hover:text-blue-600"
                }`}
            >
              {item.name}
            </Link>
          ))}

          {/* Auth Section */}
          {loading ? (
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
          ) : isAuthenticated && user ? (
            /* User Menu */
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 border-green-400 transition-all duration-300 ${
                  hovered
                    ? "bg-green-600 text-white"
                    : "bg-green-50 text-green-700"
                }`}
              >
                <UserAvatar user={user} />
                <span className="font-medium">
                  {user.name?.split(" ")[0] || "User"}
                </span>
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <UserAvatar user={user} size="w-10 h-10" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                        {user.phone && (
                          <p className="text-xs text-gray-500">{user.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <FaUser size={14} />
                    Profile
                  </Link>
                  <Link
                    to="/track"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <FaBoxesPacking size={14} />
                    Track Your Order
                  </Link>

                  {user?.role === "admin" ? (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <FaUser size={14} />
                      Admin Profile
                    </Link>
                  ) : user?.role === "manager" ? (
                    <Link
                      to="/manager/products"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <FaUser size={14} />
                      Manager Panel
                    </Link>
                  ):null}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <FaSignOutAlt size={14} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* JOIN US Button */
            <div className="relative flex items-center">
              <Link to="/auth">
                <button
                  className={`group flex items-center gap-2 overflow-hidden rounded-full px-5 md:px-7 py-2 font-bold border-2 border-yellow-400 bg-yellow-400/10 text-yellow-500 shadow-md transition-all duration-300
                    ${
                      joinHovered
                        ? "bg-yellow-400 text-white border-yellow-400"
                        : ""
                    }
                  `}
                  onMouseEnter={() => setJoinHovered(true)}
                  onMouseLeave={() => setJoinHovered(false)}
                >
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                    JOIN US
                  </span>
                  <span
                    className={`relative z-10 transition-transform duration-500 ${
                      joinHovered
                        ? "-translate-x-2 opacity-100"
                        : "translate-x-6 opacity-0"
                    }`}
                  >
                    <FaArrowRight size={18} />
                  </span>
                  <span
                    className={`absolute left-0 top-0 h-full w-full rounded-full transition-all duration-500 ease-in-out
                      ${joinHovered ? "bg-yellow-400 opacity-80" : "opacity-0"}
                    `}
                    aria-hidden="true"
                  />
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex items-center justify-center p-2 rounded text-yellow-500 border z-50 border-yellow-400"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Open navigation"
        >
          <FaBars size={22} />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-0 left-0 w-full bg-white/95 shadow-lg border-b border-gray-200 transition-all duration-300 z-40 ${
          mobileOpen ? "max-h-screen py-6" : "max-h-0 overflow-hidden py-0"
        }`}
        style={{ transitionProperty: "max-height, padding" }}
      >
        <div className="flex flex-col items-center gap-6">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="font-medium text-lg px-4 py-2 rounded text-gray-900 hover:text-blue-600 transition-colors duration-200 w-full text-center"
              onClick={() => setMobileOpen(false)}
            >
              {item.name}
            </Link>
          ))}

          {/* Mobile Auth Section */}
          {loading ? (
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
          ) : isAuthenticated && user ? (
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-3">
                <UserAvatar user={user} size="w-12 h-12" />
                <div className="text-center">
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <Link
                to="/profile"
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors rounded"
                onClick={() => setMobileOpen(false)}
              >
                <FaUser size={14} />
                Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors rounded"
              >
                <FaSignOutAlt size={14} />
                Logout
              </button>
            </div>
          ) : (
            <Link to="/auth">
              <button
                className={`flex items-center gap-2 overflow-hidden rounded-full font-bold border-2 border-yellow-400 bg-yellow-400/10 text-yellow-500 shadow-md transition-all duration-300
                  ${
                    joinHovered
                      ? "bg-yellow-400 text-white border-yellow-400"
                      : ""
                  }
                `}
                onMouseEnter={() => setJoinHovered(true)}
                onMouseLeave={() => setJoinHovered(false)}
                onClick={() => setMobileOpen(false)}
              >
                <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                  JOIN US
                </span>
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
