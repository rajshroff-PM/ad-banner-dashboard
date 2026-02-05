import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Login } from "./components/Login";
import { MerchantDashboard } from "./components/merchant/MerchantDashboard";
import { OrderHistory } from "./components/merchant/OrderHistory";
import { PackageSelection } from "./components/merchant/PackageSelection";
import { BannerCreation } from "./components/merchant/BannerCreation";
import { PaymentCheckout } from "./components/merchant/PaymentCheckout";
import { PaymentSuccess } from "./components/merchant/PaymentSuccess";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { BannerApprovals } from "./components/admin/BannerApprovals";
import { MasterPackageConfig } from "./components/admin/MasterPackageConfig";
import { LocationManagement } from "./components/admin/LocationManagement";
import { LocationPricingSetup } from "./components/admin/LocationPricingSetup";
import { AdminBannerSetup } from "./components/admin/AdminBannerSetup";
import { AnalyticsHub } from "./components/admin/AnalyticsHub";
import { NotFound } from "./components/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Login },
      // Merchant Routes
      { path: "merchant/dashboard", Component: MerchantDashboard },
      { path: "merchant/orders", Component: OrderHistory },
      { path: "merchant/packages", Component: PackageSelection },
      { path: "merchant/banner/new", Component: BannerCreation },
      { path: "merchant/checkout", Component: PaymentCheckout },
      { path: "merchant/payment/success", Component: PaymentSuccess },
      // Admin Routes
      { path: "admin/dashboard", Component: AdminDashboard },
      { path: "admin/analytics", Component: AnalyticsHub },
      { path: "admin/approvals", Component: BannerApprovals },
      { path: "admin/packages", Component: MasterPackageConfig },
      { path: "admin/locations", Component: LocationManagement },
      { path: "admin/locations/:locationId/pricing", Component: LocationPricingSetup },
      { path: "admin/banners/setup", Component: AdminBannerSetup },
      { path: "admin/banner/create", Component: BannerCreation },
      { path: "*", Component: NotFound },
    ],
  },
]);
