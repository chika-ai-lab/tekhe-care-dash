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
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Accueil KPI", url: "/dashboard", icon: Home },
  { title: "Suivi CPN", url: "/dashboard/suivi", icon: Activity },
  { title: "Risques IA", url: "/dashboard/risques", icon: AlertTriangle },
  { title: "Références SONU", url: "/dashboard/sonu", icon: Ambulance },
  { title: "Enrôlement CSU", url: "/dashboard/csu", icon: Shield },
  { title: "PEV & Nutrition", url: "/dashboard/pev", icon: Syringe },
  { title: "Export DHIS2", url: "/dashboard/dhis2", icon: Database },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { open } = useSidebar();
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
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

        <SidebarMenu
          className={cn("space-y-1", !open && "justify-center items-center")}
        >
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink
                  to={item.url}
                  className={({ isActive: active }) =>
                    `relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                      active || isActive(item.url)
                        ? "bg-primary text-primary-foreground font-medium shadow-sm before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:rounded-r-full before:bg-primary"
                        : "hover:bg-muted/50 text-muted-foreground"
                    }`
                  }
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {open && <span className="text-sm">{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
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
