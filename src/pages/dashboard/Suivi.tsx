import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockCPNMonthly, mockRdvRetards } from "@/data/mockData";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Phone, Mail } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { DataFilters } from "@/components/DataFilters";
import { SearchBar } from "@/components/SearchBar";
import { StatusFilter, StatusOption } from "@/components/StatusFilter";
import { useState } from "react";

const retardStatusOptions: StatusOption[] = [
  { value: "tous", label: "Tous" },
  { value: "modere", label: "Modéré (3-7j)" },
  { value: "eleve", label: "Élevé (7-14j)" },
  { value: "critique", label: "Critique (>14j)" },
];

// Custom Tooltip component for theme adaptation
interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    color: string;
    name: string;
    value: number;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-900 text-black dark:text-white p-2 border rounded shadow-lg">
        <p className="font-medium">{`Mois: ${label}`}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Suivi() {
  const { user } = useAuth();
  const [selectedStructure, setSelectedStructure] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [retardFilter, setRetardFilter] = useState("tous");

  // Filtrer les rendez-vous selon le rôle de l'utilisateur
  let userRdvRetards =
    user?.role === "sage_femme"
      ? mockRdvRetards.filter(
          (rdv) => rdv.agent === `${user.prenom} ${user.nom}`
        )
      : user?.role === "responsable_structure" && user.structure
      ? mockRdvRetards.filter((rdv) => rdv.structure === user.structure)
      : mockRdvRetards;

  // Filtrage par structure pour responsable district
  if (user?.role === "responsable_district" && selectedStructure !== "all") {
    userRdvRetards = userRdvRetards.filter(
      (rdv) => rdv.structure === selectedStructure
    );
  }

  // Filtrage par niveau de retard
  let filteredByRetard = userRdvRetards;
  if (retardFilter === "modere") {
    filteredByRetard = userRdvRetards.filter(
      (rdv) => rdv.retard_jours >= 3 && rdv.retard_jours < 7
    );
  } else if (retardFilter === "eleve") {
    filteredByRetard = userRdvRetards.filter(
      (rdv) => rdv.retard_jours >= 7 && rdv.retard_jours < 14
    );
  } else if (retardFilter === "critique") {
    filteredByRetard = userRdvRetards.filter((rdv) => rdv.retard_jours >= 14);
  }

  // Filtrage par recherche
  const filteredRdv = searchTerm
    ? filteredByRetard.filter(
        (rdv) =>
          rdv.patient_nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rdv.telephone.includes(searchTerm) ||
          rdv.agent.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : filteredByRetard;

  const handleRappelSMS = (telephone: string, nom: string) => {
    toast.success(`Rappel SMS envoyé à ${nom} (${telephone})`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Suivi CPN</h2>
        <div className="flex gap-2">
          <DataFilters
            selectedStructure={selectedStructure}
            onStructureChange={setSelectedStructure}
          />
          <Button size="sm">Export Excel</Button>
        </div>
      </div>

      {/* Filtres et Recherche */}
      <div className="space-y-4">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <StatusFilter
            options={retardStatusOptions}
            selected={retardFilter}
            onChange={setRetardFilter}
          />
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Rechercher par nom, téléphone ou agent..."
          />
        </div>
      </div>

      {/* Graphique CPN1-4 par mois */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Évolution CPN1-4 par mois</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={mockCPNMonthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mois" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="cpn1"
                stroke="#3B82F6"
                strokeWidth={2}
                name="CPN1"
              />
              <Line
                type="monotone"
                dataKey="cpn2"
                stroke="#10B981"
                strokeWidth={2}
                name="CPN2"
              />
              <Line
                type="monotone"
                dataKey="cpn3"
                stroke="#F59E0B"
                strokeWidth={2}
                name="CPN3"
              />
              <Line
                type="monotone"
                dataKey="cpn4"
                stroke="#EF4444"
                strokeWidth={2}
                name="CPN4"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tableau RDV en retard */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Rendez-vous en retard (&gt; 3 jours)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patiente</TableHead>
                <TableHead>Âge</TableHead>
                <TableHead>Semaines</TableHead>
                <TableHead>Retard (jours)</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Structure</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRdv.map((rdv) => (
                <TableRow key={rdv.id}>
                  <TableCell className="font-medium">
                    {rdv.patient_nom}
                  </TableCell>
                  <TableCell>{rdv.age} ans</TableCell>
                  <TableCell>{rdv.semaines} SA</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[hsl(var(--status-orange)/0.1)] text-[hsl(var(--status-orange))]">
                      {rdv.retard_jours}j
                    </span>
                  </TableCell>
                  <TableCell>{rdv.agent}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {rdv.structure}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleRappelSMS(rdv.telephone, rdv.patient_nom)
                        }
                      >
                        <Phone className="h-3 w-3 mr-1" />
                        SMS
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Mail className="h-3 w-3" />
                      </Button>
                    </div>
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
