/**
 * Mapping des structures sanitaires vers les districts et régions
 * Utilisé pour assurer la cohérence des données et faciliter la scalabilité
 */

export interface StructureInfo {
  district: string;
  region: string;
  type: 'poste' | 'centre' | 'hopital';
}

/**
 * Cartographie complète des structures sanitaires du Sénégal
 * Pour l'instant, focus sur la région de Dakar
 */
export const STRUCTURE_MAPPING: Record<string, StructureInfo> = {
  // District Dakar
  "Poste de Santé Dakar Nord": {
    district: "District Dakar",
    region: "Dakar",
    type: "poste",
  },
  "Centre de Santé Médina": {
    district: "District Dakar",
    region: "Dakar",
    type: "centre",
  },
  "Hôpital Principal Dakar": {
    district: "District Dakar",
    region: "Dakar",
    type: "hopital",
  },

  // District Pikine-Guédiawaye
  "Centre de Santé Pikine": {
    district: "District Pikine",
    region: "Dakar",
    type: "centre",
  },
  "Poste de Santé Guinaw Rails": {
    district: "District Pikine",
    region: "Dakar",
    type: "poste",
  },
  "Centre de Santé Guédiawaye": {
    district: "District Guédiawaye",
    region: "Dakar",
    type: "centre",
  },

  // District Rufisque
  "Hôpital Rufisque": {
    district: "District Rufisque",
    region: "Dakar",
    type: "hopital",
  },
  "Centre de Santé Rufisque": {
    district: "District Rufisque",
    region: "Dakar",
    type: "centre",
  },

  // Région Thiès (pour futur)
  "Centre de Santé Thiès": {
    district: "District Thiès",
    region: "Thiès",
    type: "centre",
  },
  "Poste de Santé Mbour": {
    district: "District Mbour",
    region: "Thiès",
    type: "poste",
  },
  "Hôpital Thiès": {
    district: "District Thiès",
    region: "Thiès",
    type: "hopital",
  },
};

/**
 * Récupère les informations de district et région pour une structure
 */
export function getStructureInfo(structureName: string): StructureInfo | null {
  return STRUCTURE_MAPPING[structureName] || null;
}

/**
 * Récupère le district d'une structure
 */
export function getDistrictFromStructure(structureName: string): string | null {
  const info = getStructureInfo(structureName);
  return info?.district || null;
}

/**
 * Récupère la région d'une structure
 */
export function getRegionFromStructure(structureName: string): string | null {
  const info = getStructureInfo(structureName);
  return info?.region || null;
}

/**
 * Liste tous les districts disponibles
 */
export function getAllDistricts(): string[] {
  const districts = new Set<string>();
  Object.values(STRUCTURE_MAPPING).forEach((info) => {
    districts.add(info.district);
  });
  return Array.from(districts).sort();
}

/**
 * Liste toutes les régions disponibles
 */
export function getAllRegions(): string[] {
  const regions = new Set<string>();
  Object.values(STRUCTURE_MAPPING).forEach((info) => {
    regions.add(info.region);
  });
  return Array.from(regions).sort();
}

/**
 * Liste les structures d'un district
 */
export function getStructuresByDistrict(district: string): string[] {
  return Object.entries(STRUCTURE_MAPPING)
    .filter(([_, info]) => info.district === district)
    .map(([structureName]) => structureName)
    .sort();
}

/**
 * Liste les structures d'une région
 */
export function getStructuresByRegion(region: string): string[] {
  return Object.entries(STRUCTURE_MAPPING)
    .filter(([_, info]) => info.region === region)
    .map(([structureName]) => structureName)
    .sort();
}

/**
 * Liste les districts d'une région
 */
export function getDistrictsByRegion(region: string): string[] {
  const districts = new Set<string>();
  Object.values(STRUCTURE_MAPPING).forEach((info) => {
    if (info.region === region) {
      districts.add(info.district);
    }
  });
  return Array.from(districts).sort();
}

/**
 * Valide qu'une structure existe
 */
export function isValidStructure(structureName: string): boolean {
  return structureName in STRUCTURE_MAPPING;
}

/**
 * Valide qu'un district existe
 */
export function isValidDistrict(district: string): boolean {
  return getAllDistricts().includes(district);
}

/**
 * Valide qu'une région existe
 */
export function isValidRegion(region: string): boolean {
  return getAllRegions().includes(region);
}

/**
 * Ajoute automatiquement district et région à un objet patient
 * Basé sur la structure
 */
export function enrichWithLocationData<T extends { structure: string }>(
  item: T
): T & { district: string; region: string } {
  const info = getStructureInfo(item.structure);

  if (!info) {
    console.warn(`Structure inconnue: ${item.structure}. Utilisation des valeurs par défaut.`);
    return {
      ...item,
      district: "District Inconnu",
      region: "Dakar", // Par défaut
    };
  }

  return {
    ...item,
    district: info.district,
    region: info.region,
  };
}

/**
 * Statistiques sur la répartition géographique
 */
export function getGeographicStats() {
  const stats = {
    totalStructures: Object.keys(STRUCTURE_MAPPING).length,
    totalDistricts: getAllDistricts().length,
    totalRegions: getAllRegions().length,
    structuresByType: {
      poste: 0,
      centre: 0,
      hopital: 0,
    },
    structuresByRegion: {} as Record<string, number>,
    structuresByDistrict: {} as Record<string, number>,
  };

  Object.values(STRUCTURE_MAPPING).forEach((info) => {
    stats.structuresByType[info.type]++;

    stats.structuresByRegion[info.region] =
      (stats.structuresByRegion[info.region] || 0) + 1;

    stats.structuresByDistrict[info.district] =
      (stats.structuresByDistrict[info.district] || 0) + 1;
  });

  return stats;
}

// Export des constantes pour utilisation facile
export const REGIONS = {
  DAKAR: "Dakar",
  THIES: "Thiès",
  // Autres régions à ajouter au fur et à mesure
} as const;

export const DISTRICTS = {
  DAKAR: "District Dakar",
  PIKINE: "District Pikine",
  GUEDIAWAYE: "District Guédiawaye",
  RUFISQUE: "District Rufisque",
  THIES: "District Thiès",
  MBOUR: "District Mbour",
} as const;
