import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { LogOut } from "lucide-react";
import { Onboarding } from "@/components/Onboarding";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { user, logout, hasRole } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      sage_femme: "Sage-femme",
      responsable_structure: "Responsable Structure",
      responsable_district: "Responsable District",
      partenaire_ong: "Partenaire ONG",
      partenaire_regional: "Partenaire Régional",
      partenaire_gouvernemental: "Partenaire Gouvernemental",
    };
    return labels[role] || role;
  };

  const isPartenaire = hasRole([
    "partenaire_ong",
    "partenaire_regional",
    "partenaire_gouvernemental",
  ]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {!isPartenaire && <AppSidebar />}
        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b flex items-center px-4 bg-background">
            {!isPartenaire && <SidebarTrigger />}
            <div className="ml-4 flex-1">
              <h1 className="text-lg font-semibold">
                Système de Santé Maternelle - TEKHE
              </h1>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {user.prenom} {user.nom}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {getRoleLabel(user.role)}
                    </Badge>
                  </div>
                </div>
              )}
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
      <Onboarding />
    </SidebarProvider>
  );
}
