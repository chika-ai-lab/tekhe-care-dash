import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockKPIData, mockPatients, mockVisites, mockRisquesIA, mockReferencesSonu } from "@/data/mockData";
import { Database, Download, Upload, CheckCircle, AlertCircle, Calendar, FileText } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function DHIS2() {
  const [periode, setPeriode] = useState<string>("mois");
  const [indicateur, setIndicateur] = useState<string>("tous");

  const handleExport = () => {
    toast.success("Export DHIS2 en cours...");
    // Simulation de l'export
    setTimeout(() => {
      toast.success("Export DHIS2 terminé avec succès!");
    }, 2000);
  };

  const handleImport = () => {
    toast.info("Import DHIS2 en cours...");
    setTimeout(() => {
      toast.success("Import DHIS2 terminé avec succès!");
    }, 2000);
  };

  const indicateurs = [
    {
      code: "CPN1",
      nom: "Consultations Prénatales 1ère visite",
      valeur: mockKPIData.cpn1_realisees,
      cible: mockKPIData.cpn1_cible,
      statut: "ok"
    },
    {
      code: "CPN4",
      nom: "Consultations Prénatales 4ème visite",
      valeur: mockKPIData.cpn4_realisees,
      cible: mockKPIData.cpn4_cible,
      statut: "warning"
    },
    {
      code: "CPON",
      nom: "Consultations Post-Natales",
      valeur: Math.round((mockKPIData.cpon_pourcentage / 100) * mockKPIData.patientes_totales),
      cible: mockKPIData.patientes_totales,
      statut: "ok"
    },
    {
      code: "SONU",
      nom: "Références SONU",
      valeur: mockReferencesSonu.length,
      cible: mockReferencesSonu.length,
      statut: "ok"
    },
    {
      code: "CSU",
      nom: "Enrôlements CSU",
      valeur: mockKPIData.csu_enrolled,
      cible: mockKPIData.patientes_totales,
      statut: "ok"
    },
    {
      code: "PEV",
      nom: "Couverture vaccinale",
      valeur: mockKPIData.pev_complet_pourcentage,
      cible: 100,
      statut: "warning"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Export DHIS2</h1>
        <p className="text-muted-foreground">Synchronisation des données avec le système national DHIS2</p>
      </div>

      {/* Actions principales */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Configuration de l'export
            </CardTitle>
            <CardDescription>Sélectionnez la période et les indicateurs à exporter</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Période</label>
                <Select value={periode} onValueChange={setPeriode}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jour">Aujourd'hui</SelectItem>
                    <SelectItem value="semaine">Cette semaine</SelectItem>
                    <SelectItem value="mois">Ce mois</SelectItem>
                    <SelectItem value="trimestre">Ce trimestre</SelectItem>
                    <SelectItem value="annee">Cette année</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Indicateurs</label>
                <Select value={indicateur} onValueChange={setIndicateur}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tous">Tous les indicateurs</SelectItem>
                    <SelectItem value="cpn">CPN uniquement</SelectItem>
                    <SelectItem value="sonu">SONU uniquement</SelectItem>
                    <SelectItem value="csu">CSU uniquement</SelectItem>
                    <SelectItem value="pev">PEV uniquement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleExport} className="flex-1">
                <Upload className="h-4 w-4 mr-2" />
                Exporter vers DHIS2
              </Button>
              <Button variant="outline" onClick={handleImport} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Importer depuis DHIS2
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Statut de synchronisation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Dernière synchronisation</span>
                <Badge variant="outline">Il y a 2h</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Prochaine synchronisation</span>
                <Badge variant="secondary">Dans 22h</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Statut</span>
                <Badge className="bg-primary">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Actif
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Indicateurs à exporter */}
      <Card>
        <CardHeader>
          <CardTitle>Indicateurs DHIS2</CardTitle>
          <CardDescription>Aperçu des indicateurs prêts à être exportés</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {indicateurs.map((ind) => {
              const taux = Math.round((ind.valeur / ind.cible) * 100);
              const isOk = taux >= 80;

              return (
                <div key={ind.code} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{ind.nom}</span>
                      <Badge variant="outline" className="text-xs">{ind.code}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {ind.valeur} / {ind.cible} ({taux}%)
                    </div>
                  </div>
                  {isOk ? (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-accent" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Historique des exports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Historique des exports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { date: "2025-10-29 14:30", periode: "Octobre 2025", statut: "success", enregistrements: 156 },
              { date: "2025-10-01 09:15", periode: "Septembre 2025", statut: "success", enregistrements: 142 },
              { date: "2025-09-01 10:00", periode: "Août 2025", statut: "success", enregistrements: 138 },
              { date: "2025-08-01 08:45", periode: "Juillet 2025", statut: "warning", enregistrements: 95 },
            ].map((export_item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {export_item.statut === "success" ? (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-accent" />
                  )}
                  <div>
                    <div className="font-medium">{export_item.periode}</div>
                    <div className="text-sm text-muted-foreground">{export_item.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{export_item.enregistrements} enregistrements</div>
                  <Badge variant={export_item.statut === "success" ? "outline" : "secondary"} className="mt-1">
                    {export_item.statut === "success" ? "Réussi" : "Partiel"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
