import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { clubAPI, userAPI, paymentAPI } from "../../utils/api";
import toast from "react-hot-toast";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/ui/StatCard";

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={users?.length || 0} icon="👥" color="blue" />
        <StatCard title="Active Clubs" value={approvedClubs} icon="🏢" color="purple" subtext={`${pendingClubs} pending`} />
        <StatCard title="Total Revenue" value={`${totalRevenue.toFixed(2)}`} icon="💳" color="green" />
        <StatCard title="Transactions" value={payments?.length || 0} icon="🔄" color="indigo" />
      </div>

      {pendingClubs > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-yellow-800">{pendingClubs} club(s) awaiting approval</span>
          </div>
          <Link to="/dashboard/admin/clubs" className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer">
            Review
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Clubs</h2>
          <div className="space-y-3">
            {allClubs?.slice(0, 5).map((club) => (
              <div key={club._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">{club.clubName}</h3>
                  <p className="text-sm text-gray-500">{club.category}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  club.status === "approved" ? "bg-green-100 text-green-800" :
                  club.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
                }`}>
                  {club.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Payments</h2>
          <div className="space-y-3">
            {payments?.slice(0, 5).map((payment) => (
              <div key={payment._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">${payment.amount}</h3>
                  <p className="text-sm text-gray-500">{payment.type} - {payment.clubId?.clubName}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  payment.status === "succeeded" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                  {payment.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ManageUsers = () => {
  const queryClient = useQueryClient();
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, userId: null, userName: "" });

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
    onError: (error) => toast.error(error.response?.data?.message || "Failed to update user role"),
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

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr><td colSpan="5" className="text-center py-4">Loading...</td></tr>
              ) : (
                users?.map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.name}&background=random`} alt="Profile" className="w-10 h-10 rounded-full object-cover mr-3" />
                        <span className="font-medium text-gray-900">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === "admin" ? "bg-red-100 text-red-800" :
                        user.role === "clubManager" ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <select
                          onChange={(e) => updateRoleMutation.mutate({ userId: user._id, role: e.target.value })}
                          value={user.role}
                          className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="member">Member</option>
                          <option value="clubManager">Club Manager</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button
                          onClick={() => setConfirmDialog({ isOpen: true, userId: user._id, userName: user.name })}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors disabled:opacity-50"
                          disabled={deleteUserMutation.isLoading || user.role === "admin"}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, userId: null, userName: "" })}
        onConfirm={() => deleteUserMutation.mutate(confirmDialog.userId)}
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
    onError: (error) => toast.error(error.response?.data?.message || "Failed to update club status"),
  });

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 animate-pulse">
              <div className="h-32 bg-gray-200 rounded-t-xl"></div>
              <div className="p-6"><div className="h-4 bg-gray-200 rounded mb-2"></div><div className="h-3 bg-gray-200 rounded"></div></div>
            </div>
          ))
        ) : (
          clubs?.map((club) => (
            <div key={club._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <img src={club.bannerImage || "https://via.placeholder.com/300x150"} alt={club.clubName} className="w-full h-32 object-cover" />
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{club.clubName}</h3>
                <div className="space-y-1 text-sm text-gray-600 mb-4">
                  <p><span className="font-medium">Manager:</span> {club.managerEmail}</p>
                  <p><span className="font-medium">Members:</span> {club.memberCount}</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    club.status === "approved" ? "bg-green-100 text-green-800" :
                    club.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
                  }`}>
                    {club.status}
                  </span>
                  {club.status === "pending" && (
                    <div className="flex space-x-2">
                      <button onClick={() => updateStatusMutation.mutate({ clubId: club._id, status: "approved" })} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm" disabled={updateStatusMutation.isLoading}>Approve</button>
                      <button onClick={() => updateStatusMutation.mutate({ clubId: club._id, status: "rejected" })} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm" disabled={updateStatusMutation.isLoading}>Reject</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};

const ViewPayments = () => {
  const { data: payments, isLoading } = useQuery({
    queryKey: ["allPayments"],
    queryFn: () => paymentAPI.getAllPayments().then((res) => res.data),
  });

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Club/Event</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr><td colSpan="6" className="text-center py-4">Loading...</td></tr>
              ) : (
                payments?.map((payment) => (
                  <tr key={payment._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(payment.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.userEmail}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{payment.type}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.clubId?.clubName}{payment.eventId && ` - ${payment.eventId.title}`}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">${payment.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        payment.status === "succeeded" ? "bg-green-100 text-green-800" :
                        payment.status === "failed" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

const AdminDashboard = () => {
  const menuItems = [
    { path: "/dashboard/admin", label: "Overview", icon: "📊" },
    { path: "/dashboard/admin/users", label: "Manage Users", icon: "👥" },
    { path: "/dashboard/admin/clubs", label: "Manage Clubs", icon: "🏢" },
    { path: "/dashboard/admin/payments", label: "Payments", icon: "💳" },
  ];

  return (
    <DashboardLayout menuItems={menuItems} dashboardTitle="Admin Panel" themeColor="admin">
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
