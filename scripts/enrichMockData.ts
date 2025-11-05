/**
 * Script utilitaire pour enrichir les données mockées avec district et region
 * Basé sur le mapping des structures
 *
 * Usage: npm run enrich-mock-data
 * ou directement: ts-node scripts/enrichMockData.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// Mapping des structures vers district et région
const STRUCTURE_MAPPING: Record<string, { district: string; region: string }> = {
  // District Dakar
  "Poste de Santé Dakar Nord": {
    district: "District Dakar",
    region: "Dakar",
  },
  "Centre de Santé Médina": {
    district: "District Dakar",
    region: "Dakar",
  },
  "Hôpital Principal Dakar": {
    district: "District Dakar",
    region: "Dakar",
  },

  // District Pikine-Guédiawaye
  "Centre de Santé Pikine": {
    district: "District Pikine",
    region: "Dakar",
  },
  "Poste de Santé Guinaw Rails": {
    district: "District Pikine",
    region: "Dakar",
  },
  "Centre de Santé Guédiawaye": {
    district: "District Guédiawaye",
    region: "Dakar",
  },

  // District Rufisque
  "Hôpital Rufisque": {
    district: "District Rufisque",
    region: "Dakar",
  },
  "Centre de Santé Rufisque": {
    district: "District Rufisque",
    region: "Dakar",
  },

  // Région Thiès
  "Centre de Santé Thiès": {
    district: "District Thiès",
    region: "Thiès",
  },
  "Poste de Santé Mbour": {
    district: "District Mbour",
    region: "Thiès",
  },
  "Hôpital Thiès": {
    district: "District Thiès",
    region: "Thiès",
  },
};

/**
 * Guide pour ajouter manuellement les champs district et region
 * Affiche les informations pour chaque structure trouvée
 */
function main() {
  console.log("=".repeat(60));
  console.log("📋 GUIDE D'ENRICHISSEMENT DES DONNÉES MOCKÉES");
  console.log("=".repeat(60));
  console.log();

  console.log("Instructions:");
  console.log("1. Ouvrir src/data/mockData.ts");
  console.log("2. Pour chaque patient, ajouter les champs suivants:");
  console.log();

  console.log("Format à ajouter après 'structure: ...':");
  console.log("```typescript");
  console.log('district: "District XXX",  // Selon le mapping ci-dessous');
  console.log('region: "Région XXX",      // Selon le mapping ci-dessous');
  console.log("```");
  console.log();

  console.log("=".repeat(60));
  console.log("📍 MAPPING DES STRUCTURES");
  console.log("=".repeat(60));
  console.log();

  // Grouper par région
  const byRegion: Record<string, Array<{ structure: string; district: string }>> = {};

  Object.entries(STRUCTURE_MAPPING).forEach(([structure, info]) => {
    if (!byRegion[info.region]) {
      byRegion[info.region] = [];
    }
    byRegion[info.region].push({
      structure,
      district: info.district,
    });
  });

  Object.entries(byRegion).forEach(([region, structures]) => {
    console.log(`\n🏛️  RÉGION: ${region}`);
    console.log("-".repeat(60));

    // Grouper par district
    const byDistrict: Record<string, string[]> = {};
    structures.forEach(({ structure, district }) => {
      if (!byDistrict[district]) {
        byDistrict[district] = [];
      }
      byDistrict[district].push(structure);
    });

    Object.entries(byDistrict).forEach(([district, structureNames]) => {
      console.log(`\n  📌 ${district}:`);
      structureNames.forEach((name) => {
        console.log(`     - ${name}`);
        console.log(`       district: "${district}",`);
        console.log(`       region: "${region}",`);
      });
    });
  });

  console.log();
  console.log("=".repeat(60));
  console.log("📝 EXEMPLE DE TRANSFORMATION");
  console.log("=".repeat(60));
  console.log();

  console.log("AVANT:");
  console.log("```typescript");
  console.log("{");
  console.log('  id: "p1",');
  console.log('  nom: "Diop",');
  console.log('  prenom: "Fatou",');
  console.log("  // ... autres champs");
  console.log('  structure: "Poste de Santé Dakar Nord",');
  console.log('  agent: "Aminata Sall",');
  console.log("}");
  console.log("```");
  console.log();

  console.log("APRÈS:");
  console.log("```typescript");
  console.log("{");
  console.log('  id: "p1",');
  console.log('  nom: "Diop",');
  console.log('  prenom: "Fatou",');
  console.log("  // ... autres champs");
  console.log('  structure: "Poste de Santé Dakar Nord",');
  console.log('  district: "District Dakar",  // 🆕 AJOUTÉ');
  console.log('  region: "Dakar",              // 🆕 AJOUTÉ');
  console.log('  agent: "Aminata Sall",');
  console.log("}");
  console.log("```");
  console.log();

  console.log("=".repeat(60));
  console.log("✅ VALIDATION");
  console.log("=".repeat(60));
  console.log();
  console.log("Après modification, vérifier que:");
  console.log("1. ✓ Tous les patients ont un champ 'district'");
  console.log("2. ✓ Tous les patients ont un champ 'region'");
  console.log("3. ✓ Les valeurs correspondent au mapping ci-dessus");
  console.log("4. ✓ Pas d'erreurs TypeScript");
  console.log();

  console.log("=".repeat(60));
  console.log("🚀 SCALABILITÉ FUTURE");
  console.log("=".repeat(60));
  console.log();
  console.log("Pour ajouter une nouvelle structure:");
  console.log("1. Ajouter dans src/lib/districtMapping.ts");
  console.log("2. Mettre à jour ce script");
  console.log("3. Relancer: npm run enrich-mock-data");
  console.log();

  console.log("=".repeat(60));
  console.log("📊 STATISTIQUES");
  console.log("=".repeat(60));
  console.log();
  console.log(`Total structures mappées: ${Object.keys(STRUCTURE_MAPPING).length}`);
  console.log(`Total régions: ${Object.keys(byRegion).length}`);
  console.log(
    `Total districts: ${new Set(Object.values(STRUCTURE_MAPPING).map((i) => i.district)).size}`
  );
  console.log();

  // Afficher les régions et districts disponibles
  console.log("Régions actives:");
  Object.keys(byRegion).forEach((region) => {
    console.log(`  - ${region}`);
  });
  console.log();

  console.log("Districts actifs:");
  const allDistricts = new Set(Object.values(STRUCTURE_MAPPING).map((i) => i.district));
  Array.from(allDistricts)
    .sort()
    .forEach((district) => {
      console.log(`  - ${district}`);
    });
  console.log();
}

// Exécuter le script
main();
