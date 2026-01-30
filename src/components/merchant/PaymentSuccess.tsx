import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { MerchantLayout } from './MerchantLayout';
import { CheckCircle, ArrowRight, FileText } from 'lucide-react';

export function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const transactionId = location.state?.transactionId;

  useEffect(() => {
    // Redirect if no transaction ID
    if (!transactionId) {
      navigate('/merchant/dashboard');
    }
  }, [transactionId, navigate]);

  if (!transactionId) {
    return null;
  }

  return (
    <MerchantLayout>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          {/* Success Message */}
          <h2 className="text-3xl mb-3">Payment Successful!</h2>
          <p className="text-gray-600 text-lg mb-8">
            Your banner has been submitted for review
          </p>

          {/* Transaction Details */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-600">Transaction ID</span>
            </div>
            <p className="text-lg font-mono">{transactionId}</p>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 text-left">
            <h3 className="font-medium text-blue-900 mb-3">What happens next?</h3>
            <ol className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="font-medium">1.</span>
                <span>Our team will review your banner (usually within 24 hours)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium">2.</span>
                <span>You'll receive a notification once your banner is approved</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium">3.</span>
                <span>Your banner will go live on both Kiosk and Mobile App automatically</span>
              </li>
            </ol>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/merchant/orders')}
              className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition inline-flex items-center justify-center gap-2"
            >
              View Order Status
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/merchant/dashboard')}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </MerchantLayout>
  );
}
