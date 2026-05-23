import { useSession, signIn, signOut } from 'next-auth/react';

/**
 * Convenience hook wrapping next-auth's useSession.
 * Returns the session, loading state, and auth helpers.
 */
export function useAuth() {
  const { data: session, status } = useSession();

  return {
    user: session?.user ?? null,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    signIn,
    signOut,
  };
}
