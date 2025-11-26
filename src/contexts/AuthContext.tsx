import React, { createContext, useContext, ReactNode } from "react";
import { User } from "@/data/mockData";
import { useAuthStore } from "@/stores/authStore";

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  hasRole: (roles: string[]) => boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider unifié utilisant Zustand comme source unique de vérité
 * Permet de maintenir la compatibilité avec le code existant qui utilise useAuth()
 * tout en bénéficiant de la persistance et de la gestion d'état de Zustand
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Utiliser le store Zustand comme source unique de vérité
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const loginStore = useAuthStore((state) => state.login);
  const logoutStore = useAuthStore((state) => state.logout);
  const hasRoleStore = useAuthStore((state) => state.hasRole);

  const login = (user: User) => {
    const success = loginStore(user);
    if (!success) {
      console.error("Échec de la connexion - validation du scope échouée");
    }
  };

  const logout = () => {
    logoutStore();
  };

  const hasRole = (roles: string[]) => {
    return hasRoleStore(roles);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasRole, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
