import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useData } from '../../contexts/DataContext';
import { AdminLayout } from './AdminLayout';
import { Plus, Edit2, MapPin, DollarSign, Check, X } from 'lucide-react';
import type { Location } from '../../contexts/DataContext';

export function LocationManagement() {
  const navigate = useNavigate();
  const { locations, addLocation, updateLocation } = useData();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Location>>({
    name: '',
    address: '',
    tier: 'standard',
    isActive: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      updateLocation(editingId, formData);
      setEditingId(null);
    } else {
      const newLocation: Location = {
        id: `loc${Date.now()}`,
        name: formData.name!,
        address: formData.address!,
        tier: formData.tier!,
        isActive: formData.isActive!
      };
      addLocation(newLocation);
      setIsCreating(false);
    }

    // Reset form
    setFormData({
      name: '',
      address: '',
      tier: 'standard',
      isActive: true
    });
  };

  const handleEdit = (location: Location) => {
    setEditingId(location.id);
    setFormData(location);
    setIsCreating(true);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({
      name: '',
      address: '',
      tier: 'standard',
      isActive: true
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl mb-2">Location Management</h2>
            <p className="text-gray-600">Manage kiosk locations and their configurations</p>
          </div>
          {!isCreating && (
            <button
              onClick={() => setIsCreating(true)}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Location
            </button>
          )}
        </div>

        {/* Create/Edit Form */}
        {isCreating && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-medium mb-6">
              {editingId ? 'Edit Location' : 'Add New Location'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Location Name */}
                <div>
                  <label htmlFor="name" className="block mb-2 text-gray-700">
                    Location Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    placeholder="e.g., Aero Mall"
                    required
                  />
                </div>

                {/* Tier */}
                <div>
                  <label htmlFor="tier" className="block mb-2 text-gray-700">
                    Tier *
                  </label>
                  <select
                    id="tier"
                    value={formData.tier}
                    onChange={(e) => setFormData({ ...formData, tier: e.target.value as 'premium' | 'standard' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    required
                  >
                    <option value="standard">Standard</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block mb-2 text-gray-700">
                  Address *
                </label>
                <input
                  type="text"
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  placeholder="e.g., Airport Road, Bangalore"
                  required
                />
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                />
                <label htmlFor="isActive" className="text-gray-700">
                  Location is Active
                </label>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  {editingId ? 'Update Location' : 'Add Location'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Locations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map(location => (
            <div key={location.id} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`p-2 rounded-lg ${location.tier === 'premium' ? 'bg-purple-100' : 'bg-blue-100'}`}>
                    <MapPin className={`w-5 h-5 ${location.tier === 'premium' ? 'text-purple-600' : 'text-blue-600'}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{location.name}</h3>
                    <p className="text-sm text-gray-600">{location.address}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleEdit(location)}
                  className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs ${location.tier === 'premium'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-blue-100 text-blue-700'
                  }`}>
                  {location.tier === 'premium' ? '⭐' : '📍'} {(location.tier || 'standard').charAt(0).toUpperCase() + (location.tier || 'standard').slice(1)}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs ${location.isActive
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                  }`}>
                  {location.isActive ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                  {location.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <button
                onClick={() => navigate(`/admin/locations/${location.id}/pricing`)}
                className="w-full px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition inline-flex items-center justify-center gap-2 text-sm"
              >
                <DollarSign className="w-4 h-4" />
                Configure Pricing
              </button>
            </div>
          ))}
        </div>

        {locations.length === 0 && !isCreating && (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl mb-2">No Locations Yet</h3>
            <p className="text-gray-600 mb-6">Add your first kiosk location to get started</p>
            <button
              onClick={() => setIsCreating(true)}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Location
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
