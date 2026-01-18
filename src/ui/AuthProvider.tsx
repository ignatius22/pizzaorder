import { useEffect, ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { supabase } from '../services/supabase';
import { setUser, logout } from '../features/user/userSlice';
import { AppDispatch } from '../store';

interface AuthProviderProps {
  children: ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    async function getProfileAndSetUser(session: any) {
      if (!session?.user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('role, username')
        .eq('id', session.user.id)
        .single();

      dispatch(setUser({
        id: session.user.id,
        email: session.user.email || '',
        username: profile?.username || session.user.user_metadata.username || session.user.email?.split('@')[0] || 'User',
        role: profile?.role as 'customer' | 'admin' || 'customer',
      }));
    }

    // 1. Initial check for session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) getProfileAndSetUser(session);
    });

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        getProfileAndSetUser(session);
      } else {
        dispatch(logout());
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  return <>{children}</>;
}

export default AuthProvider;
