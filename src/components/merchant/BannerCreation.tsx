import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { MerchantLayout } from './MerchantLayout';
import { AdminLayout } from '../admin/AdminLayout';
import { Upload, Calendar, Clock, Smartphone } from 'lucide-react';

export function BannerCreation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { setBannerDraft, createOrder, packages } = useData();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAdmin = user?.role === 'admin';
  const Layout = isAdmin ? AdminLayout : MerchantLayout;

  const packageInfo = location.state as {
    packageId: string;
    packageName: string;
    price: number;
    duration: 'monthly' | 'quarterly';
  } || null;

  // Get full package details
  const selectedPackage = packages.find(p => p.id === packageInfo?.packageId);

  const [bannerName, setBannerName] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [fromTime, setFromTime] = useState('09:00');
  const [toTime, setToTime] = useState('21:00');
  const [displayOnMobile, setDisplayOnMobile] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [remark, setRemark] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const REMARK_LIMIT = 500;

  // Redirect if no package selected - moved to useEffect
  useEffect(() => {
    if (!packageInfo) {
      navigate(isAdmin ? '/admin/banners/create' : '/merchant/packages');
    }
  }, [packageInfo, navigate, isAdmin]);

  // Don't render if no package info
  if (!packageInfo || !selectedPackage) {
    return null;
  }

  // Calculate end date based on package duration
  const calculateEndDate = (start: string, duration: 'monthly' | 'quarterly') => {
    if (!start) return '';
    const startDate = new Date(start);
    const months = duration === 'monthly' ? 1 : 3;
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + months);
    return endDate.toISOString().split('T')[0];
  };

  const endDate = fromDate ? calculateEndDate(fromDate, packageInfo.duration) : '';

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: 'Please upload an image file' }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image size should be less than 5MB' }));
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // In production, upload to server and get URL
      setImageUrl(`https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800`);
      setErrors(prev => ({ ...prev, image: '' }));
    }
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};

    if (!bannerName.trim()) {
      newErrors.bannerName = 'Banner name is required';
    }
    if (!fromDate) {
      newErrors.fromDate = 'Start date is required';
    }
    if (!toDate) {
      newErrors.toDate = 'End date is required';
    }
    if (!fromTime) {
      newErrors.fromTime = 'Start time is required';
    }
    if (!toTime) {
      newErrors.toTime = 'End time is required';
    }
    if (!imageUrl) {
      newErrors.image = 'Banner image is required';
    }

    // Validate date range
    if (fromDate && toDate && new Date(fromDate) >= new Date(toDate)) {
      newErrors.toDate = 'End date must be after start date';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Save draft and proceed to payment
    // If Admin, create order directly (Skip Payment/Approval)
    if (isAdmin) {
      const transactionId = `ADM${Date.now()}`;
      // Use selected merchant if available (from admin flow), otherwise current user (fallback)
      const merchantId = (packageInfo as any).merchantId || user!.id;
      const merchantName = (packageInfo as any).merchantName || user!.name;

      createOrder({
        merchantId,
        merchantName,
        locationId: user!.locationId || 'admin-loc', // Admin might not have locationId? 
        locationName: user!.locationName || 'Admin Location',
        packageId: packageInfo.packageId,
        packageName: packageInfo.packageName,
        bannerName,
        imageUrl,
        startDate: fromDate,
        endDate: toDate,
        price: packageInfo.price,
        status: 'active', // Direct Live
        transactionId,
        approvalStage: 'final_approval',
        approvedBy: ['admin'],
        displayOnMobile,
        remark: remark.trim()
      });
      navigate('/admin/approvals'); // Return to list
      return;
    }

    // Save draft and proceed to payment (Merchant Flow)
    setBannerDraft({
      packageId: packageInfo.packageId,
      packageName: packageInfo.packageName,
      bannerName,
      startDate: fromDate,
      endDate: toDate,
      imageUrl,
      price: packageInfo.price,
      duration: packageInfo.duration,
      displayOnMobile,
      remark: remark.trim()
    });

    navigate('/merchant/payment');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl mb-2">Configure Your Banner</h2>
          <p className="text-gray-600">
            Enter details for your <span className="text-purple-600 font-medium">{packageInfo.packageName}</span> campaign
          </p>
        </div>

        {/* Section 1: Basic Information */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-medium">
              1
            </div>
            <h3 className="text-lg font-medium">Basic Information</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Banner Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={bannerName}
              onChange={(e) => {
                setBannerName(e.target.value);
                setErrors(prev => ({ ...prev, bannerName: '' }));
              }}
              placeholder="e.g., Summer Seasonal Launch"
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.bannerName ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {errors.bannerName && (
              <p className="text-sm text-red-500 mt-1">{errors.bannerName}</p>
            )}
          </div>

          {/* Package Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Slot Type</p>
              <p className="font-medium">{packageInfo.duration === 'monthly' ? 'Monthly' : 'Quarterly'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Slides / Day</p>
              <p className="font-medium">{selectedPackage.slidesPerDay}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Visibility</p>
              <p className="font-medium">{selectedPackage.slidesDuration}s</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Repeats</p>
              <p className="font-medium">{selectedPackage.repeatCount}</p>
            </div>
          </div>

          {/* Mobile App Option */}
          {selectedPackage.includeMobileApp && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="flex items-center h-6">
                  <input
                    type="checkbox"
                    checked={displayOnMobile}
                    onChange={(e) => setDisplayOnMobile(e.target.checked)}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 border-gray-300"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 font-medium text-gray-900">
                    <Smartphone className="w-4 h-4 text-purple-600" />
                    Also display on Mobile App
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Extend your reach by showing this banner to mobile app users in addition to kiosks.
                  </p>
                </div>
              </label>
            </div>
          )}
        </div>





        {/* Section 2: Schedule Configuration */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-medium">
              2
            </div>
            <h3 className="text-lg font-medium">Schedule Configuration</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* From Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => {
                    setFromDate(e.target.value);
                    setErrors(prev => ({ ...prev, fromDate: '' }));
                  }}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.fromDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
              </div>
              {errors.fromDate && (
                <p className="text-sm text-red-500 mt-1">{errors.fromDate}</p>
              )}
            </div>

            {/* To Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => {
                    setToDate(e.target.value);
                    setErrors(prev => ({ ...prev, toDate: '' }));
                  }}
                  min={fromDate || new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.toDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
              </div>
              {errors.toDate && (
                <p className="text-sm text-red-500 mt-1">{errors.toDate}</p>
              )}
            </div>

            {/* From Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Time <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={fromTime}
                  onChange={(e) => {
                    setFromTime(e.target.value);
                    setErrors(prev => ({ ...prev, fromTime: '' }));
                  }}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.fromTime ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
              </div>
              {errors.fromTime && (
                <p className="text-sm text-red-500 mt-1">{errors.fromTime}</p>
              )}
            </div>

            {/* To Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Time <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={toTime}
                  onChange={(e) => {
                    setToTime(e.target.value);
                    setErrors(prev => ({ ...prev, toTime: '' }));
                  }}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.toTime ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
              </div>
              {errors.toTime && (
                <p className="text-sm text-red-500 mt-1">{errors.toTime}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Banner Creative */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-medium">
              3
            </div>
            <h3 className="text-lg font-medium">Banner Creative</h3>
          </div>

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Banner preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  onClick={() => {
                    setImagePreview('');
                    setImageUrl('');
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  className="absolute top-4 right-4 bg-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-100 transition text-sm font-medium"
                >
                  Change Image
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`w-full border-2 border-dashed rounded-lg p-12 hover:border-purple-400 hover:bg-purple-50 transition text-center ${errors.image ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 mb-1">Click to upload your banner image</p>
                    <p className="text-sm text-purple-600">High resolution JPG or PNG (1920x1080 recommended)</p>
                  </div>
                </div>
              </button>
            )}
            {errors.image && (
              <p className="text-sm text-red-500 mt-2">{errors.image}</p>
            )}
          </div>
        </div>

        {/* Section: Additional Remarks */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-medium">
              4
            </div>
            <h3 className="text-lg font-medium">Additional Remarks</h3>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Remarks (Optional)
            </label>
            <textarea
              value={remark}
              onChange={(e) => {
                if (e.target.value.length <= REMARK_LIMIT) {
                  setRemark(e.target.value);
                }
              }}
              rows={4}
              placeholder="Add any specific instructions or notes for this banner..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
            <div className="flex justify-end mt-1">
              <span className={`text-xs ${remark.length >= REMARK_LIMIT ? 'text-red-500' : 'text-gray-500'}`}>
                {remark.length}/{REMARK_LIMIT} characters
              </span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-4">
          <button
            onClick={handleSubmit}
            className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition font-medium text-lg"
          >
            {isAdmin ? 'Publish Live Banner' : 'Review & Make Payment'}
          </button>
        </div>
      </div >
    </Layout >
  );
}