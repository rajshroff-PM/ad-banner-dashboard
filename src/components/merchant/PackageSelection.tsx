import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { MerchantLayout } from './MerchantLayout';
import { Check, Zap, TrendingUp, MapPin, Smartphone } from 'lucide-react';
import type { Package, PackageDurationSlot } from '../../contexts/DataContext';

export function PackageSelection() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { packages, locations, getLocationPrice } = useData();

  const location = locations.find(loc => loc.id === user?.locationId);
  const activePackageIds = location?.activePackageIds || [];
  const availablePackages = packages.filter(pkg => activePackageIds.includes(pkg.id));

  const handleSelectPackage = (pkg: Package, slot: PackageDurationSlot, price: number) => {
    navigate('/merchant/banner/new', {
      state: {
        packageId: pkg.id,
        packageName: pkg.name,
        price,
        duration: slot.duration
      }
    });
  };

  return (
    <MerchantLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm mb-4">
            <MapPin className="w-4 h-4" />
            Pricing for {user?.locationName}
          </div>
          <h2 className="text-3xl mb-3">Choose Your Advertising Package</h2>
          <p className="text-gray-600 text-lg">
            Create once, publish everywhere — Your banners sync to both Kiosk and Mobile App
          </p>
        </div>

        {/* Features Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Instant Sync</h4>
                <p className="text-sm text-indigo-100">Automatically syncs to kiosks and mobile apps</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Maximum Reach</h4>
                <p className="text-sm text-indigo-100">Get visibility on multiple platforms</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Quality Assured</h4>
                <p className="text-sm text-indigo-100">Admin approval ensures brand safety</p>
              </div>
            </div>
          </div>
        </div>

        {/* Packages Grid */}
        <div>
          <h3 className="text-xl mb-4">Available Packages</h3>
          {availablePackages.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-200">
              <p className="text-gray-500 text-lg">No packages are currently available for this location.</p>
              <p className="text-gray-400 text-sm mt-2">Please contact support or your administrator.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availablePackages.map(pkg => (
                <div
                  key={pkg.id}
                  className="bg-white rounded-2xl border-2 border-gray-200 hover:border-indigo-400 transition p-6 flex flex-col h-full"
                >
                  <div className="mb-6">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xl font-bold text-gray-900">{pkg.name}</h4>
                      {pkg.includeMobileApp && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs rounded-full border border-indigo-100">
                          <Smartphone className="w-3 h-3" /> Mobile App
                        </span>
                      )}
                    </div>

                    {/* Features List for Package */}
                    <ul className="space-y-3 mb-6 flex-1">
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{pkg.slidesPerDay} Slides / Day</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{pkg.slidesDuration} Seconds Duration</span>
                      </li>
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Pricing Slots */}
                    <div className="space-y-3 mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm font-semibold text-gray-500 uppercase">Select Plan</p>
                      {pkg.durationSlots.map((slot) => {
                        const finalPrice = getLocationPrice(user?.locationId || '', pkg.id, slot.duration);

                        return (
                          <div key={slot.id} className="flex flex-col gap-2">
                            <button
                              onClick={() => handleSelectPackage(pkg, slot, finalPrice)}
                              className="flex items-center justify-between w-full p-3 rounded-lg border border-gray-200 hover:border-indigo-600 hover:bg-indigo-50 transition group"
                            >
                              <span className="capitalize font-medium text-gray-700 group-hover:text-indigo-700">
                                {slot.duration}
                              </span>
                              <span className="font-bold text-indigo-600">
                                ₹{finalPrice.toLocaleString()}
                              </span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h4 className="font-medium mb-2 text-blue-900">How It Works</h4>
          <ol className="space-y-2 text-sm text-blue-800">
            <li>1. Select a package that fits your needs</li>
            <li>2. Upload your banner creative and schedule dates</li>
            <li>3. Complete payment via UPI or Net Banking</li>
            <li>4. Our team reviews and approves your banner (usually within 24 hours)</li>
            <li>5. Your banner goes live on both Kiosk displays and Mobile App!</li>
          </ol>
        </div>
      </div>
    </MerchantLayout>
  );
}
