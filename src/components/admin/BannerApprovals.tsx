import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { AdminLayout } from './AdminLayout';
import { CheckCircle, XCircle, Eye, Calendar, DollarSign } from 'lucide-react';

export function BannerApprovals() {
  const { orders, updateOrderStatus, updateOrderApprovalStage } = useData();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [filter, setFilter] = useState<'all' | 'under_review' | 'approved' | 'rejected'>('under_review');

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter(order => order.status === filter);

  const selectedOrderDetails = orders.find(o => o.id === selectedOrder);

  const handleApprove = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    // Simplified Approval: Immediate Live/Scheduled
    updateOrderApprovalStage(orderId, 'final_approval', 'admin');
    const startDate = new Date(order.startDate);
    const now = new Date();

    if (startDate <= now) {
      updateOrderStatus(orderId, 'active');
    } else {
      updateOrderStatus(orderId, 'scheduled');
    }

    setSelectedOrder(null);
  };

  const handleReject = (orderId: string) => {
    if (rejectionReason.trim()) {
      updateOrderStatus(orderId, 'rejected', rejectionReason);
      setSelectedOrder(null);
      setRejectionReason('');
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'approved':
        return { bg: 'bg-green-100', text: 'text-green-700', label: 'Approved' };
      case 'under_review':
        return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' };
      case 'rejected':
        return { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', label: status };
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl mb-2">Banner Approvals</h2>
            <p className="text-gray-600">Review and approve merchant banner submissions</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {(['under_review', 'approved', 'rejected', 'all'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm transition ${filter === status
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-purple-300'
                }`}
            >
              {status === 'under_review' ? 'Pending' : status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== 'all' && (
                <span className="ml-2">
                  ({orders.filter(o => o.status === status).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl mb-2">No {filter === 'all' ? '' : filter.replace('_', ' ')} banners</h3>
            <p className="text-gray-600">
              {filter === 'under_review'
                ? 'All caught up! No pending approvals at the moment.'
                : 'No banners to display.'}
            </p>
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
                      Merchant
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                      Location
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
                  {filteredOrders.map(order => {
                    const statusConfig = getStatusConfig(order.status);

                    return (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={order.imageUrl}
                              alt={order.bannerName}
                              className="w-20 h-12 object-cover rounded"
                            />
                            <div>
                              <p className="font-medium">{order.bannerName}</p>
                              <p className="text-sm text-gray-500">{order.packageName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm">{order.merchantName}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm">{order.locationName}</p>
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
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs ${statusConfig.bg} ${statusConfig.text}`}>
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setSelectedOrder(order.id)}
                            className="text-purple-600 hover:text-purple-700 text-sm inline-flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            Review
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

      {/* Review Modal */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl">Review Banner Submission</h3>
            </div>

            <div className="p-6 space-y-6">
              {/* Banner Preview */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">Banner Preview</label>
                <img
                  src={selectedOrderDetails.imageUrl}
                  alt={selectedOrderDetails.bannerName}
                  className="w-full rounded-lg border border-gray-200"
                />
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Banner Name</label>
                  <p className="font-medium">{selectedOrderDetails.bannerName}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Package</label>
                  <p className="font-medium">{selectedOrderDetails.packageName}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Merchant</label>
                  <p className="font-medium">{selectedOrderDetails.merchantName}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Location</label>
                  <p className="font-medium">{selectedOrderDetails.locationName}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Start Date</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="font-medium">{new Date(selectedOrderDetails.startDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">End Date</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="font-medium">{new Date(selectedOrderDetails.endDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Amount Paid</label>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <p className="font-medium">₹{selectedOrderDetails.price.toLocaleString()}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Transaction ID</label>
                  <p className="font-medium font-mono text-sm">{selectedOrderDetails.transactionId}</p>
                </div>
              </div>

              {/* Rejection Reason (if applicable) */}
              {selectedOrderDetails.status === 'rejected' && selectedOrderDetails.rejectionReason && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-600 font-medium mb-1">Rejection Reason:</p>
                  <p className="text-sm text-red-700">{selectedOrderDetails.rejectionReason}</p>
                </div>
              )}

              {/* Approval Stage Info */}
              {selectedOrderDetails.approvalStage && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-600 font-medium mb-2">Approval Progress:</p>
                  <div className="flex items-center gap-2">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded ${selectedOrderDetails.approvalStage === 'pending' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'
                      }`}>
                      <span className="text-xs">1st Approval</span>
                      {selectedOrderDetails.approvalStage !== 'pending' && <CheckCircle className="w-3 h-3" />}
                    </div>
                    <div className="h-px w-4 bg-gray-300"></div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded ${selectedOrderDetails.approvalStage === 'second_approver' ? 'bg-yellow-200 text-yellow-800' :
                        selectedOrderDetails.approvalStage === 'scheduler' || selectedOrderDetails.approvalStage === 'final_approval' ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-600'
                      }`}>
                      <span className="text-xs">2nd Approval</span>
                      {(selectedOrderDetails.approvalStage === 'scheduler' || selectedOrderDetails.approvalStage === 'final_approval') && <CheckCircle className="w-3 h-3" />}
                    </div>
                    <div className="h-px w-4 bg-gray-300"></div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded ${selectedOrderDetails.approvalStage === 'scheduler' ? 'bg-yellow-200 text-yellow-800' :
                        selectedOrderDetails.approvalStage === 'final_approval' ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-600'
                      }`}>
                      <span className="text-xs">Scheduler</span>
                      {selectedOrderDetails.approvalStage === 'final_approval' && <CheckCircle className="w-3 h-3" />}
                    </div>
                  </div>
                  {selectedOrderDetails.approvedBy && selectedOrderDetails.approvedBy.length > 0 && (
                    <p className="text-xs text-blue-700 mt-2">
                      Approved by: {selectedOrderDetails.approvedBy.join(', ')}
                    </p>
                  )}
                </div>
              )}

              {/* Payment Method */}
              {selectedOrderDetails.paidWithCredits !== undefined && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className={`px-2 py-1 rounded text-xs ${selectedOrderDetails.paidWithCredits ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                    }`}>
                    {selectedOrderDetails.paidWithCredits ? 'Credits' : 'Cash Payment'}
                  </span>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setSelectedOrder(null);
                  setRejectionReason('');
                }}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                Close
              </button>

              {selectedOrderDetails.status === 'under_review' && (
                <>
                  <button
                    onClick={() => handleReject(selectedOrderDetails.id)}
                    disabled={!rejectionReason.trim()}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(selectedOrderDetails.id)}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition inline-flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve & Publish
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}