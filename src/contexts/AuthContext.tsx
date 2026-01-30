import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'merchant' | 'admin' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'merchant' | 'admin';
  locationId?: string; // For merchants - their assigned location
  locationName?: string;
  credits?: number; // Credits/tokens balance for merchants
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const MOCK_USERS: User[] = [
  {
    id: 'm1',
    name: 'John Merchant',
    email: 'merchant@demo.com',
    role: 'merchant',
    locationId: 'loc1',
    locationName: 'Aero Mall',
    credits: 15000 // Credits available
  },
  {
    id: 'm2',
    name: 'Sarah Store',
    email: 'merchant2@demo.com',
    role: 'merchant',
    locationId: 'loc2',
    locationName: 'City Center',
    credits: 8000
  },
  {
    id: 'a1',
    name: 'Admin User',
    email: 'admin@demo.com',
    role: 'admin'
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in production, this would call your backend
    const foundUser = MOCK_USERS.find(u => u.email === email);
    
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        isAuthenticated: !!user 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}