import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useData } from '../../contexts/DataContext';
import { AdminLayout } from './AdminLayout';
import { ArrowLeft, DollarSign, Package, AlertCircle, Check, X, Info } from 'lucide-react';
import { Switch } from '../ui/switch'; // Assuming we have a Switch component, or I'll use standard input checkbox if not available. Actually I will use input checkbox to be safe as I don't recall seeing a Switch component in the file list but I can check package.json. package.json has @radix-ui/react-switch.

export function LocationPricingSetup() {
  const { locationId } = useParams();
  const navigate = useNavigate();
  const { locations, packages, locationPricing, setLocationPricing, getLocationPrice, updateLocation } = useData();

  const location = locations.find(loc => loc.id === locationId);
  // Composite key for editing: "packageId-duration"
  const [editedPrices, setEditedPrices] = useState<Record<string, number>>({});

  if (!location) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl mb-2">Location Not Found</h3>
          <button
            onClick={() => navigate('/admin/locations')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Back to Locations
          </button>
        </div>
      </AdminLayout>
    );
  }

  const activePackageIds = location.activePackageIds || [];

  const handleTogglePackage = (packageId: string, isActive: boolean) => {
    const newActiveIds = isActive
      ? [...activePackageIds, packageId]
      : activePackageIds.filter(id => id !== packageId);

    updateLocation(location.id, { activePackageIds: newActiveIds });
  };

  const handlePriceChange = (packageId: string, duration: string, value: string) => {
    const numValue = parseInt(value) || 0;
    const key = `${packageId}-${duration}`;
    setEditedPrices({
      ...editedPrices,
      [key]: numValue
    });
  };

  const handleSave = (packageId: string, duration: string) => {
    const key = `${packageId}-${duration}`;
    const price = editedPrices[key];

    if (price !== undefined) {
      setLocationPricing({
        locationId: location.id,
        packageId,
        duration,
        overridePrice: price > 0 ? price : undefined
      });

      const newEdited = { ...editedPrices };
      delete newEdited[key];
      setEditedPrices(newEdited);
    }
  };

  const handleReset = (packageId: string, duration: string) => {
    const key = `${packageId}-${duration}`;

    setLocationPricing({
      locationId: location.id,
      packageId,
      duration,
      overridePrice: undefined
    });

    const newEdited = { ...editedPrices };
    delete newEdited[key];
    setEditedPrices(newEdited);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <button
            onClick={() => navigate('/admin/locations')}
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Locations
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl mb-2">Location Configuration</h2>
              <div className="flex items-center gap-3">
                <div className={`px-3 py-1.5 rounded-lg ${location.tier === 'premium' ? 'bg-purple-100' : 'bg-blue-100'}`}>
                  <span className={`text-sm ${location.tier === 'premium' ? 'text-purple-700' : 'text-blue-700'}`}>
                    {location.tier === 'premium' ? '⭐ Premium' : '📍 Standard'}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium">{location.name}</h3>
                  <p className="text-sm text-gray-600">{location.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Package Assignment */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-600" />
                Active Packages
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Enable packages available for purchase at this location.
              </p>

              <div className="space-y-4">
                {packages.map(pkg => {
                  const isActive = activePackageIds.includes(pkg.id);
                  return (
                    <div key={pkg.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 transition">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span className={`font-medium ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                          {pkg.name}
                        </span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={isActive}
                          onChange={(e) => handleTogglePackage(pkg.id, e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Pricing Overrides */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <div>
                  <h3 className="font-medium flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                    Pricing Overrides
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Customize prices for enabled packages. Default uses Master Price.
                  </p>
                </div>
              </div>

              {activePackageIds.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <Info className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No active packages. Enable a package to configure pricing.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white border-b border-gray-100">
                      <tr>
                        <th className="px-4 py-3 sm:px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Package / Duration</th>
                        <th className="px-4 py-3 sm:px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Master Price</th>
                        <th className="px-4 py-3 sm:px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Local Price</th>
                        <th className="px-4 py-3 sm:px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                        <th className="px-4 py-3 sm:px-6 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {packages
                        .filter(pkg => activePackageIds.includes(pkg.id))
                        .map(pkg => (
                          <>
                            {/* Package Header Row (Optional, maybe just list slots flat or grouped) */}
                            {/* Let's do grouped rows effectively by iterating slots */}
                            {pkg.durationSlots.map((slot, index) => {
                              const currentPrice = getLocationPrice(location.id, pkg.id, slot.duration);
                              // We need to know if it's overridden. 
                              // getLocationPrice returns the final price. 
                              // We can check if it matches slot.price (Master Price).
                              // Wait, getLocationPrice logic: if override exists, return it. Else master.

                              // We can check locationPricing array directly to see if an override record exists
                              const overrideRecord = locationPricing.find(
                                p => p.locationId === location.id && p.packageId === pkg.id && p.duration === slot.duration
                              );

                              const isOverridden = !!overrideRecord;
                              const key = `${pkg.id}-${slot.duration}`;
                              const editedPrice = editedPrices[key];
                              const displayPrice = editedPrice !== undefined ? editedPrice : (isOverridden ? currentPrice : '');
                              const hasChanges = editedPrice !== undefined;

                              return (
                                <tr key={`${pkg.id}-${slot.id}`} className="hover:bg-gray-50/50 group">
                                  <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                      <span className="font-medium text-gray-900">{pkg.name}</span>
                                      <span className="text-sm text-gray-500 capitalize">{slot.duration}</span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">
                                    <span className="text-sm text-gray-500 font-mono">
                                      ₹{slot.price.toLocaleString()}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="relative">
                                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">₹</span>
                                      </div>
                                      <input
                                        type="number"
                                        value={displayPrice}
                                        onChange={(e) => handlePriceChange(pkg.id, slot.duration, e.target.value)}
                                        placeholder={slot.price.toString()}
                                        className={`pl-7 w-32 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm transition ${isOverridden ? 'border-purple-300 bg-purple-50' : 'border-gray-200'
                                          }`}
                                        min="0"
                                      />
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">
                                    {hasChanges ? (
                                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                        Unsaved
                                      </span>
                                    ) : isOverridden ? (
                                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                        Custom
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                        Default
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      {hasChanges && (
                                        <button
                                          onClick={() => handleSave(pkg.id, slot.duration)}
                                          className="p-1.5 text-green-600 hover:bg-green-50 rounded transition"
                                          title="Save Price"
                                        >
                                          <Check className="w-4 h-4" />
                                        </button>
                                      )}
                                      {(isOverridden || hasChanges) && (
                                        <button
                                          onClick={() => handleReset(pkg.id, slot.duration)}
                                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
                                          title="Reset to Default"
                                        >
                                          <X className="w-4 h-4" />
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
