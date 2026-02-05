import { useNavigate } from 'react-router';
import { useData } from '../../contexts/DataContext';
import { AdminLayout } from './AdminLayout';
import { Clock, CheckCircle, DollarSign, MapPin, Package as PackageIcon } from 'lucide-react';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { orders, locations } = useData();

  const pendingApprovals = orders.filter(order => order.status === 'under_review').length;
  const approvedBanners = orders.filter(order => order.status === 'approved').length;
  const totalRevenue = orders
    .filter(order => order.status === 'approved')
    .reduce((sum, order) => sum + order.price, 0);

  const stats = [
    {
      label: 'Pending Approvals',
      value: pendingApprovals,
      icon: Clock,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      action: () => navigate('/admin/approvals')
    },
    {
      label: 'Active Banners',
      value: approvedBanners,
      icon: CheckCircle,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      label: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      label: 'Active Locations',
      value: locations.filter(loc => loc.isActive).length,
      icon: MapPin,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      action: () => navigate('/admin/locations')
    }
  ];

  const recentOrders = orders.slice(0, 5);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return { bg: 'bg-green-100', text: 'text-green-700', label: 'Active' };
      case 'scheduled':
        return { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Scheduled' };
      case 'upcoming':
        return { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Upcoming' };
      case 'approved':
        return { bg: 'bg-green-100', text: 'text-green-700', label: 'Approved' };
      case 'under_review':
        return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' };
      case 'rejected':
        return { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' };
      case 'past':
        return { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Past' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', label: status };
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
          <h2 className="text-2xl mb-2">Admin Dashboard</h2>
          <p className="text-purple-100 mb-6">
            Manage advertising campaigns, approve banners, and configure packages
          </p>
          {pendingApprovals > 0 && (
            <button
              onClick={() => navigate('/admin/approvals')}
              className="bg-white text-purple-600 px-6 py-3 rounded-lg hover:bg-purple-50 transition inline-flex items-center gap-2"
            >
              <Clock className="w-5 h-5" />
              Review {pendingApprovals} Pending {pendingApprovals === 1 ? 'Banner' : 'Banners'}
            </button>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`bg-white rounded-xl p-6 border border-gray-200 ${stat.action ? 'cursor-pointer hover:shadow-lg transition' : ''}`}
                onClick={stat.action}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl">{stat.value}</p>
                  </div>
                  <div className={`${stat.iconBg} p-3 rounded-lg`}>
                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-xl mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/admin/approvals')}
              className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-purple-400 transition text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                </div>
                <h4 className="font-medium">Review Banners</h4>
              </div>
              <p className="text-sm text-gray-600">Approve or reject pending banner submissions</p>
            </button>

            <button
              onClick={() => navigate('/admin/packages')}
              className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-purple-400 transition text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <PackageIcon className="w-5 h-5 text-blue-600" />
                </div>
                <h4 className="font-medium">Manage Packages</h4>
              </div>
              <p className="text-sm text-gray-600">Configure advertising packages and pricing</p>
            </button>

            <button
              onClick={() => navigate('/admin/locations')}
              className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-purple-400 transition text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-green-100 p-2 rounded-lg">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                <h4 className="font-medium">Manage Locations</h4>
              </div>
              <p className="text-sm text-gray-600">Add and configure kiosk locations</p>
            </button>
          </div>
        </div>

        {/* Recent Orders */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl">Recent Orders</h3>
            <button
              onClick={() => navigate('/admin/approvals')}
              className="text-purple-600 hover:text-purple-700 text-sm"
            >
              View All
            </button>
          </div>

          {recentOrders.length > 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                        Banner
                      </th>
                      <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                        Merchant
                      </th>
                      <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentOrders.map(order => {
                      const statusConfig = getStatusConfig(order.status);

                      return (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={order.imageUrl}
                                alt={order.bannerName}
                                className="w-16 h-10 object-cover rounded"
                              />
                              <p className="font-medium">{order.bannerName}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm">{order.merchantName}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm">{order.locationName}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm">₹{order.price.toLocaleString()}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs ${statusConfig.bg} ${statusConfig.text}`}>
                              {statusConfig.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
              <p className="text-gray-600">No orders yet</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
