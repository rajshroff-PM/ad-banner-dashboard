import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { MerchantLayout } from './MerchantLayout';
import { Plus, TrendingUp, Clock, Calendar } from 'lucide-react';

export function MerchantDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { orders } = useData();

  // Filter orders for current merchant
  const myOrders = orders.filter(order => order.merchantId === user?.id);

  const activeOrders = myOrders.filter(
    order => order.status === 'active' && new Date(order.endDate) >= new Date() && new Date(order.startDate) <= new Date()
  );

  const scheduledOrders = myOrders.filter(
    order => order.status === 'scheduled' && new Date(order.startDate) > new Date()
  );

  const upcomingOrders = myOrders.filter(
    order => order.status === 'upcoming'
  );

  const pendingOrders = myOrders.filter(order => order.status === 'under_review');

  const pastOrders = myOrders.filter(
    order => order.status === 'past' || (order.status === 'approved' && new Date(order.endDate) < new Date())
  );

  const stats = [
    {
      label: 'Active Banners',
      value: activeOrders.length,
      icon: TrendingUp,
      color: 'bg-green-500',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      label: 'Scheduled Banners',
      value: scheduledOrders.length,
      icon: Calendar,
      color: 'bg-blue-500',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      label: 'Pending Approval',
      value: pendingOrders.length,
      icon: Clock,
      color: 'bg-yellow-500',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    },

  ];

  return (
    <MerchantLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
          <h2 className="text-2xl mb-2">Welcome back, {user?.name}!</h2>
          <p className="text-indigo-100 mb-6">
            Manage your advertising campaigns for {user?.locationName}
          </p>
          <button
            onClick={() => navigate('/merchant/packages')}
            className="bg-white text-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-50 transition inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create New Banner
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-xl p-6 border border-gray-200">
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

        {/* Active Banners */}
        {activeOrders.length > 0 && (
          <div>
            <h3 className="text-xl mb-4">Active Banners</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeOrders.map(order => (
                <div key={order.id} className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition">
                  <div className="aspect-video bg-gray-100">
                    <img
                      src={order.imageUrl}
                      alt={order.bannerName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{order.bannerName}</h4>
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Active
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{order.packageName}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>Until {new Date(order.endDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scheduled Banners */}
        {scheduledOrders.length > 0 && (
          <div>
            <h3 className="text-xl mb-4">Scheduled Banners</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scheduledOrders.map(order => (
                <div key={order.id} className="bg-white rounded-xl overflow-hidden border border-gray-200">
                  <div className="aspect-video bg-gray-100">
                    <img
                      src={order.imageUrl}
                      alt={order.bannerName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{order.bannerName}</h4>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        Scheduled
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{order.packageName}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>Starts {new Date(order.startDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Banners */}
        {upcomingOrders.length > 0 && (
          <div>
            <h3 className="text-xl mb-4">Upcoming Banners</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingOrders.map(order => (
                <div key={order.id} className="bg-white rounded-xl overflow-hidden border border-gray-200">
                  <div className="aspect-video bg-gray-100">
                    <img
                      src={order.imageUrl}
                      alt={order.bannerName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{order.bannerName}</h4>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        Scheduled
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{order.packageName}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>Starts {new Date(order.startDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pending Approvals */}
        {pendingOrders.length > 0 && (
          <div>
            <h3 className="text-xl mb-4">Pending Approval</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingOrders.map(order => (
                <div key={order.id} className="bg-white rounded-xl overflow-hidden border border-gray-200">
                  <div className="aspect-video bg-gray-100">
                    <img
                      src={order.imageUrl}
                      alt={order.bannerName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{order.bannerName}</h4>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">
                        Under Review
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{order.packageName}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>Submitted {new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {myOrders.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl mb-2">No Banners Yet</h3>
            <p className="text-gray-600 mb-6">
              Start your first advertising campaign today!
            </p>
            <button
              onClick={() => navigate('/merchant/packages')}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              View Packages
            </button>
          </div>
        )}
      </div>
    </MerchantLayout>
  );
}