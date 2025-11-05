# Système RBAC - Contrôle d'Accès Hiérarchique

## Vue d'ensemble

Système de contrôle d'accès basé sur les rôles (RBAC), centré sur le **niveau DISTRICT** avec architecture scalable pour extension régionale/nationale future.

---

## Hiérarchie des Rôles

### Personnel de Santé

**Sage-femme** (Scope: OWN)
- Voit uniquement ses propres patientes
- Créer/Modifier: Patientes, Visites, CSU, PEV, Nutrition
- Lire: Risques IA

**Responsable Structure** (Scope: STRUCTURE)
- Voit toute sa structure de santé
- Créer/Modifier: Toutes données de sa structure
- Lire: Personnel, Analytics

**Responsable District** (Scope: DISTRICT) - Niveau maximum actuel
- Voit tout son district
- Toutes permissions: Créer, Modifier, Supprimer
- Exporter: DHIS2, Analytics
- Gérer: Personnel et structures

### Partenaires

**ONG / Régional / Gouvernemental** (Scope: ANONYMOUS)
- Analytics anonymisées uniquement
- Aucune donnée individuelle

---

## Matrice des Permissions

| Ressource | Sage-femme | Resp. Structure | Resp. District | Partenaires |
|-----------|------------|-----------------|----------------|-------------|
| Patient - Create | ✅ (propres) | ✅ (structure) | ✅ (district) | ❌ |
| Patient - Read | ✅ (propres) | ✅ (structure) | ✅ (district) | ❌ |
| Patient - Update | ✅ (propres) | ✅ (structure) | ✅ (district) | ❌ |
| Patient - Delete | ❌ | ❌ | ✅ | ❌ |
| Visite - CRUD | ✅ (propres) | ✅ (structure) | ✅ (district) | ❌ |
| Risque - Read | ✅ (propres) | ✅ (structure) | ✅ (district) | ❌ |
| Risque - Update | ❌ | ✅ | ✅ | ❌ |
| DHIS2 - Export | ❌ | ❌ | ✅ | ❌ |
| Analytics | ❌ | ✅ | ✅ | ✅ (anonymisé) |

---

## Utilisation

### Vérifier une permission

```typescript
import { usePermissions } from '@/hooks/usePermissions';
import { Resource } from '@/lib/permissions';

function MyComponent() {
  const { canCreate, canUpdate, canDelete } = usePermissions();

  return (
    <>
      {canCreate(Resource.PATIENT) && <Button>Créer</Button>}
      {canDelete(Resource.PATIENT) && <Button>Supprimer</Button>}
    </>
  );
}
```

### Protéger un composant

```typescript
import { CreateGuard, DeleteGuard } from '@/components/PermissionGuard';
import { Resource } from '@/lib/permissions';

<CreateGuard resource={Resource.PATIENT}>
  <Button>Nouvelle Patiente</Button>
</CreateGuard>
```

### Filtrer les données

```typescript
import { filterPatientsByUser } from '@/lib/dataFilters';

const visiblePatients = filterPatientsByUser(allPatients, user);
```

---

## Fichiers Principaux

```
src/
├── lib/
│   ├── permissions.ts       # Système RBAC complet
│   ├── dataFilters.ts       # Filtres hiérarchiques
│   ├── auditLog.ts          # Traçabilité
│   └── districtMapping.ts   # Mapping géographique
├── hooks/
│   └── usePermissions.ts    # Hook de vérification
├── components/
│   └── PermissionGuard.tsx  # Guards visuels
└── pages/dashboard/
    └── PermissionsMatrix.tsx # Admin (visualisation)
```

---

## Scalabilité Future

### Phase Actuelle: District ✅
- Focus sur le niveau district (opérationnel)
- Responsable district = niveau maximum
- Gestion décentralisée

### Extension Régionale (Préparée 🔧)
**Déclencheurs**: District validé 3-6 mois, besoin multi-districts

**Actions**:
1. Activer rôle `responsable_regional` dans `permissions.ts`
2. Décommenter code REGION dans `dataFilters.ts`
3. Créer utilisateurs régionaux avec `region: "Dakar"`

**Permissions suggérées**:
- Lecture: Toutes données de la région
- Modification: Risques et références
- Export: Analytics et DHIS2
- Gestion: Lecture personnel/structures

### Extension Nationale (Futur lointain 🔧)
**Conditions**: Régional validé dans 3+ régions, backend API, infrastructure

**Permissions suggérées**:
- Lecture seule sur toutes données
- Analytics et consolidation nationale
- Scope: `NATIONAL` (aucun filtrage)

---

## Structure Géographique

```
Région Dakar
├── District Dakar
│   ├── Poste de Santé Dakar Nord
│   ├── Centre de Santé Médina
│   └── Hôpital Principal Dakar
├── District Pikine
├── District Guédiawaye
└── District Rufisque

Région Thiès (préparée)
├── District Thiès
└── District Mbour
```

Voir `src/lib/districtMapping.ts` pour le mapping complet.

---

## Sécurité

### ⚠️ Limitations (Frontend uniquement)
- Validation côté client (localStorage manipulable)
- Pas d'authentification JWT
- Pas de chiffrement
- Audit trail en localStorage

### ✅ Pour Production
1. Backend API avec validation des permissions
2. Authentification JWT sécurisée
3. Chiffrement des données sensibles
4. Audit trail en base de données
5. Tests de sécurité (injection, XSS, etc.)

### Fonctionnalités Actuelles
- Validation du scope à la connexion
- Expiration automatique de session (24h)
- Filtrage hiérarchique strict (structure/district)
- Audit log des actions importantes
- Guards de composants pour protection UI

---

## Tests Rapides

```typescript
// Test 1: Sage-femme voit ses patientes uniquement
const sageFemme = { role: 'sage_femme', prenom: 'Aminata', nom: 'Sall' };
const patients = filterPatientsByUser(mockPatients, sageFemme);
// Résultat: patients.every(p => p.agent === "Aminata Sall")

// Test 2: Responsable structure voit toute sa structure
const respStruct = { role: 'responsable_structure', structure: 'Centre Pikine' };
const patients = filterPatientsByUser(mockPatients, respStruct);
// Résultat: patients.every(p => p.structure === "Centre Pikine")

// Test 3: Partenaires n'ont pas accès aux données individuelles
const partenaire = { role: 'partenaire_ong' };
const patients = filterPatientsByUser(mockPatients, partenaire);
// Résultat: patients.length === 0
```

---

## Checklist Migration Régionale

Avant d'activer le niveau régional:

- [ ] Système district validé pendant 3-6 mois
- [ ] Demande du Ministère de la Santé
- [ ] Backend API implémenté
- [ ] Tests de performance avec volume régional
- [ ] Formation responsables régionaux
- [ ] Données enrichies avec champ `region` (obligatoire)

---

**Version**: 2.0.0
**Date**: 5 novembre 2025
**Status**: Production-ready niveau district, scalable régional/national
