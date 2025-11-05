/**
 * Composant de filtres adapté selon le rôle de l'utilisateur
 * - Responsable District: Filtre par structure
 * - Autres rôles: Pas de filtre (voient leurs données filtrées automatiquement)
 */

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { mockPatients } from "@/data/mockData";

interface DataFiltersProps {
  selectedStructure: string;
  onStructureChange: (value: string) => void;
}

export function DataFilters({ selectedStructure, onStructureChange }: DataFiltersProps) {
  const { user } = useAuth();

  // Seul le responsable district peut filtrer par structure
  if (user?.role !== 'responsable_district') {
    return null;
  }

  // Extraire la liste unique des structures du district de l'utilisateur
  const structures = Array.from(
    new Set(mockPatients
      .filter(p => p.district === user.district)
      .map(p => p.structure))
  ).sort();

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Structure:</label>
        <Select value={selectedStructure} onValueChange={onStructureChange}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Toutes les structures" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les structures</SelectItem>
            {structures.map((structure) => (
              <SelectItem key={structure} value={structure}>
                {structure}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
