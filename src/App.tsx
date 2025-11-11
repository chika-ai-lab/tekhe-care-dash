import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./components/DashboardLayout";
import Suivi from "./pages/dashboard/Suivi";
import Risques from "./pages/dashboard/Risques";
import CSU from "./pages/dashboard/CSU";
import SONU from "./pages/dashboard/SONU";
import PEV from "./pages/dashboard/PEV";
import DHIS2 from "./pages/dashboard/DHIS2";
import PatientDetail from "./pages/dashboard/PatientDetail";
import PartenaireAnalytics from "./pages/dashboard/PartenaireAnalytics";
import AgentEnrollment from "./pages/dashboard/AgentEnrollment";
import NotFound from "./pages/NotFound";
import { StoreProvider } from "./providers/StoreProvider";

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
            {/* Dashboard principal - Sage-femme et Responsables */}
            <Route index element={
              <ProtectedRoute allowedRoles={[
                'sage_femme', 
                'responsable_structure', 
                'responsable_district',
                'partenaire_ong', 
                'partenaire_regional', 
                'partenaire_gouvernemental'
              ]}>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            {/* Analytics Partenaires - Données anonymisées uniquement */}
            <Route path="analytics" element={
              <ProtectedRoute allowedRoles={['partenaire_ong', 'partenaire_regional', 'partenaire_gouvernemental']}>
                <PartenaireAnalytics />
              </ProtectedRoute>
            } />
            
            {/* Suivi CPN - Sage-femme et Responsables */}
            <Route path="suivi" element={
              <ProtectedRoute allowedRoles={['sage_femme', 'responsable_structure', 'responsable_district']}>
                <Suivi />
              </ProtectedRoute>
            } />
            
            {/* Risques IA - Sage-femme et Responsables */}
            <Route path="risques" element={
              <ProtectedRoute allowedRoles={['sage_femme', 'responsable_structure', 'responsable_district']}>
                <Risques />
              </ProtectedRoute>
            } />
            
            {/* Enrôlement CSU - Sage-femme et Responsables */}
            <Route path="csu" element={
              <ProtectedRoute allowedRoles={['sage_femme', 'responsable_structure', 'responsable_district']}>
                <CSU />
              </ProtectedRoute>
            } />
            
            {/* Références SONU - Sage-femme et Responsables */}
            <Route path="sonu" element={
              <ProtectedRoute allowedRoles={['sage_femme', 'responsable_structure', 'responsable_district']}>
                <SONU />
              </ProtectedRoute>
            } />
            
            {/* PEV & Nutrition - Sage-femme et Responsables */}
            <Route path="pev" element={
              <ProtectedRoute allowedRoles={['sage_femme', 'responsable_structure', 'responsable_district']}>
                <PEV />
              </ProtectedRoute>
            } />
            
            {/* Export DHIS2 - Uniquement Responsable District */}
            <Route path="dhis2" element={
              <ProtectedRoute allowedRoles={['responsable_district']}>
                <DHIS2 />
              </ProtectedRoute>
            } />

            {/* Enrôlement Agents - Responsable Structure et District */}
            <Route path="agents" element={
              <ProtectedRoute allowedRoles={['responsable_structure', 'responsable_district']}>
                <AgentEnrollment />
              </ProtectedRoute>
            } />

            {/* Détail Patient - Sage-femme et Responsables */}
            <Route path="patient/:patientId" element={
              <ProtectedRoute allowedRoles={['sage_femme', 'responsable_structure', 'responsable_district']}>
                <PatientDetail />
              </ProtectedRoute>
            } />
          </Route>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
