import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./components/DashboardLayout";
import Suivi from "./pages/dashboard/Suivi";
import Risques from "./pages/dashboard/Risques";
import CSU from "./pages/dashboard/CSU";
import SONU from "./pages/dashboard/SONU";
import PEV from "./pages/dashboard/PEV";
import DHIS2 from "./pages/dashboard/DHIS2";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="suivi" element={<Suivi />} />
            <Route path="risques" element={<Risques />} />
            <Route path="csu" element={<CSU />} />
            <Route path="sonu" element={<SONU />} />
            <Route path="pev" element={<PEV />} />
            <Route path="dhis2" element={<DHIS2 />} />
          </Route>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
