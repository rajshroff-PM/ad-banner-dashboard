import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { MerchantLayout } from './MerchantLayout';
import { CreditCard, Building2, Smartphone, CheckCircle, Calendar } from 'lucide-react';

export function PaymentCheckout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { bannerDraft, createOrder, setBannerDraft } = useData();
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('');
  const [processing, setProcessing] = useState(false);

  // Redirect if no draft
  if (!bannerDraft) {
    navigate('/merchant/packages');
    return null;
  }

  const handlePayment = async () => {
    setProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create order
    const transactionId = `TXN${Date.now()}`;
    createOrder({
      merchantId: user!.id,
      merchantName: user!.name,
      locationId: user!.locationId!,
      locationName: user!.locationName!,
      packageId: bannerDraft.packageId,
      packageName: bannerDraft.packageName,
      bannerName: bannerDraft.bannerName,
      imageUrl: bannerDraft.imageUrl,
      startDate: bannerDraft.startDate,
      endDate: bannerDraft.endDate,
      price: bannerDraft.price,
      status: 'under_review',
      transactionId
    });

    // Clear draft
    setBannerDraft(null);

    // Navigate to success page
    navigate('/merchant/payment/success', { state: { transactionId } });
  };

  return (
    <MerchantLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl mb-2">Complete Your Payment</h2>
          <p className="text-gray-600">Review your order and proceed with payment</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Method Selection */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-medium mb-4">Select Payment Method</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => setPaymentMethod('upi')}
                  className={`w-full flex items-center gap-4 p-4 border-2 rounded-lg transition ${
                    paymentMethod === 'upi'
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'upi' ? 'border-indigo-600' : 'border-gray-300'
                  }`}>
                    {paymentMethod === 'upi' && (
                      <div className="w-3 h-3 rounded-full bg-indigo-600" />
                    )}
                  </div>
                  <Smartphone className="w-6 h-6 text-gray-600" />
                  <div className="flex-1 text-left">
                    <p className="font-medium">UPI</p>
                    <p className="text-sm text-gray-500">Pay using UPI ID</p>
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`w-full flex items-center gap-4 p-4 border-2 rounded-lg transition ${
                    paymentMethod === 'netbanking'
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'netbanking' ? 'border-indigo-600' : 'border-gray-300'
                  }`}>
                    {paymentMethod === 'netbanking' && (
                      <div className="w-3 h-3 rounded-full bg-indigo-600" />
                    )}
                  </div>
                  <Building2 className="w-6 h-6 text-gray-600" />
                  <div className="flex-1 text-left">
                    <p className="font-medium">Net Banking</p>
                    <p className="text-sm text-gray-500">Pay via your bank</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Payment Details */}
            {paymentMethod === 'upi' && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-medium mb-4">UPI Payment Details</h3>
                <div>
                  <label htmlFor="upiId" className="block mb-2 text-gray-700">
                    Enter UPI ID
                  </label>
                  <input
                    type="text"
                    id="upiId"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@upi"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Enter your UPI ID (e.g., yourname@paytm, yourname@googlepay)
                  </p>
                </div>
              </div>
            )}

            {paymentMethod === 'netbanking' && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-medium mb-4">Select Your Bank</h3>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition">
                  <option>Select Bank</option>
                  <option>State Bank of India</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                  <option>Kotak Mahindra Bank</option>
                </select>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6 sticky top-6">
              <h3 className="font-medium">Order Summary</h3>

              {/* Banner Preview */}
              <div>
                <img
                  src={bannerDraft.imageUrl}
                  alt={bannerDraft.bannerName}
                  className="w-full rounded-lg mb-3"
                />
                <h4 className="font-medium mb-1">{bannerDraft.bannerName}</h4>
                <p className="text-sm text-gray-600">{bannerDraft.packageName}</p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className="font-medium">{user?.locationName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium capitalize">{bannerDraft.duration}</span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-gray-600">Schedule</span>
                  <div className="text-right">
                    <p className="font-medium">{new Date(bannerDraft.startDate).toLocaleDateString()}</p>
                    <p className="text-gray-500 text-xs">to {new Date(bannerDraft.endDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{bannerDraft.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">GST (18%)</span>
                  <span className="font-medium">₹{(bannerDraft.price * 0.18).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-lg border-t border-gray-200 pt-4">
                  <span className="font-medium">Total Amount</span>
                  <span className="font-medium">₹{(bannerDraft.price * 1.18).toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>Processing...</>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Pay ₹{(bannerDraft.price * 1.18).toLocaleString()}
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                Your payment is secure and encrypted
              </p>
            </div>
          </div>
        </div>
      </div>
    </MerchantLayout>
  );
}
