import {
  Home,
  Activity,
  AlertTriangle,
  Ambulance,
  Shield,
  Syringe,
  Database,
  LogOut,
  Search,
  Moon,
  Sun,
  Users,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface MenuItem {
  title: string;
  url: string;
  icon: any;
  allowedRoles: UserRole[];
}

const menuItems: MenuItem[] = [
  // Menu pour Sage-femme et Responsables
  {
    title: "Accueil KPI",
    url: "/dashboard",
    icon: Home,
    allowedRoles: [
      "sage_femme",
      "responsable_structure",
      "responsable_district",
    ],
  },
  {
    title: "Suivi CPN",
    url: "/dashboard/suivi",
    icon: Activity,
    allowedRoles: [
      "sage_femme",
      "responsable_structure",
      "responsable_district",
    ],
  },
  {
    title: "Risques IA",
    url: "/dashboard/risques",
    icon: AlertTriangle,
    allowedRoles: [
      "sage_femme",
      "responsable_structure",
      "responsable_district",
    ],
  },
  {
    title: "Références SONU",
    url: "/dashboard/sonu",
    icon: Ambulance,
    allowedRoles: [
      "sage_femme",
      "responsable_structure",
      "responsable_district",
    ],
  },
  {
    title: "Enrôlement CSU",
    url: "/dashboard/csu",
    icon: Shield,
    allowedRoles: [
      "sage_femme",
      "responsable_structure",
      "responsable_district",
    ],
  },
  {
    title: "PEV & Nutrition",
    url: "/dashboard/pev",
    icon: Syringe,
    allowedRoles: [
      "sage_femme",
      "responsable_structure",
      "responsable_district",
    ],
  },
  {
    title: "Export DHIS2",
    url: "/dashboard/dhis2",
    icon: Database,
    allowedRoles: ["responsable_district"],
  },
  {
    title: "Gestion Agents",
    url: "/dashboard/agents",
    icon: Users,
    allowedRoles: ["responsable_structure", "responsable_district"],
  },
  // Menu pour Partenaires - Données anonymisées uniquement
  {
    title: "Analytics Global",
    url: "/dashboard/analytics",
    icon: Database,
    allowedRoles: [
      "partenaire_ong",
      "partenaire_regional",
      "partenaire_gouvernemental",
    ],
  },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { open } = useSidebar();
  const { hasRole, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter menu items based on user role
  const visibleMenuItems = menuItems.filter((item) =>
    hasRole(item.allowedRoles)
  );

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    toast.success("Déconnexion réussie");
    navigate("/login");
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b px-4 py-4">
        <div
          className={cn(
            "flex gap-3",
            !open ? "justify-center items-center" : "items-center"
          )}
        >
          <div className="h-10 w-10 aspect-square rounded-lg bg-accent flex items-center justify-center text-accent-foreground font-bold text-lg">
            TK
          </div>
          {open && (
            <div className="flex flex-col">
              <span className="font-semibold text-sm">TEKHE</span>
              <span className="text-xs text-muted-foreground">
                Santé Maternelle
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        {open && (
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-muted/50 border-0"
            />
          </div>
        )}

        <SidebarMenu className="space-y-1">
          {visibleMenuItems.map((item) => {
            const isCurrentlyActive = isActive(item.url);
            return (
              <SidebarMenuItem key={item.title}>
                <NavLink
                  to={item.url}
                  className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    isCurrentlyActive
                      ? "bg-primary text-white font-medium shadow-sm"
                      : "hover:bg-muted/50 text-foreground hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {open && <span className="text-sm">{item.title}</span>}
                </NavLink>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t p-3 space-y-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-all"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              {open && <span className="text-sm">Déconnexion</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <div className="flex items-center gap-3 px-3 py-2.5">
              {darkMode ? (
                <Moon className="h-5 w-5 shrink-0 text-muted-foreground" />
              ) : (
                <Sun className="h-5 w-5 shrink-0 text-muted-foreground" />
              )}
              {open && (
                <>
                  <span className="text-sm text-muted-foreground flex-1">
                    {darkMode ? "Mode sombre" : "Mode clair"}
                  </span>
                  <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
                </>
              )}
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
