import { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { membershipAPI, paymentAPI } from '../../utils/api';
import { useAuth } from '../../hooks/useAuth';

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { path: '/dashboard/member', label: 'Overview', icon: '📊' },
    { path: '/dashboard/member/memberships', label: 'My Clubs', icon: '🏢' },
    { path: '/dashboard/member/payments', label: 'Payment History', icon: '💳' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-gradient-to-r from-green-500 to-blue-600">
          <h2 className="text-lg font-bold text-white">Member Panel</h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-white hover:bg-white/20 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User Profile Section */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-b from-gray-50 to-white">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-green-400 to-blue-500 p-0.5">
                <div className="w-full h-full rounded-full overflow-hidden bg-white">
                  <img src={user?.photoURL || 'https://via.placeholder.com/48'} alt="Profile" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{user?.name}</h3>
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
                    ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 hover:text-gray-900 hover:shadow-md'
                }`}
              >
                <span className={`text-lg transition-transform duration-200 ${
                  isActive ? 'scale-110' : 'group-hover:scale-110'
                }`}>{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {isActive && (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Quick Stats */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-3">
            <div className="text-xs font-medium text-gray-600 mb-1">Quick Stats</div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Active Since</span>
              <span>{new Date().getFullYear()}</span>
            </div>
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
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center space-x-3">
              <h1 className="text-lg font-semibold text-gray-800">Member Dashboard</h1>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                <span className="text-white text-sm font-bold">{user?.name?.charAt(0)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Member Dashboard</h1>
              <p className="text-sm text-gray-500">Manage your club memberships and activities</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-green-50 to-blue-50 px-4 py-2 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">Active Member</span>
              </div>
            </div>
          </div>
        </div>

        <main className="p-6">
          {children}
        </main>
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

const MemberOverview = () => {
  const { data: memberships, isLoading: membershipsLoading } = useQuery({
    queryKey: ['userMemberships'],
    queryFn: () => membershipAPI.getMyMemberships().then(res => res.data)
  });

  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: ['userPayments'],
    queryFn: () => paymentAPI.getMyPayments().then(res => res.data)
  });

  const activeMemberships = memberships?.filter(m => m.status === 'active') || [];
  const totalSpent = payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
        <p className="text-gray-600">Here's an overview of your club activities</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-sm font-medium text-gray-500 mb-1">Active Memberships</div>
          <div className="text-2xl font-bold text-blue-600">
            {membershipsLoading ? '...' : activeMemberships.length}
          </div>
          <div className="text-xs text-gray-400">Clubs you're a member of</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-sm font-medium text-gray-500 mb-1">Total Spent</div>
          <div className="text-2xl font-bold text-purple-600">
            ${paymentsLoading ? '...' : totalSpent.toFixed(2)}
          </div>
          <div className="text-xs text-gray-400">On memberships and events</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-sm font-medium text-gray-500 mb-1">Transactions</div>
          <div className="text-2xl font-bold text-green-600">
            {paymentsLoading ? '...' : payments?.length || 0}
          </div>
          <div className="text-xs text-gray-400">Payment history</div>
        </div>
      </div>

      {/* Recent Memberships */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">My Clubs</h2>
            <Link to="/dashboard/member/memberships" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer">
              View All
            </Link>
          </div>

          {membershipsLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg animate-pulse">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : activeMemberships.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">You haven't joined any clubs yet</p>
              <Link to="/clubs" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors cursor-pointer">
                Explore Clubs
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {activeMemberships.slice(0, 3).map((membership) => (
                <div key={membership._id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-lg">
                      {membership.clubId.clubName.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{membership.clubId.clubName}</h3>
                    <p className="text-sm text-gray-500">{membership.clubId.category} • {membership.clubId.location}</p>
                  </div>
                  <div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Active</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/clubs" className="flex items-center justify-center space-x-2 border-2 border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-600 font-medium py-3 px-6 rounded-lg transition-colors">
              <span className="text-xl">🔍</span>
              <span>Explore Clubs</span>
            </Link>
            <Link to="/events" className="flex items-center justify-center space-x-2 border-2 border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-600 font-medium py-3 px-6 rounded-lg transition-colors">
              <span className="text-xl">📅</span>
              <span>Browse Events</span>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const MyMemberships = () => {
  const { data: memberships, isLoading } = useQuery({
    queryKey: ['userMemberships'],
    queryFn: () => membershipAPI.getMyMemberships().then(res => res.data)
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Clubs</h1>
        <p className="text-gray-600">Manage your club memberships</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md animate-pulse">
              <div className="h-32 bg-gray-200 rounded-t-lg"></div>
              <div className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : memberships?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500 mb-4">You haven't joined any clubs yet</p>
          <Link to="/clubs" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors cursor-pointer">
            Explore Clubs
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memberships?.map((membership) => (
            <div key={membership._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-32 overflow-hidden">
                <img 
                  src={membership.clubId.bannerImage || 'https://via.placeholder.com/300x150'} 
                  alt={membership.clubId.clubName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{membership.clubId.clubName}</h3>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p><span className="font-medium">Category:</span> {membership.clubId.category}</p>
                  <p><span className="font-medium">Location:</span> {membership.clubId.location}</p>
                  <p><span className="font-medium">Joined:</span> {new Date(membership.createdAt).toLocaleDateString()}</p>
                  {membership.clubId.membershipFee > 0 && (
                    <p><span className="font-medium">Fee:</span> ${membership.clubId.membershipFee}/month</p>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    membership.status === 'active' ? 'bg-green-100 text-green-800' : 
                    membership.status === 'expired' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {membership.status}
                  </span>
                  <Link to={`/clubs/${membership.clubId._id}`} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer">
                    View Club
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

const PaymentHistory = () => {
  const { data: payments, isLoading } = useQuery({
    queryKey: ['userPayments'],
    queryFn: () => paymentAPI.getMyPayments().then(res => res.data)
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment History</h1>
        <p className="text-gray-600">View your transaction history</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md animate-pulse p-6">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : payments?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">No payment history found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Club/Event</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments?.map((payment) => (
                  <tr key={payment._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(payment.createdAt).toLocaleDateString()}
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">${payment.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        payment.status === 'succeeded' ? 'bg-green-100 text-green-800' : 
                        payment.status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
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

const MemberDashboard = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<MemberOverview />} />
        <Route path="/memberships" element={<MyMemberships />} />
        <Route path="/payments" element={<PaymentHistory />} />
      </Routes>
    </DashboardLayout>
  );
};

export default MemberDashboard;