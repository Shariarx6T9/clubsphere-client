import { useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { clubAPI, userAPI, paymentAPI } from "../../utils/api";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { path: "/dashboard/admin", label: "Overview", icon: "📊" },
    { path: "/dashboard/admin/users", label: "Manage Users", icon: "👥" },
    { path: "/dashboard/admin/clubs", label: "Manage Clubs", icon: "🏢" },
    { path: "/dashboard/admin/payments", label: "Payments", icon: "💳" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600">
          <h2 className="text-lg font-bold text-white">Admin Panel</h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* User Profile Section */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-b from-gray-50 to-white">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 p-0.5">
                <div className="w-full h-full rounded-full overflow-hidden bg-white">
                  <img
                    src={user?.photoURL || "https://via.placeholder.com/48"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                {user?.name}
              </h3>
              <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`group flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-400 to-purple-500 text-white shadow-lg transform scale-105"
                    : "text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-gray-900 hover:shadow-md"
                }`}
              >
                <span
                  className={`text-lg transition-transform duration-200 ${
                    isActive ? "scale-110" : "group-hover:scale-110"
                  }`}
                >
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
                {isActive && (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            ClubSphere Admin v1.0
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Enhanced Mobile Header */}
        <div className="lg:hidden bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            >
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
            <div className="flex items-center space-x-3">
              <h1 className="text-lg font-semibold text-gray-800">
                Admin Dashboard
              </h1>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {user?.name?.charAt(0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-500">
                Manage your platform efficiently
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">
                  System Online
                </span>
              </div>
            </div>
          </div>
        </div>

        <main className="p-6">{children}</main>
      </div>

      {/* Enhanced Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

const AdminOverview = () => {
  const { data: allClubs } = useQuery({
    queryKey: ["adminClubs"],
    queryFn: () => clubAPI.getAllForAdmin().then((res) => res.data),
  });

  const { data: users } = useQuery({
    queryKey: ["allUsers"],
    queryFn: () => userAPI.getAll().then((res) => res.data),
  });

  const { data: payments } = useQuery({
    queryKey: ["allPayments"],
    queryFn: () => paymentAPI.getAllPayments().then((res) => res.data),
  });

  const totalRevenue =
    payments?.reduce(
      (sum, payment) =>
        payment.status === "succeeded" ? sum + payment.amount : sum,
      0
    ) || 0;

  const pendingClubs =
    allClubs?.filter((club) => club.status === "pending").length || 0;
  const approvedClubs =
    allClubs?.filter((club) => club.status === "approved").length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">Platform overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-sm font-medium text-gray-500 mb-1">
            Total Users
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {users?.length || 0}
          </div>
          <div className="text-xs text-gray-400">Registered users</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-sm font-medium text-gray-500 mb-1">
            Active Clubs
          </div>
          <div className="text-2xl font-bold text-purple-600">
            {approvedClubs}
          </div>
          <div className="text-xs text-gray-400">
            {pendingClubs} pending approval
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-sm font-medium text-gray-500 mb-1">
            Total Revenue
          </div>
          <div className="text-2xl font-bold text-green-600">
            ${totalRevenue.toFixed(2)}
          </div>
          <div className="text-xs text-gray-400">All-time earnings</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-sm font-medium text-gray-500 mb-1">
            Transactions
          </div>
          <div className="text-2xl font-bold text-indigo-600">
            {payments?.length || 0}
          </div>
          <div className="text-xs text-gray-400">Payment records</div>
        </div>
      </div>

      {/* Pending Clubs Alert */}
      {pendingClubs > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-yellow-600 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <span className="text-yellow-800">
              {pendingClubs} club(s) awaiting approval
            </span>
          </div>
          <Link
            to="/dashboard/admin/clubs"
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer"
          >
            Review
          </Link>
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Clubs
            </h2>
            <div className="space-y-3">
              {allClubs?.slice(0, 5).map((club) => (
                <div
                  key={club._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {club.clubName}
                    </h3>
                    <p className="text-sm text-gray-500">{club.category}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      club.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : club.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {club.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Payments
            </h2>
            <div className="space-y-3">
              {payments?.slice(0, 5).map((payment) => (
                <div
                  key={payment._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">
                      ${payment.amount}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {payment.type} - {payment.clubId?.clubName}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      payment.status === "succeeded"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {payment.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ManageUsers = () => {
  const queryClient = useQueryClient();
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    userId: null,
    userName: "",
  });

  const { data: users, isLoading } = useQuery({
    queryKey: ["allUsers"],
    queryFn: () => userAPI.getAll().then((res) => res.data),
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }) => userAPI.updateRole(userId, role),
    onSuccess: () => {
      toast.success("User role updated successfully");
      queryClient.invalidateQueries(["allUsers"]);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update user role"
      );
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId) => userAPI.deleteUser(userId),
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries(["allUsers"]);
      setConfirmDialog({ isOpen: false, userId: null, userName: "" });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete user");
      setConfirmDialog({ isOpen: false, userId: null, userName: "" });
    },
  });

  const handleRoleChange = (userId, newRole) => {
    updateRoleMutation.mutate({ userId, role: newRole });
  };

  const handleDeleteUser = (userId, userName) => {
    setConfirmDialog({ isOpen: true, userId, userName });
  };

  const confirmDelete = () => {
    if (confirmDialog.userId) {
      deleteUserMutation.mutate(confirmDialog.userId);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Users</h1>
        <p className="text-gray-600">Update user roles and permissions</p>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users?.map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 mr-3">
                          <img
                            src={
                              user.photoURL || "https://via.placeholder.com/40"
                            }
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-medium text-gray-900">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-red-100 text-red-800"
                            : user.role === "clubManager"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <select
                          onChange={(e) =>
                            handleRoleChange(user._id, e.target.value)
                          }
                          value={user.role}
                          className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="member">Member</option>
                          <option value="clubManager">Club Manager</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button
                          onClick={() => handleDeleteUser(user._id, user.name)}
                          className={`${
                            deleteUserMutation.isLoading ||
                            user.role === "admin"
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-red-600 hover:bg-red-700 cursor-pointer"
                          } text-white px-3 py-1 rounded text-sm transition-colors`}
                          disabled={
                            deleteUserMutation.isLoading ||
                            user.role === "admin"
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() =>
          setConfirmDialog({ isOpen: false, userId: null, userName: "" })
        }
        onConfirm={confirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete user: ${confirmDialog.userName}? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </motion.div>
  );
};

const ManageClubs = () => {
  const queryClient = useQueryClient();
  const { data: clubs, isLoading } = useQuery({
    queryKey: ["adminClubs"],
    queryFn: () => clubAPI.getAllForAdmin().then((res) => res.data),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ clubId, status }) => clubAPI.updateStatus(clubId, status),
    onSuccess: () => {
      toast.success("Club status updated successfully");
      queryClient.invalidateQueries(["adminClubs"]);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update club status"
      );
    },
  });

  const handleStatusChange = (clubId, status) => {
    updateStatusMutation.mutate({ clubId, status });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Clubs</h1>
        <p className="text-gray-600">Approve or reject club applications</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-md animate-pulse"
            >
              <div className="h-32 bg-gray-200 rounded-t-lg"></div>
              <div className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs?.map((club) => (
            <div
              key={club._id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="h-32 overflow-hidden">
                <img
                  src={
                    club.bannerImage || "https://via.placeholder.com/300x150"
                  }
                  alt={club.clubName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {club.clubName}
                </h3>
                <div className="space-y-1 text-sm text-gray-600 mb-4">
                  <p>
                    <span className="font-medium">Category:</span>{" "}
                    {club.category}
                  </p>
                  <p>
                    <span className="font-medium">Location:</span>{" "}
                    {club.location}
                  </p>
                  <p>
                    <span className="font-medium">Manager:</span>{" "}
                    {club.managerEmail}
                  </p>
                  <p>
                    <span className="font-medium">Fee:</span>{" "}
                    {club.membershipFee > 0 ? `$${club.membershipFee}` : "Free"}
                  </p>
                  <p>
                    <span className="font-medium">Members:</span>{" "}
                    {club.memberCount}
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      club.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : club.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {club.status}
                  </span>

                  {club.status === "pending" && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusChange(club._id, "approved")}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors cursor-pointer"
                        disabled={updateStatusMutation.isLoading}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusChange(club._id, "rejected")}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors cursor-pointer"
                        disabled={updateStatusMutation.isLoading}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

const ViewPayments = () => {
  const { data: payments, isLoading } = useQuery({
    queryKey: ["allPayments"],
    queryFn: () => paymentAPI.getAllPayments().then((res) => res.data),
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Payment Records
        </h1>
        <p className="text-gray-600">View all platform transactions</p>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Club/Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments?.map((payment) => (
                  <tr key={payment._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.userEmail}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                        {payment.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.clubId?.clubName}
                      {payment.eventId && ` - ${payment.eventId.title}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ${payment.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          payment.status === "succeeded"
                            ? "bg-green-100 text-green-800"
                            : payment.status === "failed"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
};

const AdminDashboard = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<AdminOverview />} />
        <Route path="/users" element={<ManageUsers />} />
        <Route path="/clubs" element={<ManageClubs />} />
        <Route path="/payments" element={<ViewPayments />} />
      </Routes>
    </DashboardLayout>
  );
};

export default AdminDashboard;
