import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockRisquesIA, mockPatients } from "@/data/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Eye, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PatientCard } from "@/components/PatientCard";
import { useAuth } from "@/contexts/AuthContext";
import { filterPatientsByUser, filterRisquesByUser } from "@/lib/dataFilters";

export default function Risques() {
  const { user } = useAuth();
  
  // Filtrer les données selon le rôle de l'utilisateur
  const userPatients = filterPatientsByUser(mockPatients, user);
  const userRisques = filterRisquesByUser(mockRisquesIA, mockPatients, user);
  
  // Calculer les stats basées sur les risques filtrés
  const stats = {
    rouge: userRisques.filter(r => r.niveau === 'rouge').length,
    orange: userRisques.filter(r => r.niveau === 'orange').length,
    vert: userRisques.filter(r => r.niveau === 'vert').length,
  };
  
  const getSemaphoreColor = (niveau: string) => {
    switch (niveau) {
      case 'rouge':
        return 'bg-[hsl(var(--status-rouge))]';
      case 'orange':
        return 'bg-[hsl(var(--status-orange))]';
      case 'vert':
        return 'bg-[hsl(var(--status-vert))]';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Risques IA - Détection Prédictive</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Filtrer par niveau</Button>
          <Button size="sm">Export Audit CSV</Button>
        </div>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-[hsl(var(--status-rouge)/0.1)] flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-[hsl(var(--status-rouge))]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Alertes Rouges</p>
                <p className="text-2xl font-bold">{stats.rouge}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-[hsl(var(--status-orange)/0.1)] flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-[hsl(var(--status-orange))]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Alertes Orange</p>
                <p className="text-2xl font-bold">{stats.orange}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-[hsl(var(--status-vert)/0.1)] flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-[hsl(var(--status-vert))]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Suivi Normal</p>
                <p className="text-2xl font-bold">{stats.vert}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fiches Patientes */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Fiches Patientes à Risque</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {userPatients.slice(0, 6).map((patient) => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </div>
      </div>

      {/* Tableau des risques */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Tableau interactif des risques</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patiente</TableHead>
                <TableHead>Âge</TableHead>
                <TableHead>SA</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Sémaphore</TableHead>
                <TableHead>Facteurs déclenchés</TableHead>
                <TableHead>Règle IA</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userRisques.map((risque) => (
                <TableRow key={risque.id}>
                  <TableCell className="font-medium">{risque.patient_nom}</TableCell>
                  <TableCell>{risque.age} ans</TableCell>
                  <TableCell>{risque.semaines} SA</TableCell>
                  <TableCell>
                    <span className="font-bold">{risque.score}</span>
                  </TableCell>
                  <TableCell>
                    <div className={`h-4 w-4 rounded-full ${getSemaphoreColor(risque.niveau)}`} />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {risque.facteurs.map((facteur, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {facteur}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge>{risque.regle_ia}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{risque.date}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          Détails
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Détail du risque - {risque.patient_nom}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">Score de risque: {risque.score}/100</h4>
                            <div className="h-3 bg-muted rounded-full overflow-hidden">
                              <div
                                className={getSemaphoreColor(risque.niveau)}
                                style={{ width: `${risque.score}%`, height: '100%' }}
                              />
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-2">Facteurs de risque</h4>
                            <ul className="space-y-2">
                              {risque.facteurs.map((facteur, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <AlertTriangle className="h-4 w-4 text-[hsl(var(--status-orange))] mt-0.5" />
                                  <span className="text-sm">{facteur}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {risque.prediction && (
                            <div className="p-4 bg-[hsl(var(--status-rouge)/0.1)] rounded-lg border border-[hsl(var(--status-rouge)/0.3)]">
                              <h4 className="font-semibold mb-1 text-[hsl(var(--status-rouge))]">Prédiction IA</h4>
                              <p className="text-sm">{risque.prediction}</p>
                            </div>
                          )}

                          <div>
                            <h4 className="font-semibold mb-2">Arbre de décision</h4>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <p>→ Âge &lt; 18 ans: +30 points</p>
                              <p>→ HTA (150/100): +35 points</p>
                              <p>→ PB &lt; 21cm: +20 points</p>
                              <p className="font-semibold text-foreground mt-2">= Score total: {risque.score}</p>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
