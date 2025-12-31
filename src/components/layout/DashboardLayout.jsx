import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";

const themes = {
  admin: {
    gradient: "from-blue-600 to-purple-600",
    active: "bg-blue-500",
    text: "text-blue-600",
    hover: "hover:bg-blue-50",
  },
  manager: {
    gradient: "from-orange-500 to-red-600",
    active: "bg-orange-500",
    text: "text-orange-600",
    hover: "hover:bg-orange-50",
  },
  member: {
    gradient: "from-green-500 to-blue-600",
    active: "bg-green-500",
    text: "text-green-600",
    hover: "hover:bg-green-50",
  },
};

const SidebarContent = ({
  menuItems,
  onLinkClick,
  themeColor,
  dashboardTitle,
}) => {
  const location = useLocation();
  const { user } = useAuth();
  const currentTheme = themes[themeColor] || themes.admin;

  return (
    <div className="flex flex-col h-full">
      <div
        className={`flex items-center flex-shrink-0 px-4 h-16 bg-gradient-to-r ${currentTheme.gradient}`}
      >
        <h2 className="text-lg font-bold text-white">{dashboardTitle}</h2>
      </div>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <img
            src={
              user?.photoURL ||
              `https://ui-avatars.com/api/?name=${user?.name}&background=random`
            }
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {user?.name}
            </h3>
            <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onLinkClick}
              className={`group flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? `${currentTheme.active} text-white shadow-md`
                  : `text-gray-600 ${currentTheme.hover} hover:text-gray-900`
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

const DashboardLayout = ({
  children,
  menuItems,
  dashboardTitle,
  themeColor,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();
  const currentTheme = themes[themeColor] || themes.admin;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl lg:hidden"
            >
              <SidebarContent
                menuItems={menuItems}
                onLinkClick={() => setIsSidebarOpen(false)}
                themeColor={themeColor}
                dashboardTitle={dashboardTitle}
              />
            </motion.div>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            ></div>
          </>
        )}
      </AnimatePresence>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-white shadow-md">
          <SidebarContent
            menuItems={menuItems}
            onLinkClick={() => {}}
            themeColor={themeColor}
            dashboardTitle={dashboardTitle}
          />
        </div>
      </div>

      <div className="lg:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow-sm">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              {/* Can add a search bar here later */}
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <span
                className={`hidden sm:inline-block text-sm font-medium ${currentTheme.text}`}
              >
                Welcome, {user?.name}
              </span>
            </div>
          </div>
        </div>

        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
