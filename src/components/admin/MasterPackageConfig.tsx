import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { AdminLayout } from './AdminLayout';
import { Plus, Edit2, Trash2, Check, X, Clock, BarChart3, Smartphone } from 'lucide-react';
import type { Package, PackageDurationSlot } from '../../contexts/DataContext';

export function MasterPackageConfig() {
  const { packages, locations, addPackage, updatePackage, deletePackage, updateLocation } = useData();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [autoAssign, setAutoAssign] = useState(true);

  // Package Form State
  const [formData, setFormData] = useState<Partial<Package>>({
    name: '',
    slidesPerDay: 30,
    slidesDuration: 8,
    repeatCount: 3,
    features: [],
    hasStoreDirection: false,
    analytics: false,
    includeMobileApp: false,
    durationSlots: []
  });

  const [featureInput, setFeatureInput] = useState('');

  // Slot Input State
  const [slotInput, setSlotInput] = useState<Partial<PackageDurationSlot>>({
    duration: 'monthly',
    price: 3000
  });

  const resetForm = () => {
    setFormData({
      name: '',
      slidesPerDay: 30,
      slidesDuration: 8,
      repeatCount: 3,
      features: [],
      hasStoreDirection: false,
      analytics: false,
      includeMobileApp: false,
      durationSlots: []
    });
    setFeatureInput('');
    setSlotInput({ duration: 'monthly', price: 3000 });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation: At least one slot
    if (!formData.durationSlots || formData.durationSlots.length === 0) {
      alert('Please add at least one Duration Slot');
      return;
    }

    if (editingId) {
      updatePackage(editingId, formData);
      setEditingId(null);
    } else {
      const newPackage: Package = {
        id: `pkg${Date.now()}`,
        name: formData.name!,
        slidesPerDay: formData.slidesPerDay!,
        slidesDuration: formData.slidesDuration!,
        repeatCount: formData.repeatCount!,
        features: formData.features!,
        hasStoreDirection: formData.hasStoreDirection!,
        analytics: formData.analytics || false,
        includeMobileApp: formData.includeMobileApp || false,
        durationSlots: formData.durationSlots!
      };
      addPackage(newPackage);

      // Auto-assign to all locations if selected
      if (autoAssign) {
        locations.forEach(loc => {
          const currentActive = loc.activePackageIds || [];
          if (!currentActive.includes(newPackage.id)) {
            updateLocation(loc.id, {
              activePackageIds: [...currentActive, newPackage.id]
            });
          }
        });
      }

      setIsCreating(false);
      resetForm();
    }
  };



  const handleEdit = (pkg: Package) => {
    setEditingId(pkg.id);
    setFormData(pkg);
    setIsCreating(true);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    resetForm();
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData({
        ...formData,
        features: [...(formData.features || []), featureInput.trim()]
      });
      setFeatureInput('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features?.filter((_, i) => i !== index) || []
    });
  };

  const addSlot = () => {
    if (slotInput.price && slotInput.price > 0 && slotInput.duration) {
      const newSlot: PackageDurationSlot = {
        id: `slot${Date.now()}`,
        duration: slotInput.duration,
        price: slotInput.price
      };

      setFormData({
        ...formData,
        durationSlots: [...(formData.durationSlots || []), newSlot]
      });

      // Reset generic values but keep reasonable defaults
      setSlotInput({ ...slotInput, price: 0 });
    }
  };

  const removeSlot = (index: number) => {
    setFormData({
      ...formData,
      durationSlots: formData.durationSlots?.filter((_, i) => i !== index) || []
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl mb-2">Master Package Configuration</h2>
            <p className="text-gray-600">Create generic master packages with flexible pricing slots</p>
          </div>
          {!isCreating && (
            <button
              onClick={() => setIsCreating(true)}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Master Package
            </button>
          )}
        </div>

        {/* Create/Edit Form */}
        {isCreating && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-medium mb-6">
              {editingId ? 'Edit Package' : 'Create New Master Package'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-8">

              {/* 1. Master Package Details */}
              <div className="space-y-4">
                <h4 className="text-sm uppercase tracking-wider text-gray-500 font-semibold border-b pb-2">
                  Feature Configuration
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Package Name */}
                  <div>
                    <label htmlFor="name" className="block mb-2 text-gray-700">
                      Package Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      placeholder="e.g., Gold Tier, Premium Display"
                      required
                    />
                  </div>

                  {/* Slides Per Day */}
                  <div>
                    <label htmlFor="slidesPerDay" className="block mb-2 text-gray-700">
                      Slides Per Day *
                    </label>
                    <input
                      type="number"
                      id="slidesPerDay"
                      value={formData.slidesPerDay}
                      onChange={(e) => setFormData({ ...formData, slidesPerDay: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      min="1"
                      required
                    />
                  </div>

                  {/* Slide Duration */}
                  <div>
                    <label htmlFor="slidesDuration" className="block mb-2 text-gray-700">
                      Slide Duration (seconds) *
                    </label>
                    <input
                      type="number"
                      id="slidesDuration"
                      value={formData.slidesDuration}
                      onChange={(e) => setFormData({ ...formData, slidesDuration: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      min="1"
                      required
                    />
                  </div>

                  {/* Repeat Count */}
                  <div>
                    <label htmlFor="repeatCount" className="block mb-2 text-gray-700">
                      Content Repeat Count *
                    </label>
                    <input
                      type="number"
                      id="repeatCount"
                      value={formData.repeatCount}
                      onChange={(e) => setFormData({ ...formData, repeatCount: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      min="1"
                      required
                    />
                  </div>
                </div>



                {/* Feature Flags Grid */}
                <div className="pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Enabled Features</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Analytics */}
                    <div
                      onClick={() => setFormData({ ...formData, analytics: !formData.analytics })}
                      className={`cursor-pointer border rounded-lg p-4 flex items-start gap-3 transition-all ${formData.analytics
                        ? 'border-purple-600 bg-purple-50 ring-1 ring-purple-600'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                        }`}
                    >
                      <div className={`mt-0.5 p-1.5 rounded-md ${formData.analytics ? 'bg-purple-200 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>
                        <BarChart3 className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className={`font-medium ${formData.analytics ? 'text-purple-900' : 'text-gray-900'}`}>Analytics</h5>
                        <p className={`text-xs mt-0.5 ${formData.analytics ? 'text-purple-700' : 'text-gray-500'}`}>
                          Detailed engagement reports
                        </p>
                      </div>
                      <div className="ml-auto">
                        {formData.analytics ? (
                          <div className="bg-purple-600 text-white rounded-full p-0.5">
                            <Check className="w-3 h-3" />
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-gray-300" />
                        )}
                      </div>
                    </div>

                    {/* Store Direction */}
                    <div
                      onClick={() => setFormData({ ...formData, hasStoreDirection: !formData.hasStoreDirection })}
                      className={`cursor-pointer border rounded-lg p-4 flex items-start gap-3 transition-all ${formData.hasStoreDirection
                        ? 'border-green-600 bg-green-50 ring-1 ring-green-600'
                        : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                        }`}
                    >
                      <div className={`mt-0.5 p-1.5 rounded-md ${formData.hasStoreDirection ? 'bg-green-200 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className={`font-medium ${formData.hasStoreDirection ? 'text-green-900' : 'text-gray-900'}`}>Store Direction</h5>
                        <p className={`text-xs mt-0.5 ${formData.hasStoreDirection ? 'text-green-700' : 'text-gray-500'}`}>
                          One-click navigation
                        </p>
                      </div>
                      <div className="ml-auto">
                        {formData.hasStoreDirection ? (
                          <div className="bg-green-600 text-white rounded-full p-0.5">
                            <Check className="w-3 h-3" />
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-gray-300" />
                        )}
                      </div>
                    </div>

                    {/* Mobile App */}
                    <div
                      onClick={() => setFormData({ ...formData, includeMobileApp: !formData.includeMobileApp })}
                      className={`cursor-pointer border rounded-lg p-4 flex items-start gap-3 transition-all ${formData.includeMobileApp
                        ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600'
                        : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                        }`}
                    >
                      <div className={`mt-0.5 p-1.5 rounded-md ${formData.includeMobileApp ? 'bg-indigo-200 text-indigo-700' : 'bg-gray-100 text-gray-500'}`}>
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className={`font-medium ${formData.includeMobileApp ? 'text-indigo-900' : 'text-gray-900'}`}>Mobile App</h5>
                        <p className={`text-xs mt-0.5 ${formData.includeMobileApp ? 'text-indigo-700' : 'text-gray-500'}`}>
                          Sync to mobile devices
                        </p>
                      </div>
                      <div className="ml-auto">
                        {formData.includeMobileApp ? (
                          <div className="bg-indigo-600 text-white rounded-full p-0.5">
                            <Check className="w-3 h-3" />
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-gray-300" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Duration Slots */}
              <div className="space-y-4">
                <h4 className="text-sm uppercase tracking-wider text-gray-500 font-semibold border-b pb-2 flex justify-between items-center">
                  <span>Pricing & Duration Slots *</span>
                  <span className="text-xs normal-case text-gray-400 font-normal">At least one required</span>
                </h4>

                {/* Existing Slots List */}
                {formData.durationSlots && formData.durationSlots.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    {formData.durationSlots.map((slot, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-100">
                        <div>
                          <div className="font-semibold capitalize text-purple-900">{slot.duration}</div>
                          <div className="text-purple-700">₹{slot.price.toLocaleString()}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSlot(index)}
                          className="text-red-500 hover:text-red-700 p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg text-sm mb-4">
                    No slots added yet. Add at least one pricing slot below.
                  </div>
                )}

                {/* Add New Slot */}
                <div className="flex gap-4 items-end bg-gray-50 p-4 rounded-lg">
                  <div className="flex-1">
                    <label className="block text-sm text-gray-600 mb-1">Duration</label>
                    <select
                      value={slotInput.duration}
                      onChange={(e) => setSlotInput({ ...slotInput, duration: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    >
                      <option value="hourly">Hourly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm text-gray-600 mb-1">Price (₹)</label>
                    <input
                      type="number"
                      value={slotInput.price}
                      onChange={(e) => setSlotInput({ ...slotInput, price: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      min="0"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addSlot}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2 h-[42px]"
                  >
                    <Plus className="w-4 h-4" />
                    Add Slot
                  </button>
                </div>
              </div>

              {/* 3. Features */}
              <div className="space-y-4">
                <h4 className="text-sm uppercase tracking-wider text-gray-500 font-semibold border-b pb-2">
                  Included Attributes
                </h4>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      placeholder="Add a custom feature (e.g. 'Priority Support')..."
                    />
                    <button
                      type="button"
                      onClick={addFeature}
                      className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                    >
                      Add
                    </button>
                  </div>

                  {formData.features && formData.features.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                          <Check className="w-3 h-3 text-green-600" />
                          <span className="text-sm">{feature}</span>
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="text-gray-400 hover:text-red-500 ml-1"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end items-center gap-3 pt-6 border-t border-gray-200">
                {!editingId && (
                  <label className="flex items-center gap-2 text-sm text-gray-700 mr-auto">
                    <input
                      type="checkbox"
                      checked={autoAssign}
                      onChange={(e) => setAutoAssign(e.target.checked)}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 border-gray-300"
                    />
                    Make available at all locations
                  </label>
                )}
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition shadow-lg shadow-purple-200"
                >
                  {editingId ? 'Update Master Package' : 'Create Master Package'}
                </button>
              </div>
            </form>
          </div>
        )
        }

        {/* Packages List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map(pkg => (
            <div key={pkg.id} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 hover:shadow-lg transition duration-200">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{pkg.name}</h3>
                  <div className="flex gap-2 mt-1">
                    {pkg.analytics && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded border border-blue-100">
                        <BarChart3 className="w-3 h-3" /> Analytics
                      </span>
                    )}
                    {pkg.hasStoreDirection && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded border border-green-100">
                        <MapPin className="w-3 h-3" /> Direction
                      </span>
                    )}
                    {pkg.includeMobileApp && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs rounded border border-indigo-100">
                        <Smartphone className="w-3 h-3" /> App
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(pkg)}
                    className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this package?')) {
                        deletePackage(pkg.id);
                      }
                    }}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Slots Preview */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Available Options</div>
                <div className="space-y-2">
                  {pkg.durationSlots.map((slot, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="capitalize text-gray-700">{slot.duration}</span>
                      <span className="font-medium text-gray-900">₹{slot.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 text-sm pt-2 border-t border-gray-100">
                <div className="flex justify-between">
                  <span className="text-gray-500">Slides/Day:</span>
                  <span className="font-medium text-gray-900">{pkg.slidesPerDay}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Duration:</span>
                  <span className="font-medium text-gray-900">{pkg.slidesDuration}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Repeat:</span>
                  <span className="font-medium text-gray-900">{pkg.repeatCount}x</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div >
    </AdminLayout >
  );
}

// Icon helper
function MapPin({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
