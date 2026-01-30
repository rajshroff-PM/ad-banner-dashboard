import { Outlet } from 'react-router';
import { AuthProvider } from '../contexts/AuthContext';
import { DataProvider } from '../contexts/DataContext';

export function Root() {
  return (
    <AuthProvider>
      <DataProvider>
        <div className="min-h-screen bg-gray-50">
          <Outlet />
        </div>
      </DataProvider>
    </AuthProvider>
  );
}