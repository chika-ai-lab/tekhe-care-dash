import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/data/mockData';
import { validateUserScope } from '@/lib/dataFilters';
import { addAuditLog } from '@/lib/auditLog';
import { Action, Resource } from '@/lib/permissions';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  lastLoginTime: string | null;
  login: (user: User) => boolean;
  logout: () => void;
  hasRole: (roles: string[]) => boolean;
  clearSession: () => void;
  isSessionExpired: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      lastLoginTime: null,

      login: (user: User) => {
        // Valider le scope de l'utilisateur avant de le connecter
        const validation = validateUserScope(user);

        if (!validation.valid) {
          console.error("Erreurs de validation du scope:", validation.errors);
          validation.errors.forEach((error) => console.error(error));
          return false;
        }

        const loginTime = new Date().toISOString();
        set({
          user,
          isAuthenticated: true,
          lastLoginTime: loginTime,
        });

        // Enregistrer la connexion dans l'audit log
        addAuditLog(
          user,
          "read" as Action,
          "analytics" as any,
          undefined,
          { action: "login", timestamp: loginTime },
          true
        );

        console.log(`✅ Connexion réussie: ${user.prenom} ${user.nom} (${user.role})`);
        return true;
      },

      logout: () => {
        const state = get();
        if (state.user) {
          // Enregistrer la déconnexion dans l'audit log
          addAuditLog(
            state.user,
            "read" as Action,
            "analytics" as any,
            undefined,
            { action: "logout", timestamp: new Date().toISOString() },
            true
          );
        }

        set({
          user: null,
          isAuthenticated: false,
          lastLoginTime: null,
        });

        console.log("✅ Déconnexion réussie");
      },

      hasRole: (roles: string[]) => {
        const state = get();
        return state.user ? roles.includes(state.user.role) : false;
      },

      clearSession: () => {
        set({
          user: null,
          isAuthenticated: false,
          lastLoginTime: null,
        });
      },

      isSessionExpired: () => {
        const state = get();
        if (!state.lastLoginTime) return false;

        const loginDate = new Date(state.lastLoginTime);
        const now = new Date();
        const hoursSinceLogin = (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60);

        return hoursSinceLogin > 24;
      },
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({
        user: state.user,
        lastLoginTime: state.lastLoginTime,
      }),
    }
  )
);
