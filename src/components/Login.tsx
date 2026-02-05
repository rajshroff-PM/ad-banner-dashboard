import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Store, Shield } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);

      if (success) {
        // Determine redirect based on email (mock logic)
        if (email.includes('admin')) {
          navigate('/admin/dashboard');
        } else {
          navigate('/merchant/dashboard');
        }
      } else {
        setError('Invalid credentials. Try merchant@demo.com or admin@demo.com');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (userEmail: string) => {
    setEmail(userEmail);
    setPassword('demo');
    setError('');
    setLoading(true);

    try {
      const success = await login(userEmail, 'demo');

      if (success) {
        if (userEmail.includes('admin')) {
          navigate('/admin/dashboard');
        } else {
          navigate('/merchant/dashboard');
        }
      }
    } catch (err) {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4">
            <Store className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl mb-2">Paathner AdSync Dashboard</h1>
          <p className="text-gray-600">Kiosk & Mobile Ad Management Platform</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block mb-2 text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4 text-center">Quick Demo Access:</p>
            <div className="space-y-3">
              <button
                onClick={() => quickLogin('merchant@demo.com')}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition disabled:opacity-50"
              >
                <Store className="w-5 h-5 text-indigo-600" />
                <span>Login as Merchant</span>
              </button>
              <button
                onClick={() => quickLogin('admin@demo.com')}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition disabled:opacity-50"
              >
                <Shield className="w-5 h-5 text-purple-600" />
                <span>Login as Admin</span>
              </button>
            </div>
          </div>
        </div>

        <p className="text-center mt-6 text-sm text-gray-600">
          Demo credentials work with any password
        </p>
      </div>
    </div>
  );
}
