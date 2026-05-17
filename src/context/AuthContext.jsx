import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requiresPasswordReset, setRequiresPasswordReset] = useState(false);

  // Admin profile fetched from the `admin` table, matched by Google email
  const [adminProfile, setAdminProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Fetch admin row from Supabase `admin` table using the session email
  const fetchAdminProfile = async (email) => {
    if (!email) return;
    setProfileLoading(true);
    try {
      const { data, error } = await supabase
        .from('admin')
        .select('*')
        .eq('email', email)
        .maybeSingle();
      if (error) throw error;
      setAdminProfile(data);
    } catch (err) {
      console.error('Could not load admin profile:', err.message);
      setAdminProfile(null);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    // Check if URL indicates a password recovery or invite flow
    if (window.location.hash.includes('type=recovery') || window.location.hash.includes('type=invite')) {
      setRequiresPasswordReset(true);
    }

    // Get active session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user?.email) {
        fetchAdminProfile(session.user.email);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setRequiresPasswordReset(true);
      }
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user?.email) {
        // Fetch admin profile whenever a new session is established
        fetchAdminProfile(session.user.email);
      } else {
        // Clear profile on logout
        setAdminProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      requiresPasswordReset,
      setRequiresPasswordReset,
      adminProfile,
      profileLoading,
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
