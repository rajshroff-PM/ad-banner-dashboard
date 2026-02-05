import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { Shield, LayoutDashboard, CheckCircle, Package, MapPin, LogOut, PlusCircle, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '../../components/ui/sheet';

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
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/approvals', icon: CheckCircle, label: 'Approvals' },
    { path: '/admin/packages', icon: Package, label: 'Packages' },
    { path: '/admin/locations', icon: MapPin, label: 'Locations' },
    { path: '/admin/banners/setup', icon: PlusCircle, label: 'Create Banner' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Desktop */}
      <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg">Paathner AdSync Admin</h1>
                <p className="text-xs text-purple-100">Management Console</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm">{user?.name}</p>
                <p className="text-xs text-purple-100">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-white/20 rounded-lg transition"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition ${isActive
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Header */}
      <div className="md:hidden bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 -ml-2 hover:bg-white/20 rounded-lg text-white">
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] flex flex-col p-6">
              <div className="flex flex-col gap-6 flex-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold">Paathner AdSync</h1>
                    <p className="text-xs text-gray-500">Admin Portal</p>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive
                          ? 'bg-purple-50 text-purple-600'
                          : 'text-gray-600 hover:bg-gray-50'
                          }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-auto border-t border-gray-100 p-4 -mx-6 bg-gray-50/50">
                  <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm mb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-semibold text-lg">
                        {user?.name?.charAt(0)}
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-semibold text-gray-900 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-purple-700 bg-purple-50 w-full px-3 py-1.5 rounded-lg justify-center font-medium">
                      <Shield className="w-3.5 h-3.5" />
                      Admin Portal
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white border border-gray-200 text-red-600 hover:bg-red-50 hover:border-red-100 w-full transition font-medium shadow-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <span className="font-semibold text-white">Admin Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white">{user?.name}</p>
            <p className="text-xs text-purple-200">Admin</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white">{user?.name}</span>
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white font-medium border border-white/30">
              {user?.name?.charAt(0)}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
