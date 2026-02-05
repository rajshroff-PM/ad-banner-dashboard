import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useData } from '../../contexts/DataContext';
import { AdminLayout } from './AdminLayout';
import { MapPin, Package as PackageIcon, ArrowRight, Check, Smartphone, Search } from 'lucide-react';

export function AdminBannerSetup() {
    const navigate = useNavigate();
    const { locations, packages, getLocationPrice, merchants } = useData();
    // const [merchants] = useState([]); // Placeholder if not in context yet, but we added it.

    const [selectedLocationId, setSelectedLocationId] = useState('');
    const [locationSearchQuery, setLocationSearchQuery] = useState('');
    const [selectedMerchantId, setSelectedMerchantId] = useState('');
    const [merchantSearchQuery, setMerchantSearchQuery] = useState('');
    const [selectedPackageId, setSelectedPackageId] = useState('');
    const [selectedDuration, setSelectedDuration] = useState('');
    const [price, setPrice] = useState(0);

    // Filter locations based on search
    const filteredLocations = useMemo(() => {
        if (!locationSearchQuery.trim()) return locations;
        const query = locationSearchQuery.toLowerCase();
        return locations.filter(loc =>
            loc.name.toLowerCase().includes(query) ||
            loc.address.toLowerCase().includes(query)
        );
    }, [locations, locationSearchQuery]);

    // Filter available merchants for selected location
    // Filter available merchants for selected location with search
    const availableMerchants = useMemo(() => {
        if (!selectedLocationId) return [];
        let filtered = merchants.filter(m => m.locationId === selectedLocationId);

        if (merchantSearchQuery.trim()) {
            const query = merchantSearchQuery.toLowerCase();
            filtered = filtered.filter(m =>
                m.name.toLowerCase().includes(query) ||
                m.email.toLowerCase().includes(query)
            );
        }

        return filtered;
    }, [selectedLocationId, merchants, merchantSearchQuery]);

    // Filter valid packages for selected location
    const availablePackages = useMemo(() => {
        if (!selectedLocationId) return [];
        const location = locations.find(l => l.id === selectedLocationId);
        if (!location || !location.activePackageIds) return [];
        return packages.filter(p => location.activePackageIds!.includes(p.id));
    }, [selectedLocationId, locations, packages]);

    const handleSelectPackage = (pkgId: string, duration: string) => {
        setSelectedPackageId(pkgId);
        setSelectedDuration(duration);
        const p = getLocationPrice(selectedLocationId, pkgId, duration);
        setPrice(p);
    };

    const handleProceed = () => {
        const pkg = packages.find(p => p.id === selectedPackageId);
        const merchant = merchants.find(m => m.id === selectedMerchantId);

        if (selectedLocationId && selectedMerchantId && selectedPackageId && pkg && selectedDuration && merchant) {
            navigate('/admin/banner/create', {
                state: {
                    packageId: pkg.id,
                    packageName: pkg.name,
                    price: price,
                    duration: selectedDuration,
                    merchantId: merchant.id,
                    merchantName: merchant.name
                }
            });
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h2 className="text-2xl mb-2">Create New Banner</h2>
                    <p className="text-gray-600">Publish a banner directly to any location (skips payment)</p>
                </div>

                {/* Step 1: Select Location */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-medium">1</div>
                        <h3 className="text-lg font-medium">Select Location</h3>
                    </div>

                    {/* Location Search Bar */}
                    <div className="mb-4 relative">
                        <div className="flex items-center gap-3 w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent transition-all">
                            <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            <input
                                type="text"
                                placeholder="Search locations by name or address..."
                                value={locationSearchQuery}
                                onChange={(e) => setLocationSearchQuery(e.target.value)}
                                className="w-full border-none focus:outline-none text-sm placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredLocations.length === 0 ? (
                            <p className="col-span-full text-gray-500 italic text-center py-4">No locations found matching your search.</p>
                        ) : (
                            filteredLocations.map(loc => (
                                <button
                                    key={loc.id}
                                    onClick={() => {
                                        setSelectedLocationId(loc.id);
                                        setSelectedMerchantId('');
                                        setMerchantSearchQuery('');
                                        setSelectedPackageId('');
                                        setSelectedPackageId('');
                                        setSelectedDuration('');
                                    }}
                                    className={`p-4 rounded-lg border-2 text-left transition ${selectedLocationId === loc.id
                                        ? 'border-purple-600 bg-purple-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <MapPin className={`w-4 h-4 ${selectedLocationId === loc.id ? 'text-purple-600' : 'text-gray-400'}`} />
                                        <span className="font-medium">{loc.name}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 pl-6">{loc.address}</p>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Step 2: Select Merchant */}
                {selectedLocationId && (
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-medium">2</div>
                            <h3 className="text-lg font-medium">Select Merchant</h3>
                        </div>

                        {/* Search Bar */}
                        <div className="mb-4 relative">
                            <div className="flex items-center gap-3 w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent transition-all">
                                <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Search merchants by name or email..."
                                    value={merchantSearchQuery}
                                    onChange={(e) => setMerchantSearchQuery(e.target.value)}
                                    className="w-full border-none focus:outline-none text-sm placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        {availableMerchants.length === 0 ? (
                            <p className="text-gray-500 italic">No merchants found for this location.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {availableMerchants.map(merchant => (
                                    <button
                                        key={merchant.id}
                                        onClick={() => {
                                            setSelectedMerchantId(merchant.id);
                                            // Reset subsequent steps if needed, generally keeping package selection is fine though 
                                            // unless packages depend on merchant (they don't currently)
                                        }}
                                        className={`p-4 rounded-lg border-2 text-left transition ${selectedMerchantId === merchant.id
                                            ? 'border-purple-600 bg-purple-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs">
                                                {merchant.name.charAt(0)}
                                            </div>
                                            <span className="font-medium">{merchant.name}</span>
                                        </div>
                                        <p className="text-sm text-gray-500 pl-10">{merchant.email}</p>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Step 3: Select Package & Duration */}
                {selectedLocationId && selectedMerchantId && (
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-medium">3</div>
                            <h3 className="text-lg font-medium">Select Package Configuration</h3>
                        </div>

                        {availablePackages.length === 0 ? (
                            <p className="text-gray-500 italic">No active packages found for this location.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {availablePackages.map(pkg => (
                                    <div key={pkg.id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <PackageIcon className="w-5 h-5 text-gray-400" />

                                            <h4 className="font-medium">{pkg.name}</h4>
                                            {pkg.includeMobileApp && (
                                                <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs rounded-full border border-indigo-100">
                                                    <Smartphone className="w-3 h-3" /> Mobile App
                                                </span>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            {pkg.durationSlots.map((slot, idx) => {
                                                const slotPrice = getLocationPrice(selectedLocationId, pkg.id, slot.duration);
                                                const isSelected = selectedPackageId === pkg.id && selectedDuration === slot.duration;

                                                return (
                                                    <button
                                                        key={idx}
                                                        onClick={() => handleSelectPackage(pkg.id, slot.duration)}
                                                        className={`w-full flex justify-between items-center p-3 rounded border transition ${isSelected
                                                            ? 'border-purple-600 bg-purple-50 text-purple-700'
                                                            : 'border-gray-100 hover:border-gray-200'
                                                            }`}
                                                    >
                                                        <span className="capitalize text-sm font-medium">{slot.duration}</span>
                                                        <div className="flex items-center gap-3">
                                                            <span className="font-bold text-sm">₹{slotPrice.toLocaleString()}</span>
                                                            {isSelected && <Check className="w-4 h-4 text-purple-600" />}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Action */}
                <div className="flex justify-end">
                    <button
                        onClick={handleProceed}
                        disabled={!selectedLocationId || !selectedMerchantId || !selectedPackageId || !selectedDuration}
                        className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition font-medium text-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Continue to Banner Details
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
}
