import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/auth';
import { Lock, ShieldCheck } from 'lucide-react';

export default function SetPassword() {
  const { user, requiresPasswordReset, setRequiresPasswordReset } = useAuth();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Security check: only allow access if the user is in a reset flow
  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    } else if (!requiresPasswordReset && !window.location.hash.includes('type=invite') && !window.location.hash.includes('type=recovery')) {
      // If they somehow land here without needing a reset, send them to dashboard
      navigate('/', { replace: true });
    }
  }, [user, requiresPasswordReset, navigate]);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      await authAPI.updatePassword(password);
      setSuccess(true);
      
      // Clear the reset flag
      setRequiresPasswordReset(false);
      
      // Redirect to dashboard after a short delay so they can see the success message
      setTimeout(() => {
        // Clear the hash from the URL so it doesn't trigger the reset flow again
        window.history.replaceState(null, '', window.location.pathname);
        navigate('/', { replace: true });
      }, 2000);
      
    } catch (err) {
      setError(err.message || 'Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface relative overflow-hidden">
        <div className="w-full max-w-md p-6 z-10 animate-fade-in text-center">
          <div className="glass-card p-8 shadow-glass-lg flex flex-col items-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck className="text-emerald-600 w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-navy-900 mb-2">Password Secured</h2>
            <p className="text-navy-500">Your account is now set up. Redirecting to your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface relative overflow-hidden">
      {/* Background gradients for visual appeal */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-teal-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-navy-500/20 rounded-full blur-3xl" />
      
      <div className="w-full max-w-md p-6 z-10 animate-fade-in">
        <div className="glass-card p-8 shadow-glass-lg relative overflow-hidden">
          {/* Subtle top border gradient */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 to-navy-600"></div>
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-navy-900 mb-2">
              Set Your Password
            </h1>
            <p className="text-navy-500 text-sm">Please choose a secure password for your account.</p>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-5">
            <div>
              <label className="input-label" htmlFor="password">New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="text-navy-300" />
                </div>
                <input
                  id="password"
                  type="password"
                  className="input-field pl-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="input-label" htmlFor="confirmPassword">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="text-navy-300" />
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  className="input-field pl-10"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl text-sm bg-red-50 text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 text-base mt-2"
            >
              {loading ? 'Saving...' : 'Secure Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
