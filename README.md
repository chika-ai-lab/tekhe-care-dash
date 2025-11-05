# TEKHE Care Dashboard

Tableau de bord web pour la gestion de la santé maternelle au Sénégal. Suivi des consultations prénatales (CPN), détection des risques via IA, enrôlement CSU, références SONU, PEV et nutrition, avec export DHIS2.

---

## Installation Rapide

```bash
# Cloner le projet
git clone <url-du-depot>
cd tekhe-care-dash

# Installer les dépendances
pnpm install

# Lancer en développement
pnpm run dev
```

**Prérequis**: Node.js 18+, pnpm (recommandé)

### Scripts

- `pnpm run dev` - Serveur de développement (http://localhost:5173)
- `pnpm run build` - Build production
- `pnpm run lint` - Vérification ESLint
- `pnpm run preview` - Preview production locale

---

## Technologies

**Core**: React 18, TypeScript, Vite
**UI**: Tailwind CSS, Shadcn UI (Radix UI)
**State**: TanStack React Query
**Routing**: React Router DOM
**Forms**: React Hook Form + Zod
**Charts**: Recharts
**Icons**: Lucide React

---

## Architecture & Structure

```
tekhe-care-dash/
├── src/
│   ├── components/
│   │   ├── ui/              # Shadcn UI components
│   │   ├── AppSidebar.tsx   # Navigation latérale
│   │   ├── PermissionGuard.tsx  # Guards RBAC
│   │   └── ProtectedRoute.tsx   # Protection routes
│   │
│   ├── contexts/
│   │   └── AuthContext.tsx  # Authentification + validation scope
│   │
│   ├── data/
│   │   └── mockData.ts      # Données mockées (patients, visites, etc.)
│   │
│   ├── hooks/
│   │   └── usePermissions.ts  # Vérification permissions RBAC
│   │
│   ├── lib/
│   │   ├── permissions.ts     # Système RBAC complet
│   │   ├── dataFilters.ts     # Filtrage hiérarchique
│   │   ├── auditLog.ts        # Traçabilité actions
│   │   ├── districtMapping.ts # Mapping géographique
│   │   └── utils.ts           # Utilitaires
│   │
│   ├── pages/
│   │   ├── Login.tsx          # Authentification OTP
│   │   ├── Dashboard.tsx      # KPI principal
│   │   └── dashboard/
│   │       ├── Suivi.tsx      # Suivi CPN
│   │       ├── Risques.tsx    # Risques IA
│   │       ├── SONU.tsx       # Références SONU
│   │       ├── CSU.tsx        # Enrôlement CSU
│   │       ├── PEV.tsx        # PEV & Nutrition
│   │       ├── DHIS2.tsx      # Export DHIS2
│   │       ├── PartenaireAnalytics.tsx  # Analytics partenaires
│   │       ├── PatientDetail.tsx        # Détail patient
│   │       └── PermissionsMatrix.tsx    # Admin permissions
│   │
│   ├── App.tsx                # Routes et configuration
│   └── main.tsx               # Point d'entrée
│
├── docs/
│   └── RBAC.md                # Documentation système RBAC
│
└── scripts/
    └── enrichMockData.ts      # Script enrichissement données
```

---

## Système RBAC - Contrôle d'Accès

### Focus: Niveau DISTRICT

Le système est centré sur le **district sanitaire** (niveau opérationnel), avec architecture scalable pour extension régionale/nationale.

### Hiérarchie

**Sage-femme** (Scope: OWN)
- Ses propres patientes uniquement
- Créer/Modifier: Patientes, Visites, CSU, PEV, Nutrition

**Responsable Structure** (Scope: STRUCTURE)
- Toute sa structure de santé
- Créer/Modifier: Toutes données de la structure

**Responsable District** (Scope: DISTRICT) - Niveau max actuel
- Tout son district sanitaire
- Toutes permissions + Suppression + Export DHIS2

**Partenaires** (Scope: ANONYMOUS)
- Analytics anonymisées uniquement
- Aucune donnée individuelle

### Utilisation

```typescript
// Vérifier permission
import { usePermissions } from '@/hooks/usePermissions';
import { Resource } from '@/lib/permissions';

const { canCreate, canDelete } = usePermissions();

{canCreate(Resource.PATIENT) && <Button>Créer</Button>}

// Protéger composant
import { CreateGuard } from '@/components/PermissionGuard';

<CreateGuard resource={Resource.PATIENT}>
  <Button>Nouvelle Patiente</Button>
</CreateGuard>
```

**📘 Documentation complète**: [docs/RBAC.md](docs/RBAC.md)

---

## Fonctionnalités

- ✅ **Authentification OTP** - Par numéro de téléphone
- ✅ **Dashboard KPI** - Indicateurs clés santé maternelle
- ✅ **Suivi CPN** - Consultations prénatales (CPN1-4, CPoN)
- ✅ **Risques IA** - Détection et classification des risques
- ✅ **Enrôlement CSU** - Couverture santé universelle
- ✅ **Références SONU** - Soins obstétricaux d'urgence
- ✅ **PEV & Nutrition** - Vaccination et suivi nutritionnel
- ✅ **Export DHIS2** - Intégration système national
- ✅ **Analytics Partenaires** - Données anonymisées
- ✅ **Permissions RBAC** - Contrôle d'accès hiérarchique
- ✅ **Audit Trail** - Traçabilité des actions

---

## Utilisateurs de Test

```typescript
// Sage-femme
Tél: +221701234567 | OTP: 123456
// Responsable Structure
Tél: +221702345678 | OTP: 123456
// Responsable District
Tél: +221703456789 | OTP: 123456
// Partenaire ONG
Tél: +221704567890 | OTP: 123456
```

---

## Scalabilité Future

**Phase actuelle**: District (opérationnel) ✅
**Préparé**: Extension régionale et nationale 🔧

L'architecture est prête pour:
- Niveau **RÉGIONAL**: Supervision multi-districts
- Niveau **NATIONAL**: Consolidation nationale

Types et code préparés, activation progressive selon besoin.

Voir [docs/RBAC.md](docs/RBAC.md) section "Scalabilité"

---

## Sécurité

⚠️ **Système actuel: Frontend uniquement** (localStorage)

**Pour production**:
- Backend API + validation serveur
- JWT authentification
- Chiffrement données
- Audit trail base de données
- Tests sécurité (XSS, injection, etc.)

**Fonctionnalités actuelles**:
- Validation scope connexion
- Expiration session (24h)
- Filtrage hiérarchique strict
- Audit log frontend
- Guards composants

---

## Structure Géographique

```
Région Dakar (active)
├── District Dakar
│   ├── Hôpital Principal Dakar
│   ├── Centre de Santé Médina
│   └── Poste de Santé Dakar Nord
├── District Pikine
│   ├── Centre de Santé Pikine
│   └── Poste de Santé Guinaw Rails
├── District Guédiawaye
└── District Rufisque
    └── Hôpital Rufisque

Région Thiès (préparée)
├── District Thiès
└── District Mbour
```

Mapping: `src/lib/districtMapping.ts`

---

## Documentation

- **[docs/RBAC.md](docs/RBAC.md)** - Système de permissions complet
- **[scripts/enrichMockData.ts](scripts/enrichMockData.ts)** - Guide enrichissement données

---

## Développement

### Ajouter une nouvelle page protégée

```typescript
// 1. Route dans App.tsx
<Route path="new-page" element={
  <ProtectedRoute allowedRoles={['sage_femme', 'responsable_district']}>
    <NewPage />
  </ProtectedRoute>
} />

// 2. Menu dans AppSidebar.tsx
{
  title: "Nouvelle Page",
  url: "/dashboard/new-page",
  icon: Icon,
  allowedRoles: ["sage_femme", "responsable_district"],
}

// 3. Composant avec permissions
function NewPage() {
  const { canCreate, canDelete } = usePermissions();
  const { user } = useAuth();
  const patients = filterPatientsByUser(mockPatients, user);

  return (...)
}
```

### Ajouter une nouvelle permission

```typescript
// 1. Définir dans src/lib/permissions.ts
export const Permissions = {
  NEW_RESOURCE_CREATE: "new_resource:create" as Permission,
};

// 2. Assigner au rôle
responsable_district: {
  permissions: [
    ...
    "new_resource:create",
  ],
  scope: PermissionScope.DISTRICT,
}

// 3. Utiliser
const { can } = usePermissions();
if (can(Permissions.NEW_RESOURCE_CREATE)) { ... }
```

---

## Contribution

1. Fork le projet
2. Branche: `git checkout -b feature/ma-fonctionnalite`
3. Commit: `git commit -m 'Ajout fonctionnalité X'`
4. Push: `git push origin feature/ma-fonctionnalite`
5. Pull Request

---

## Licence

MIT - Voir [LICENSE](LICENSE)

## Contact

📧 Email: contact@tekhe.sn
🌐 Web: https://tekhe.sn

---

**Version**: 2.0.0
**Date**: Novembre 2025
**Status**: Production-ready (niveau district)
