import React, { createContext, useContext, useState, ReactNode } from "react";
import { User } from "@/data/mockData";
import { validateUserScope } from "@/lib/dataFilters";
import { addAuditLog } from "@/lib/auditLog";
import { Action, Resource } from "@/lib/permissions";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  hasRole: (roles: string[]) => boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (user: User) => {
    // Valider le scope de l'utilisateur avant de le connecter
    const validation = validateUserScope(user);

    if (!validation.valid) {
      console.error("Erreurs de validation du scope:", validation.errors);
      toast.error("Erreur de configuration utilisateur. Contactez l'administrateur.");
      validation.errors.forEach((error) => toast.error(error));
      return;
    }

    setUser(user);
    localStorage.setItem("currentUser", JSON.stringify(user));
    localStorage.setItem("lastLoginTime", new Date().toISOString());

    // Enregistrer la connexion dans l'audit log
    addAuditLog(
      user,
      "read" as Action,
      "analytics" as Resource,
      undefined,
      { action: "login", timestamp: new Date().toISOString() },
      true
    );

    console.log(`✅ Connexion réussie: ${user.prenom} ${user.nom} (${user.role})`);
  };

  const logout = () => {
    if (user) {
      // Enregistrer la déconnexion dans l'audit log
      addAuditLog(
        user,
        "read" as Action,
        "analytics" as Resource,
        undefined,
        { action: "logout", timestamp: new Date().toISOString() },
        true
      );
    }

    setUser(null);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("lastLoginTime");
    console.log("✅ Déconnexion réussie");
  };

  const hasRole = (roles: string[]) => {
    return user ? roles.includes(user.role) : false;
  };

  const isAuthenticated = user !== null;

  // Load user from localStorage on mount
  React.useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    const lastLoginTime = localStorage.getItem("lastLoginTime");

    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser) as User;

        // Vérifier la validité de la session (24h)
        if (lastLoginTime) {
          const loginDate = new Date(lastLoginTime);
          const now = new Date();
          const hoursSinceLogin = (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60);

          if (hoursSinceLogin > 24) {
            console.warn("⚠️ Session expirée (>24h), déconnexion automatique");
            localStorage.removeItem("currentUser");
            localStorage.removeItem("lastLoginTime");
            toast.warning("Votre session a expiré. Veuillez vous reconnecter.");
            return;
          }
        }

        // Valider le scope de l'utilisateur chargé
        const validation = validateUserScope(parsedUser);
        if (!validation.valid) {
          console.error("⚠️ Utilisateur avec scope invalide:", validation.errors);
          localStorage.removeItem("currentUser");
          localStorage.removeItem("lastLoginTime");
          toast.error("Configuration utilisateur invalide. Veuillez vous reconnecter.");
          return;
        }

        setUser(parsedUser);
        console.log(`✅ Session restaurée: ${parsedUser.prenom} ${parsedUser.nom}`);
      } catch (error) {
        console.error("❌ Erreur lors du chargement de l'utilisateur:", error);
        localStorage.removeItem("currentUser");
        localStorage.removeItem("lastLoginTime");
      }
    }
  }, []);

  // Vérification périodique de la session (toutes les minutes)
  React.useEffect(() => {
    const interval = setInterval(() => {
      const lastLoginTime = localStorage.getItem("lastLoginTime");
      if (lastLoginTime && user) {
        const loginDate = new Date(lastLoginTime);
        const now = new Date();
        const hoursSinceLogin = (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60);

        if (hoursSinceLogin > 24) {
          console.warn("⚠️ Session expirée, déconnexion automatique");
          logout();
          toast.warning("Votre session a expiré. Veuillez vous reconnecter.");
        }
      }
    }, 60000); // Vérifier toutes les minutes

    return () => clearInterval(interval);
  }, [user]);

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
