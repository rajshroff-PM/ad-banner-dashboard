import { createContext, useContext, useState, ReactNode } from 'react';

export interface PackageDurationSlot {
  id: string;
  duration: 'monthly' | 'quarterly' | 'yearly' | 'hourly';
  price: number;
}

export interface Package {
  id: string;
  name: string;
  slidesPerDay: number;
  slidesDuration: number; // in seconds
  repeatCount: number;
  durationSlots: PackageDurationSlot[];
  features: string[];
  hasStoreDirection: boolean;
  analytics: boolean;
  includeMobileApp?: boolean; // Mobile app sync
  group?: 'location' | 'variant' | 'custom'; // Package groups
  priceGroup?: string; // Price group identifier
}

export interface LocationGroup {
  id: string;
  name: string;
  tier: 'tier1' | 'tier2' | 'tier3' | 'tier4' | 'tier5' | 'standard' | 'premium';
  description?: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  tier: 'premium' | 'standard';
  isActive: boolean;
  groupId?: string; // Reference to LocationGroup
  parentLocationId?: string; // For sub-locations
  activePackageIds?: string[]; // Array of package IDs active at this location
}

export interface LocationPricing {
  locationId: string;
  packageId: string;
  duration?: string; // matching duration slot
  overridePrice?: number; // If set, overrides base package price
}

export interface BannerOrder {
  id: string;
  merchantId: string;
  merchantName: string;
  locationId: string;
  locationName: string;
  packageId: string;
  packageName: string;
  bannerName: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  price: number;
  status: 'upcoming' | 'scheduled' | 'under_review' | 'approved' | 'rejected' | 'active' | 'past';
  approvalStage?: 'pending' | 'second_approver' | 'scheduler' | 'final_approval'; // Multi-stage approval
  rejectionReason?: string;
  createdAt: string;
  transactionId?: string;
  paidWithCredits?: boolean; // Whether paid with credits or cash
  approvedBy?: string[]; // Track who approved at each stage
  displayOnMobile?: boolean;
}

export interface BannerDraft {
  packageId: string;
  packageName: string;
  bannerName: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  price: number;
  duration: 'monthly' | 'quarterly' | 'yearly' | 'hourly';
  displayOnMobile?: boolean; // Mobile app selection
}

interface DataContextType {
  packages: Package[];
  locations: Location[];
  locationGroups: LocationGroup[];
  locationPricing: LocationPricing[];
  orders: BannerOrder[];
  bannerDraft: BannerDraft | null;
  // Package methods
  addPackage: (pkg: Package) => void;
  updatePackage: (id: string, pkg: Partial<Package>) => void;
  deletePackage: (id: string) => void;
  // Location methods
  addLocation: (location: Location) => void;
  updateLocation: (id: string, location: Partial<Location>) => void;
  addLocationGroup: (group: LocationGroup) => void;
  updateLocationGroup: (id: string, group: Partial<LocationGroup>) => void;
  // Pricing methods
  setLocationPricing: (pricing: LocationPricing) => void;
  getLocationPrice: (locationId: string, packageId: string, duration: string) => number;
  // Order methods
  createOrder: (order: Omit<BannerOrder, 'id' | 'createdAt'>) => void;
  updateOrderStatus: (orderId: string, status: BannerOrder['status'], rejectionReason?: string) => void;
  updateOrderApprovalStage: (orderId: string, stage: BannerOrder['approvalStage'], approver: string) => void;
  // Draft methods
  setBannerDraft: (draft: BannerDraft | null) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock initial data
const INITIAL_PACKAGES: Package[] = [
  {
    id: 'pkg1',
    name: 'Premium Display',
    slidesPerDay: 50,
    slidesDuration: 10,
    repeatCount: 5,
    durationSlots: [
      { id: 'ds1', duration: 'monthly', price: 5000 }
    ],
    features: [
      '50 slides per day',
      '10 seconds per slide',
      'Syncs to mobile app',
      'Analytics dashboard'
    ],
    hasStoreDirection: true,
    analytics: true,
    includeMobileApp: true,
    group: 'location',
    priceGroup: 'premium'
  },
  {
    id: 'pkg2',
    name: 'Premium Plus',
    slidesPerDay: 50,
    slidesDuration: 10,
    repeatCount: 5,
    durationSlots: [
      { id: 'ds2', duration: 'quarterly', price: 13500 }
    ],
    features: [
      '50 slides per day',
      '10 seconds per slide',
      'Syncs to mobile app',
      'Analytics dashboard',
      '10% discount'
    ],
    hasStoreDirection: true,
    analytics: true,
    includeMobileApp: true,
    group: 'location',
    priceGroup: 'premium'
  },
  {
    id: 'pkg3',
    name: 'Standard Display',
    slidesPerDay: 30,
    slidesDuration: 8,
    repeatCount: 3,
    durationSlots: [
      { id: 'ds3', duration: 'monthly', price: 3000 }
    ],
    features: [
      '30 slides per day',
      '8 seconds per slide',
      'Syncs to mobile app'
    ],
    hasStoreDirection: false,
    analytics: false,
    includeMobileApp: false,
    group: 'variant',
    priceGroup: 'standard'
  }
];

const INITIAL_LOCATION_GROUPS: LocationGroup[] = [
  {
    id: 'lg1',
    name: 'Premium Malls',
    tier: 'tier1',
    description: 'Top-tier shopping destinations'
  },
  {
    id: 'lg2',
    name: 'Standard Locations',
    tier: 'standard',
    description: 'Standard commercial areas'
  }
];

const INITIAL_LOCATIONS: Location[] = [
  {
    id: 'loc1',
    name: 'Aero Mall',
    address: 'Airport Road, Bangalore',
    tier: 'premium',
    isActive: true,
    groupId: 'lg1',
    activePackageIds: ['pkg1', 'pkg2', 'pkg3']
  },
  {
    id: 'loc2',
    name: 'City Center',
    address: 'MG Road, Bangalore',
    tier: 'standard',
    isActive: true,
    groupId: 'lg2',
    activePackageIds: ['pkg1', 'pkg2', 'pkg3']
  },
  {
    id: 'loc3',
    name: 'Phoenix Marketcity',
    address: 'Whitefield, Bangalore',
    tier: 'premium',
    isActive: true,
    groupId: 'lg1'
  }
];

const INITIAL_PRICING: LocationPricing[] = [
  { locationId: 'loc1', packageId: 'pkg1', overridePrice: 7000 }, // Aero Mall premium pricing
  { locationId: 'loc1', packageId: 'pkg2', overridePrice: 18900 },
  { locationId: 'loc3', packageId: 'pkg1', overridePrice: 6500 }, // Phoenix premium pricing
];

const INITIAL_ORDERS: BannerOrder[] = [
  {
    id: 'ord1',
    merchantId: 'm1',
    merchantName: 'John Merchant',
    locationId: 'loc1',
    locationName: 'Aero Mall',
    packageId: 'pkg1',
    packageName: 'Monthly Premium',
    bannerName: 'Summer Sale 2026',
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',
    startDate: '2026-02-01',
    endDate: '2026-02-28',
    price: 7000,
    status: 'active',
    approvalStage: 'final_approval',
    createdAt: '2026-01-15T10:30:00Z',
    transactionId: 'TXN001234567',
    paidWithCredits: false,
    approvedBy: ['admin1', 'scheduler1']
  },
  {
    id: 'ord2',
    merchantId: 'm1',
    merchantName: 'John Merchant',
    locationId: 'loc1',
    locationName: 'Aero Mall',
    packageId: 'pkg1',
    packageName: 'Monthly Premium',
    bannerName: 'New Collection Launch',
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
    startDate: '2026-01-29',
    endDate: '2026-02-28',
    price: 7000,
    status: 'under_review',
    approvalStage: 'pending',
    createdAt: '2026-01-28T14:20:00Z',
    transactionId: 'TXN001234568',
    paidWithCredits: true
  },
  {
    id: 'ord3',
    merchantId: 'm1',
    merchantName: 'John Merchant',
    locationId: 'loc1',
    locationName: 'Aero Mall',
    packageId: 'pkg2',
    packageName: 'Quarterly Premium',
    bannerName: 'Spring Festival',
    imageUrl: 'https://images.unsplash.com/photo-1555421689-d68471e189f2?w=800',
    startDate: '2026-03-01',
    endDate: '2026-05-31',
    price: 18900,
    status: 'scheduled',
    approvalStage: 'final_approval',
    createdAt: '2026-01-20T09:15:00Z',
    transactionId: 'TXN001234569',
    paidWithCredits: false,
    approvedBy: ['admin1', 'scheduler1']
  }
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [packages, setPackages] = useState<Package[]>(INITIAL_PACKAGES);
  const [locations, setLocations] = useState<Location[]>(INITIAL_LOCATIONS);
  const [locationGroups, setLocationGroups] = useState<LocationGroup[]>(INITIAL_LOCATION_GROUPS);
  const [locationPricing, setLocationPricingState] = useState<LocationPricing[]>(INITIAL_PRICING);
  const [orders, setOrders] = useState<BannerOrder[]>(INITIAL_ORDERS);
  const [bannerDraft, setBannerDraft] = useState<BannerDraft | null>(null);

  const addPackage = (pkg: Package) => {
    setPackages(prev => [...prev, pkg]);
  };

  const updatePackage = (id: string, updates: Partial<Package>) => {
    setPackages(prev => prev.map(pkg => pkg.id === id ? { ...pkg, ...updates } : pkg));
  };

  const deletePackage = (id: string) => {
    setPackages(prev => prev.filter(pkg => pkg.id !== id));
  };

  const addLocation = (location: Location) => {
    setLocations(prev => [...prev, location]);
  };

  const updateLocation = (id: string, updates: Partial<Location>) => {
    setLocations(prev => prev.map(loc => loc.id === id ? { ...loc, ...updates } : loc));
  };

  const addLocationGroup = (group: LocationGroup) => {
    setLocationGroups(prev => [...prev, group]);
  };

  const updateLocationGroup = (id: string, updates: Partial<LocationGroup>) => {
    setLocationGroups(prev => prev.map(group => group.id === id ? { ...group, ...updates } : group));
  };

  const setLocationPricing = (pricing: LocationPricing) => {
    setLocationPricingState(prev => {
      const existing = prev.findIndex(
        p => p.locationId === pricing.locationId && p.packageId === pricing.packageId && p.duration === pricing.duration
      );
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = pricing;
        return updated;
      }
      return [...prev, pricing];
    });
  };

  const getLocationPrice = (locationId: string, packageId: string, duration: string): number => {
    const pricing = locationPricing.find(
      p => p.locationId === locationId && p.packageId === packageId && p.duration === duration
    );

    if (pricing?.overridePrice) {
      return pricing.overridePrice;
    }

    const pkg = packages.find(p => p.id === packageId);
    if (!pkg) return 0;

    const slot = pkg.durationSlots.find(s => s.duration === duration);
    return slot?.price || 0;
  };

  const createOrder = (order: Omit<BannerOrder, 'id' | 'createdAt'>) => {
    const newOrder: BannerOrder = {
      ...order,
      id: `ord${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  const updateOrderStatus = (orderId: string, status: BannerOrder['status'], rejectionReason?: string) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId
        ? { ...order, status, rejectionReason }
        : order
    ));
  };

  const updateOrderApprovalStage = (orderId: string, stage: BannerOrder['approvalStage'], approver: string) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId
        ? {
          ...order,
          approvalStage: stage,
          approvedBy: [...(order.approvedBy || []), approver]
        }
        : order
    ));
  };

  return (
    <DataContext.Provider
      value={{
        packages,
        locations,
        locationGroups,
        locationPricing,
        orders,
        bannerDraft,
        addPackage,
        updatePackage,
        deletePackage,
        addLocation,
        updateLocation,
        addLocationGroup,
        updateLocationGroup,
        setLocationPricing,
        getLocationPrice,
        createOrder,
        updateOrderStatus,
        updateOrderApprovalStage,
        setBannerDraft
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}