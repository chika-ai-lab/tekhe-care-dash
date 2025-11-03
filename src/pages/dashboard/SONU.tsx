import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockReferencesSonu, mockPatients } from "@/data/mockData";
import { Clock, MapPin, AlertCircle, CheckCircle, Ambulance, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { filterReferencesByUser } from "@/lib/dataFilters";

export default function SONU() {
  const { user } = useAuth();
  const [filtreStatut, setFiltreStatut] = useState<string>("tous");
  
  // Filtrer les références selon le rôle de l'utilisateur
  const userReferences = filterReferencesByUser(mockReferencesSonu, mockPatients, user);

  const references = filtreStatut === "tous" 
    ? userReferences 
    : userReferences.filter(r => r.statut === filtreStatut);

  const getStatutBadge = (statut: string) => {
    const variants = {
      'alerte': 'destructive',
      'en_route': 'default',
      'admis': 'secondary',
      'resolu': 'outline'
    } as const;
    
    const labels = {
      'alerte': 'Alerte',
      'en_route': 'En route',
      'admis': 'Admis',
      'resolu': 'Résolu'
    };

    return <Badge variant={variants[statut as keyof typeof variants] || 'default'}>
      {labels[statut as keyof typeof labels] || statut}
    </Badge>;
  };

  const getDelaiColor = (delai?: number) => {
    if (!delai) return "text-muted-foreground";
    if (delai < 60) return "text-green-600";
    if (delai < 120) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Références SONU</h1>
        <p className="text-muted-foreground">Suivi des urgences obstétricales et néonatales</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Alertes actives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {userReferences.filter(r => r.statut === 'alerte').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">En transit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {userReferences.filter(r => r.statut === 'en_route').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Admis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userReferences.filter(r => r.statut === 'admis').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Délai moyen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {userReferences.length > 0 ? Math.round(userReferences.reduce((acc, r) => acc + (r.delai_minutes || 0), 0) / userReferences.length) : 0} min
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <div className="flex gap-2">
        <Button 
          variant={filtreStatut === "tous" ? "default" : "outline"}
          onClick={() => setFiltreStatut("tous")}
        >
          Tous
        </Button>
        <Button 
          variant={filtreStatut === "alerte" ? "default" : "outline"}
          onClick={() => setFiltreStatut("alerte")}
        >
          Alertes
        </Button>
        <Button 
          variant={filtreStatut === "en_route" ? "default" : "outline"}
          onClick={() => setFiltreStatut("en_route")}
        >
          En route
        </Button>
        <Button 
          variant={filtreStatut === "admis" ? "default" : "outline"}
          onClick={() => setFiltreStatut("admis")}
        >
          Admis
        </Button>
        <Button 
          variant={filtreStatut === "resolu" ? "default" : "outline"}
          onClick={() => setFiltreStatut("resolu")}
        >
          Résolus
        </Button>
      </div>

      {/* Liste des références */}
      <div className="space-y-4">
        {references.map((ref) => (
          <Card key={ref.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{ref.patient_nom}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {ref.type_alerte}
                  </CardDescription>
                </div>
                {getStatutBadge(ref.statut)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Timeline */}
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{ref.structure_origine}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <div className="flex items-center gap-2">
                  <Ambulance className="h-4 w-4 text-accent" />
                  <span className="font-medium text-accent">{ref.structure_sonu}</span>
                </div>
              </div>

              {/* Horaires */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Alerte
                  </div>
                  <div className="font-medium">{ref.alerte_heure}</div>
                </div>
                {ref.transport_heure && (
                  <div className="space-y-1">
                    <div className="text-muted-foreground flex items-center gap-1">
                      <Ambulance className="h-3 w-3" />
                      Transport
                    </div>
                    <div className="font-medium">{ref.transport_heure}</div>
                  </div>
                )}
                {ref.admission_heure && (
                  <div className="space-y-1">
                    <div className="text-muted-foreground flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Admission
                    </div>
                    <div className="font-medium">{ref.admission_heure}</div>
                  </div>
                )}
                {ref.contre_ref_heure && (
                  <div className="space-y-1">
                    <div className="text-muted-foreground flex items-center gap-1">
                      <ArrowRight className="h-3 w-3" />
                      Contre-référence
                    </div>
                    <div className="font-medium">{ref.contre_ref_heure}</div>
                  </div>
                )}
              </div>

              {/* Délai */}
              {ref.delai_minutes && (
                <div className="flex items-center gap-2 pt-2 border-t">
                  <Clock className={`h-4 w-4 ${getDelaiColor(ref.delai_minutes)}`} />
                  <span className={`font-semibold ${getDelaiColor(ref.delai_minutes)}`}>
                    Délai total: {ref.delai_minutes} minutes
                  </span>
                  {ref.delai_minutes < 60 && (
                    <Badge variant="outline" className="ml-auto bg-green-50 text-green-700 border-green-200">
                      Objectif atteint
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
