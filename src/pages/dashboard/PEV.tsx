import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { mockVaccins, mockPatients } from "@/data/mockData";
import { Syringe, AlertCircle, CheckCircle, Calendar, Baby, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { filterPatientsByUser, filterVisitesByUser } from "@/lib/dataFilters";

export default function PEV() {
  const { user } = useAuth();
  const [filtreStatut, setFiltreStatut] = useState<string>("tous");
  
  // Filtrer les patients selon le rôle de l'utilisateur
  const userPatients = filterPatientsByUser(mockPatients, user);
  const patientIds = new Set(userPatients.map(p => p.id));
  
  // Filtrer les vaccins pour les patients de l'utilisateur
  const userVaccins = mockVaccins.filter(v => patientIds.has(v.patient_id));

  const vaccins = filtreStatut === "tous" 
    ? userVaccins 
    : userVaccins.filter(v => v.statut === filtreStatut);

  const getStatutBadge = (statut: string) => {
    const variants = {
      'realise': 'outline',
      'retard': 'destructive',
      'prevu': 'secondary'
    } as const;
    
    const labels = {
      'realise': 'Réalisé',
      'retard': 'En retard',
      'prevu': 'Prévu'
    };

    return <Badge variant={variants[statut as keyof typeof variants] || 'default'}>
      {labels[statut as keyof typeof labels] || statut}
    </Badge>;
  };

  const getVaccinIcon = (vaccin: string) => {
    return <Syringe className="h-4 w-4" />;
  };

  const statsVaccins = {
    total: userVaccins.length,
    realises: userVaccins.filter(v => v.statut === 'realise').length,
    retard: userVaccins.filter(v => v.statut === 'retard').length,
    prevus: userVaccins.filter(v => v.statut === 'prevu').length,
  };

  const tauxCouverture = Math.round((statsVaccins.realises / statsVaccins.total) * 100);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">PEV & Nutrition</h1>
        <p className="text-muted-foreground">Programme Élargi de Vaccination et suivi nutritionnel</p>
      </div>

      {/* Stats globales */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Vaccins réalisés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {statsVaccins.realises}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Sur {statsVaccins.total} prévus
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              En retard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {statsVaccins.retard}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Nécessitent un rattrapage
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Prévus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {statsVaccins.prevus}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Dans les prochains jours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Taux de couverture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {tauxCouverture}%
            </div>
            <Progress value={tauxCouverture} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Couverture par vaccin */}
      <Card>
        <CardHeader>
          <CardTitle>Couverture vaccinale par type</CardTitle>
          <CardDescription>Répartition des vaccinations par type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['BCG', 'Polio0', 'Penta1', 'Penta2', 'Penta3'].map((vaccin) => {
              const total = userVaccins.filter(v => v.vaccin === vaccin).length;
              const realises = userVaccins.filter(v => v.vaccin === vaccin && v.statut === 'realise').length;
              const taux = total > 0 ? Math.round((realises / total) * 100) : 0;

              return (
                <div key={vaccin} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Syringe className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{vaccin}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {realises}/{total} ({taux}%)
                    </span>
                  </div>
                  <Progress value={taux} />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Filtres */}
      <div className="flex gap-2">
        <Button 
          variant={filtreStatut === "tous" ? "default" : "outline"}
          onClick={() => setFiltreStatut("tous")}
        >
          Tous
        </Button>
        <Button 
          variant={filtreStatut === "retard" ? "default" : "outline"}
          onClick={() => setFiltreStatut("retard")}
        >
          En retard
        </Button>
        <Button 
          variant={filtreStatut === "prevu" ? "default" : "outline"}
          onClick={() => setFiltreStatut("prevu")}
        >
          Prévus
        </Button>
        <Button 
          variant={filtreStatut === "realise" ? "default" : "outline"}
          onClick={() => setFiltreStatut("realise")}
        >
          Réalisés
        </Button>
      </div>

      {/* Liste des vaccinations */}
      <div className="grid gap-4">
        {vaccins.map((vaccin) => {
          const patient = mockPatients.find(p => p.id === vaccin.patient_id);
          
          return (
            <Card key={vaccin.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Baby className="h-5 w-5 text-muted-foreground" />
                      {patient ? `${patient.prenom} ${patient.nom}` : 'Patient inconnu'}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      {getVaccinIcon(vaccin.vaccin)}
                      Vaccin {vaccin.vaccin}
                    </CardDescription>
                  </div>
                  {getStatutBadge(vaccin.statut)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Date prévue
                    </div>
                    <div className="font-medium">{vaccin.date_prevue}</div>
                  </div>
                  {vaccin.date_realisee && (
                    <div className="space-y-1">
                      <div className="text-muted-foreground flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Date réalisée
                      </div>
                      <div className="font-medium">{vaccin.date_realisee}</div>
                    </div>
                  )}
                  <div className="space-y-1">
                    <div className="text-muted-foreground">Structure</div>
                    <div className="font-medium">{vaccin.structure}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
