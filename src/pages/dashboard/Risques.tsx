import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockRisquesIA, mockPatients } from "@/data/mockData";
import { AlertTriangle } from "lucide-react";
import { PatientCard } from "@/components/PatientCard";
import { useAuth } from "@/contexts/AuthContext";
import { filterPatientsByUser, filterRisquesByUser } from "@/lib/dataFilters";
import { DataFilters } from "@/components/DataFilters";
import { SearchBar } from "@/components/SearchBar";
import { StatusFilter, StatusOption } from "@/components/StatusFilter";
import { useState } from "react";

const risqueStatusOptions: StatusOption[] = [
  { value: "tous", label: "Tous" },
  { value: "rouge", label: "Rouge" },
  { value: "orange", label: "Orange" },
  { value: "vert", label: "Vert" },
];

export default function Risques() {
  const { user } = useAuth();
  const [selectedStructure, setSelectedStructure] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [risqueFilter, setRisqueFilter] = useState("tous");

  // Filtrer les données selon le rôle de l'utilisateur
  let userPatients = filterPatientsByUser(mockPatients, user);
  let userRisques = filterRisquesByUser(mockRisquesIA, mockPatients, user);

  // Filtrage par structure pour responsable district
  if (user?.role === 'responsable_district' && selectedStructure !== "all") {
    userPatients = userPatients.filter(p => p.structure === selectedStructure);
    userRisques = userRisques.filter(r => {
      const patient = mockPatients.find(p => p.id === r.patient_id);
      return patient?.structure === selectedStructure;
    });
  }

  // Filtrage par niveau de risque
  let filteredByRisque = userPatients;
  if (risqueFilter !== "tous") {
    const risqueIds = userRisques
      .filter(r => r.niveau === risqueFilter)
      .map(r => r.patient_id);
    filteredByRisque = userPatients.filter(p => risqueIds.includes(p.id));
  }

  // Filtrage par recherche
  const filteredPatients = searchTerm
    ? filteredByRisque.filter(
        (p) =>
          p.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.telephone.includes(searchTerm) ||
          p.agent.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : filteredByRisque;
  
  // Calculer les stats basées sur les risques filtrés
  const stats = {
    rouge: userRisques.filter(r => r.niveau === 'rouge').length,
    orange: userRisques.filter(r => r.niveau === 'orange').length,
    vert: userRisques.filter(r => r.niveau === 'vert').length,
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Risques IA - Détection Prédictive</h2>
        <div className="flex gap-2">
          <DataFilters
            selectedStructure={selectedStructure}
            onStructureChange={setSelectedStructure}
          />
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

      {/* Filtres et Recherche */}
      <div className="space-y-4">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <StatusFilter
            options={risqueStatusOptions}
            selected={risqueFilter}
            onChange={setRisqueFilter}
          />
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Rechercher par nom, téléphone ou agent..."
          />
        </div>
      </div>

      {/* Fiches Patientes à Risque */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Patientes à Risque</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPatients.map((patient) => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Aucune patiente à risque détectée
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
