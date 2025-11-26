import { KPICard } from "@/components/KPICard";
import { mockPatients, mockRisquesIA, mockReferencesSonu, mockVisites, mockStructures, mockVisitesCPoN, mockVaccins } from "@/data/mockData";
import {
  Users,
  Calendar,
  Baby,
  AlertTriangle,
  Ambulance,
  Shield,
  Syringe,
  Activity,
  Database,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import PartenaireAnalytics from "./dashboard/PartenaireAnalytics";
import { filterPatientsByUser, filterRisquesByUser, filterReferencesByUser, filterVisitesByUser } from "@/lib/dataFilters";
import { useState } from "react";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRange } from "react-day-picker";
import { addDays, format, isWithinInterval, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

export default function Dashboard() {
  const { hasRole, user } = useAuth();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  const [selectedStructure, setSelectedStructure] = useState<string>("all");
  
  // Filtrer les données selon le rôle de l'utilisateur
  let userPatients = filterPatientsByUser(mockPatients, user);
  
  // Appliquer le filtre par structure (responsable district uniquement)
  if (user?.role === 'responsable_district' && selectedStructure !== "all") {
    userPatients = userPatients.filter(p => p.structure === selectedStructure);
  }
  
  // Appliquer le filtre par date sur la date d'enrôlement
  if (dateRange?.from) {
    userPatients = userPatients.filter(p => {
      if (!p.date_enrolement) return true;
      const patientDate = parseISO(p.date_enrolement);
      if (dateRange.to) {
        return isWithinInterval(patientDate, { start: dateRange.from, end: dateRange.to });
      }
      return patientDate >= dateRange.from;
    });
  }
  
  // Filtrer les risques, références et visites AVANT les filtres de date
  // pour que les KPI globaux ne soient pas affectés par les filtres temporels
  const baseUserPatients = filterPatientsByUser(mockPatients, user);

  // Appliquer le filtre par structure sur les patients de base
  let baseFilteredPatients = baseUserPatients;
  if (user?.role === 'responsable_district' && selectedStructure !== "all") {
    baseFilteredPatients = baseFilteredPatients.filter(p => p.structure === selectedStructure);
  }

  const userRisques = filterRisquesByUser(mockRisquesIA, mockPatients, user);
  const userReferences = filterReferencesByUser(mockReferencesSonu, mockPatients, user);
  const userVisites = filterVisitesByUser(mockVisites, mockPatients, user);

  // Calculer les KPI à partir des données filtrées (SANS filtre de date pour les KPI globaux)
  const patientes_totales = baseFilteredPatients.length;
  const cpn1_realisees = baseFilteredPatients.filter(p => {
    const visites = userVisites.filter(v => v.patient_id === p.id && v.type === 'CPN1' && v.statut === 'realise');
    return visites.length > 0;
  }).length;
  const cpn1_cible = patientes_totales;
  const cpn4_realisees = baseFilteredPatients.filter(p => {
    const visites = userVisites.filter(v => v.patient_id === p.id && v.type === 'CPN4' && v.statut === 'realise');
    return visites.length > 0;
  }).length;
  const cpn4_cible = Math.floor(patientes_totales * 0.76); // Estimation basée sur les données mock

  const risques_rouge = userRisques.filter(r => r.niveau === 'rouge').length;
  const risques_orange = userRisques.filter(r => r.niveau === 'orange').length;
  const risques_vert = userRisques.filter(r => r.niveau === 'vert').length;

  const csu_enrolled = baseFilteredPatients.length;
  const csu_actifs = baseFilteredPatients.filter(p => p.statut_csu === 'actif').length;
  const csu_a_renouveler = baseFilteredPatients.filter(p => p.statut_csu === 'a_renouveler').length;

  const referencesResolved = userReferences.filter(r => r.delai_minutes);
  const references_delai_moyen = referencesResolved.length > 0
    ? Math.round(referencesResolved.reduce((sum, r) => sum + (r.delai_minutes || 0), 0) / referencesResolved.length)
    : 0;

  // Calculer les KPI CPoN (Consultations Post-Natales)
  const basePatientIds = new Set(baseFilteredPatients.map(p => p.id));
  const userCPoN = mockVisitesCPoN.filter(v => basePatientIds.has(v.patient_id));
  const cpon_total = userCPoN.length;
  const cpon_realises = userCPoN.filter(v => v.statut === 'realise').length;
  const cpon_pourcentage = cpon_total > 0 ? Math.round((cpon_realises / cpon_total) * 100) : 0;

  // Calculer les KPI PEV (Programme Élargi de Vaccination)
  const userVaccins = mockVaccins.filter(v => basePatientIds.has(v.patient_id));
  const pev_total = userVaccins.length;
  const pev_realises = userVaccins.filter(v => v.statut === 'realise').length;
  const pev_pourcentage = pev_total > 0 ? Math.round((pev_realises / pev_total) * 100) : 0;

  // Calculer la létalité obstétricale (simulée - nécessiterait des données de décès)
  // Pour l'instant, on garde une valeur indicative basée sur les risques rouges
  // Éviter division par zéro
  const letalite_taux = patientes_totales > 0 && risques_rouge > 0
    ? ((risques_rouge / patientes_totales) * 1000).toFixed(1)
    : "0.0";

  // Fonction d'export CSV
  const handleExportCSV = () => {
    const headers = ['Nom', 'Prénom', 'Age', 'Téléphone', 'Structure', 'Agent', 'Semaines', 'Statut CSU', 'Date enrôlement'];
    const csvData = userPatients.map(p => [
      p.nom,
      p.prenom,
      p.age,
      p.telephone,
      p.structure,
      p.agent,
      p.semaines,
      p.statut_csu,
      p.date_enrolement || ''
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `patientes_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`${userPatients.length} patientes exportées en CSV`);
  };
  
  // Redirect partners to analytics view
  if (hasRole(['partenaire_ong', 'partenaire_regional', 'partenaire_gouvernemental'])) {
    return <PartenaireAnalytics />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Filters Bar */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <h1 className="text-3xl font-bold">Tableau de bord TEKHE</h1>
        <div className="flex gap-2">
          {/* Date Range Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className={cn(!dateRange && "text-muted-foreground")}>
                <Calendar className="h-4 w-4 mr-2" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "dd MMM", { locale: fr })} - {format(dateRange.to, "dd MMM", { locale: fr })}
                    </>
                  ) : (
                    format(dateRange.from, "dd MMM yyyy", { locale: fr })
                  )
                ) : (
                  <span>Période</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                locale={fr}
              />
            </PopoverContent>
          </Popover>
          
          {/* Structure Filter (District responsable only) */}
          {user?.role === 'responsable_district' && (
            <Select value={selectedStructure} onValueChange={setSelectedStructure}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Toutes structures" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes structures</SelectItem>
                {mockStructures.map((structure) => (
                  <SelectItem key={structure} value={structure}>
                    {structure}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          {/* Export CSV Button */}
          <Button size="sm" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <KPICard
          title="Patientes totales"
          value={patientes_totales.toLocaleString()}
          icon={Users}
          color="default"
          trend="+12%"
        />
        
        <KPICard
          title="CPN1 réalisées"
          value={`${cpn1_realisees} / ${cpn1_cible}`}
          icon={Calendar}
          color="green"
          subtitle="Cible atteinte"
          progress={cpn1_cible > 0 ? Math.round((cpn1_realisees / cpn1_cible) * 100) : 0}
        />
        
        <KPICard
          title="CPN4 réalisées"
          value={`${cpn4_realisees} / ${cpn4_cible}`}
          icon={Calendar}
          color="orange"
          subtitle="En progression"
          progress={cpn4_cible > 0 ? Math.round((cpn4_realisees / cpn4_cible) * 100) : 0}
        />
        
        <KPICard
          title="CPON 6-42j"
          value={`${cpon_pourcentage}%`}
          icon={Baby}
          color={cpon_pourcentage >= 70 ? "green" : cpon_pourcentage >= 50 ? "orange" : "red"}
          progress={cpon_pourcentage}
          subtitle={`${cpon_realises}/${cpon_total} réalisées`}
        />
        
        <KPICard
          title="Risques Rouge"
          value={risques_rouge}
          icon={AlertTriangle}
          color="red"
          subtitle="Nécessitent attention immédiate"
        />
        
        <KPICard
          title="Risques Orange"
          value={risques_orange}
          icon={AlertTriangle}
          color="orange"
          subtitle="Surveillance renforcée"
        />
        
        <KPICard
          title="Risques Vert"
          value={risques_vert}
          icon={AlertTriangle}
          color="green"
          subtitle="Suivi normal"
        />
        
        <KPICard
          title="Délai SONU moyen"
          value={references_delai_moyen > 0 ? `${references_delai_moyen} min` : "N/A"}
          icon={Ambulance}
          color="orange"
          subtitle="Références urgentes"
        />
        
        <KPICard
          title="CSU Enrôlés"
          value={csu_enrolled.toLocaleString()}
          icon={Shield}
          color="default"
          trend="+8%"
        />
        
        <KPICard
          title="CSU Actifs"
          value={csu_actifs.toLocaleString()}
          icon={Shield}
          color="green"
          subtitle={`${csu_a_renouveler} à renouveler`}
        />
        
        <KPICard
          title="PEV doses complètes"
          value={`${pev_pourcentage}%`}
          icon={Syringe}
          color={pev_pourcentage >= 85 ? "green" : pev_pourcentage >= 70 ? "orange" : "red"}
          progress={pev_pourcentage}
          subtitle={`${pev_realises}/${pev_total} doses`}
        />
        
        <KPICard
          title="Létalité obstétricale"
          value={`${letalite_taux}‰`}
          icon={Activity}
          color={Number(letalite_taux) <= 2 ? "green" : Number(letalite_taux) <= 5 ? "orange" : "red"}
          subtitle="Pour 1000 naissances"
        />
      </div>

      {/* Qualité des données */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Qualité des données
            </CardTitle>
            <div className="text-2xl font-bold">78/100</div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Complétude</span>
                <span className="font-medium">92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Cohérence</span>
                <span className="font-medium">85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Opportunité</span>
                <span className="font-medium">71%</span>
              </div>
              <Progress value={71} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Synchronisation</span>
                <span className="font-medium">88%</span>
              </div>
              <Progress value={88} className="h-2" />
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">Alertes incohérences</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[hsl(var(--status-rouge))]"></span>
                3 DDR supérieures à la date de visite
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[hsl(var(--status-orange))]"></span>
                7 âges manquants
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[hsl(var(--status-rouge))]"></span>
                2 tensions invalides
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
