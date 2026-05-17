import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requiresPasswordReset, setRequiresPasswordReset] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [authError, setAuthError] = useState(null);

  const fetchAdminData = async (authUser) => {
    if (!authUser) {
      setAdminData(null);
      return;
    }

    try {
      // 1. Fetch matching record from the `admin` table by ID or email
      const { data, error } = await supabase
        .from('admin')
        .select('*')
        .or(`id.eq.${authUser.id},email.eq.${authUser.email}`)
        .maybeSingle();

      if (error) {
        console.error("Supabase query error:", error);
        throw new Error("Unable to verify administrator permissions.");
      }

      if (!data) {
        // Not in admin table! Sign out immediately to block login.
        setAuthError(`Access denied: The account '${authUser.email}' is not registered as an administrator.`);
        await supabase.auth.signOut();
        setAdminData(null);
        return;
      }

      // 2. Auto-link auth ID if it's missing/different
      if (data.id !== authUser.id) {
        const { error: updateError } = await supabase
          .from('admin')
          .update({ id: authUser.id })
          .eq('email', data.email);

        if (updateError) {
          console.error("Error linking auth ID to admin row:", updateError);
        } else {
          data.id = authUser.id;
        }
      }

      // 3. Map to standard profile shape used across UI
      const formattedAdmin = {
        id: data.id,
        name: data.name || 'Admin User',
        email: data.email,
        phone: data.phn_no || '',
        role: data.role || 'Admin',
        location: 'CVV Head Office',
        joinedOn: '2025-01-01',
        access: ['Dashboard', 'Drivers', 'Buses', 'Routes', 'Assignments', 'Notifications', 'Settings']
      };

      setAdminData(formattedAdmin);
      setAuthError(null);
    } catch (err) {
      setAuthError(err.message || 'Verification failed.');
      setAdminData(null);
    }
  };

  const refreshAdminData = async () => {
    if (user) await fetchAdminData(user);
  };

  const clearAuthError = () => setAuthError(null);

  useEffect(() => {
    // Check if URL indicates a password recovery or invite flow
    if (window.location.hash.includes('type=recovery') || window.location.hash.includes('type=invite')) {
      setRequiresPasswordReset(true);
    }

    let isMounted = true;

    // Get active session on load
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!isMounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchAdminData(session.user);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!isMounted) return;
      
      if (event === 'PASSWORD_RECOVERY') {
        setRequiresPasswordReset(true);
      }
      
      setSession(newSession);
      setUser(newSession?.user ?? null);
      
      if (newSession?.user) {
        await fetchAdminData(newSession.user);
      } else {
        setAdminData(null);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, session, loading, requiresPasswordReset, setRequiresPasswordReset,
      adminData, authError, clearAuthError, refreshAdminData
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
