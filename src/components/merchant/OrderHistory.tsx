import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { MerchantLayout } from './MerchantLayout';
import { CheckCircle, Clock, XCircle, Calendar, DollarSign, Eye, TrendingUp } from 'lucide-react';
import { useState } from 'react';

export function OrderHistory() {
  const { user } = useAuth();
  const { orders } = useData();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  // Filter orders for current merchant
  const myOrders = orders.filter(order => order.merchantId === user?.id);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return {
          label: 'Active',
          icon: TrendingUp,
          bg: 'bg-green-100',
          text: 'text-green-700',
          iconColor: 'text-green-600'
        };
      case 'scheduled':
        return {
          label: 'Scheduled',
          icon: Calendar,
          bg: 'bg-blue-100',
          text: 'text-blue-700',
          iconColor: 'text-blue-600'
        };
      case 'upcoming':
        return {
          label: 'Upcoming',
          icon: Calendar,
          bg: 'bg-indigo-100',
          text: 'text-indigo-700',
          iconColor: 'text-indigo-600'
        };
      case 'approved':
        return {
          label: 'Approved',
          icon: CheckCircle,
          bg: 'bg-green-100',
          text: 'text-green-700',
          iconColor: 'text-green-600'
        };
      case 'under_review':
        return {
          label: 'Under Review',
          icon: Clock,
          bg: 'bg-yellow-100',
          text: 'text-yellow-700',
          iconColor: 'text-yellow-600'
        };
      case 'rejected':
        return {
          label: 'Rejected',
          icon: XCircle,
          bg: 'bg-red-100',
          text: 'text-red-700',
          iconColor: 'text-red-600'
        };
      case 'past':
        return {
          label: 'Past',
          icon: CheckCircle,
          bg: 'bg-gray-100',
          text: 'text-gray-700',
          iconColor: 'text-gray-600'
        };
      default:
        return {
          label: status,
          icon: Clock,
          bg: 'bg-gray-100',
          text: 'text-gray-700',
          iconColor: 'text-gray-600'
        };
    }
  };

  const selectedOrderDetails = myOrders.find(o => o.id === selectedOrder);

  return (
    <MerchantLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl mb-2">Order History</h2>
          <p className="text-gray-600">Track all your banner campaigns and their status</p>
        </div>

        {myOrders.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl mb-2">No Orders Yet</h3>
            <p className="text-gray-600">Your order history will appear here</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                      Banner
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                      Package
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                      Schedule
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {myOrders.map(order => {
                    const statusConfig = getStatusConfig(order.status);
                    const StatusIcon = statusConfig.icon;
                    
                    return (
                      <tr key={order.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={order.imageUrl}
                              alt={order.bannerName}
                              className="w-16 h-10 object-cover rounded"
                            />
                            <div>
                              <p className="font-medium">{order.bannerName}</p>
                              <p className="text-sm text-gray-500">{order.locationName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm">{order.packageName}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <p>{new Date(order.startDate).toLocaleDateString()}</p>
                            <p className="text-gray-500">to {new Date(order.endDate).toLocaleDateString()}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm">₹{order.price.toLocaleString()}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs ${statusConfig.bg} ${statusConfig.text}`}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setSelectedOrder(order.id)}
                            className="text-indigo-600 hover:text-indigo-700 text-sm inline-flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl">Order Details</h3>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Banner Preview */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">Banner Preview</label>
                <img
                  src={selectedOrderDetails.imageUrl}
                  alt={selectedOrderDetails.bannerName}
                  className="w-full rounded-lg"
                />
              </div>

              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Banner Name</label>
                  <p className="font-medium">{selectedOrderDetails.bannerName}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Package</label>
                  <p className="font-medium">{selectedOrderDetails.packageName}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Location</label>
                  <p className="font-medium">{selectedOrderDetails.locationName}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Status</label>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs ${getStatusConfig(selectedOrderDetails.status).bg} ${getStatusConfig(selectedOrderDetails.status).text}`}>
                    {getStatusConfig(selectedOrderDetails.status).label}
                  </span>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Start Date</label>
                  <p className="font-medium">{new Date(selectedOrderDetails.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">End Date</label>
                  <p className="font-medium">{new Date(selectedOrderDetails.endDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Amount Paid</label>
                  <p className="font-medium">₹{selectedOrderDetails.price.toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Transaction ID</label>
                  <p className="font-medium text-sm">{selectedOrderDetails.transactionId}</p>
                </div>
              </div>

              {selectedOrderDetails.rejectionReason && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-600 font-medium mb-1">Rejection Reason:</p>
                  <p className="text-sm text-red-700">{selectedOrderDetails.rejectionReason}</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </MerchantLayout>
  );
}