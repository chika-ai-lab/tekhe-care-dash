import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

/**
 * Hook personnalisé pour l'authentification avec Zustand
 * Maintient la compatibilité avec le code existant
 */
export const useAuthZustand = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const hasRole = useAuthStore((state) => state.hasRole);
  const isSessionExpired = useAuthStore((state) => state.isSessionExpired);
  const clearSession = useAuthStore((state) => state.clearSession);

  // Vérifier l'expiration de la session au montage et régulièrement
  useEffect(() => {
    if (isAuthenticated && isSessionExpired()) {
      clearSession();
      toast.warning('Votre session a expiré. Veuillez vous reconnecter.');
    }
  }, [isAuthenticated, isSessionExpired, clearSession]);

  // Vérifier périodiquement l'expiration (toutes les minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      if (isAuthenticated && isSessionExpired()) {
        clearSession();
        toast.warning('Votre session a expiré. Veuillez vous reconnecter.');
      }
    }, 60000); // Vérifier toutes les minutes

    return () => clearInterval(interval);
  }, [isAuthenticated, isSessionExpired, clearSession]);

  return {
    user,
    isAuthenticated,
    login,
    logout,
    hasRole,
    isSessionExpired,
    clearSession,
  };
};
