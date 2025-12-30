import { Routes, Route, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { membershipAPI, paymentAPI } from '../../utils/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/ui/StatCard';

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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Active Memberships" value={membershipsLoading ? '...' : activeMemberships.length} icon="🏢" color="blue" />
        <StatCard title="Total Spent" value={`${paymentsLoading ? '...' : totalSpent.toFixed(2)}`} icon="💳" color="purple" />
        <StatCard title="Transactions" value={paymentsLoading ? '...' : payments?.length || 0} icon="🔄" color="green" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">My Clubs</h2>
          <Link to="/dashboard/member/memberships" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
            View All
          </Link>
        </div>
        {membershipsLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : activeMemberships.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">You haven't joined any clubs yet.</p>
            <Link to="/clubs" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
              Explore Clubs
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {activeMemberships.slice(0, 3).map((membership) => (
              <div key={membership._id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <img src={membership.clubId.bannerImage || `https://ui-avatars.com/api/?name=${membership.clubId.clubName}&background=random`} alt={membership.clubId.clubName} className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{membership.clubId.clubName}</h3>
                  <p className="text-sm text-gray-500">{membership.clubId.category}</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Active</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/clubs" className="flex items-center justify-center space-x-2 border-2 border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-600 font-medium py-3 px-6 rounded-lg transition-colors">
            <span>🔍</span><span>Explore Clubs</span>
          </Link>
          <Link to="/events" className="flex items-center justify-center space-x-2 border-2 border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-600 font-medium py-3 px-6 rounded-lg transition-colors">
            <span>📅</span><span>Browse Events</span>
          </Link>
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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {isLoading ? (
        <div className="text-center py-4">Loading...</div>
      ) : memberships?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500 mb-4">You haven't joined any clubs yet.</p>
          <Link to="/clubs" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
            Explore Clubs
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memberships?.map((membership) => (
            <div key={membership._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <img src={membership.clubId.bannerImage || 'https://via.placeholder.com/300x150'} alt={membership.clubId.clubName} className="w-full h-32 object-cover" />
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{membership.clubId.clubName}</h3>
                <div className="space-y-1 text-sm text-gray-600 mb-4">
                  <p><span className="font-medium">Joined:</span> {new Date(membership.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    membership.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {membership.status}
                  </span>
                  <Link to={`/clubs/${membership.clubId._id}`} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
              {isLoading ? (
                <tr><td colSpan="5" className="text-center py-4">Loading...</td></tr>
              ) : (
                payments?.map((payment) => (
                  <tr key={payment._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(payment.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{payment.type}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.clubId?.clubName}{payment.eventId && ` - ${payment.eventId.title}`}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">${payment.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        payment.status === 'succeeded' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
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

const MemberDashboard = () => {
  const menuItems = [
    { path: '/dashboard/member', label: 'Overview', icon: '📊' },
    { path: '/dashboard/member/memberships', label: 'My Clubs', icon: '🏢' },
    { path: '/dashboard/member/payments', label: 'Payment History', icon: '💳' },
  ];

  return (
    <DashboardLayout menuItems={menuItems} dashboardTitle="Member Panel" themeColor="member">
      <Routes>
        <Route path="/" element={<MemberOverview />} />
        <Route path="/memberships" element={<MyMemberships />} />
        <Route path="/payments" element={<PaymentHistory />} />
      </Routes>
    </DashboardLayout>
  );
};

export default MemberDashboard;