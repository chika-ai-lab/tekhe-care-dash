import React, { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useAgentStore } from '@/stores/agentStore';

interface StoreProviderProps {
  children: React.ReactNode;
}

/**
 * Provider pour initialiser et synchroniser les stores Zustand
 * Charge les données persistées depuis localStorage
 */
export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  useEffect(() => {
    // Initialiser l'auth store - charge depuis localStorage automatiquement
    const user = useAuthStore.getState().user;
    const isSessionExpired = useAuthStore.getState().isSessionExpired();

    if (user && isSessionExpired()) {
      console.warn('⚠️ Session expirée, déconnexion automatique');
      useAuthStore.getState().clearSession();
    }

    // Initialiser l'agent store avec les données mockées
    const agents = useAgentStore.getState().agents;
    if (agents.length === 0) {
      // Charger les agents au démarrage si le store est vide
      useAgentStore.getState().fetchAgents().catch((error) => {
        console.error('Erreur lors de l\'initialisation des agents:', error);
      });
    }
  }, []);

  return <>{children}</>;
};
