import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import {
  Shield,
  LayoutDashboard,
  CheckCircle,
  Package,
  MapPin,
  LogOut,
  PlusCircle,
  Menu,
  BarChart3,
  Database,
  Users,
  Megaphone,
  Ticket,
  ClipboardList,
  FileText,
  Store,
  Tag,
  HelpCircle,
  Box,
  Coffee,
  Lock,
  Trophy,
  UserPlus
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '../../components/ui/sheet';
import logo from '../../assets/logo.svg';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Analytics Hub', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Master', path: '/admin/master', icon: Database },
    { label: 'Community', path: '/admin/community', icon: Users },
    { label: 'Promotions', path: '/admin/promotions', icon: Megaphone },
    { label: 'Order', path: '/admin/orders', icon: ClipboardList },
    { label: 'Order Reports', path: '/admin/reports/orders', icon: FileText },
    { label: 'Merchants', path: '/admin/merchants', icon: Store },
    { label: 'Offer', path: '/admin/offers', icon: Ticket },
    { label: 'Packages', path: '/admin/packages', icon: Package },
    { label: 'Category', path: '/admin/categories', icon: Tag },
    { label: 'Support', path: '/admin/support', icon: HelpCircle },
    { label: 'Product', path: '/admin/products', icon: Box },
    { label: 'Amenities', path: '/admin/amenities', icon: Coffee },
    { label: 'Access Control', path: '/admin/access-control', icon: Lock },
    { label: 'Reports', path: '/admin/reports', icon: FileText },
    { label: 'POI Ranking', path: '/admin/poi-ranking', icon: Trophy },
    { label: 'User Registration', path: '/admin/user-registration', icon: UserPlus },
    { label: 'Approvals', path: '/admin/approvals', icon: CheckCircle },
    { label: 'Locations', path: '/admin/locations', icon: MapPin },
    { label: 'Create Banner', path: '/admin/banners/setup', icon: PlusCircle },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Paathner AdSync" className="w-10 h-10 rounded-lg object-contain" />
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">Paathner AdSync</h1>
            <p className="text-xs text-purple-600 font-medium">Admin Console</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg w-full transition-colors duration-200 group text-sm font-medium ${isActive
                  ? 'bg-purple-50 text-purple-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
              <Icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? 'text-purple-600' : 'text-gray-400 group-hover:text-gray-500'
                }`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50/50">
        <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm mb-3">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-semibold text-sm shrink-0">
              {user?.name?.charAt(0)}
            </div>
            <div className="overflow-hidden min-w-0">
              <p className="font-semibold text-sm text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-purple-700 bg-purple-50 px-2 py-1 rounded w-full justify-center font-medium">
            <Shield className="w-3 h-3" />
            Admin Portal
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-white border border-gray-200 text-red-600 hover:bg-red-50 hover:border-red-100 w-full transition font-medium text-sm shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Header & Content */}
      <div className="flex-1 flex flex-col md:pl-64 min-h-screen transition-all duration-300">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-20 px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <button className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85vw] sm:w-[320px] p-0">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            <span className="font-semibold text-gray-900">Admin Dashboard</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700 hidden sm:block">{user?.name}</span>
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-medium border border-purple-200 text-sm">
              {user?.name?.charAt(0)}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
