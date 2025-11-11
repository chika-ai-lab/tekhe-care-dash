/**
 * Système de permissions RBAC (Role-Based Access Control)
 * Définit les permissions granulaires pour chaque rôle
 */

import { UserRole } from "@/data/mockData";

// Types de ressources dans le système
export enum Resource {
  PATIENT = "patient",
  VISITE = "visite",
  RISQUE = "risque",
  REFERENCE = "reference",
  CSU = "csu",
  PEV = "pev",
  NUTRITION = "nutrition",
  DHIS2 = "dhis2",
  ANALYTICS = "analytics",
  STRUCTURE = "structure",
  PERSONNEL = "personnel",
  AGENT = "agent",
}

// Actions possibles sur les ressources
export enum Action {
  CREATE = "create",
  READ = "read",
  UPDATE = "update",
  DELETE = "delete",
  EXPORT = "export",
  IMPORT = "import",
}

// Type pour une permission complète
export type Permission = `${Resource}:${Action}`;

// Scope de la permission (à quel niveau de la hiérarchie)
export enum PermissionScope {
  OWN = "own", // Seulement ses propres données
  STRUCTURE = "structure", // Toutes les données de sa structure
  DISTRICT = "district", // Toutes les données de son district
  REGION = "region", // Toutes les données de sa région
  NATIONAL = "national", // Toutes les données nationales
  ANONYMOUS = "anonymous", // Données anonymisées uniquement
}

// Configuration des permissions par rôle
export const ROLE_PERMISSIONS: Record<UserRole, { permissions: Permission[]; scope: PermissionScope }> = {
  sage_femme: {
    permissions: [
      "patient:create",
      "patient:read",
      "patient:update",
      "visite:create",
      "visite:read",
      "visite:update",
      "risque:read",
      "reference:create",
      "reference:read",
      "csu:create",
      "csu:read",
      "csu:update",
      "pev:create",
      "pev:read",
      "pev:update",
      "nutrition:create",
      "nutrition:read",
      "nutrition:update",
    ],
    scope: PermissionScope.OWN, // Ne voit que ses propres patientes
  },

  responsable_structure: {
    permissions: [
      "patient:create",
      "patient:read",
      "patient:update",
      "visite:create",
      "visite:read",
      "visite:update",
      "risque:read",
      "risque:update",
      "reference:create",
      "reference:read",
      "reference:update",
      "csu:create",
      "csu:read",
      "csu:update",
      "pev:create",
      "pev:read",
      "pev:update",
      "nutrition:create",
      "nutrition:read",
      "nutrition:update",
      "personnel:read", // Peut voir le personnel de sa structure
      "structure:read",
      "analytics:read",
      "agent:create", // Enrôler des agents de santé
      "agent:read", // Voir les agents de sa structure
      "agent:update", // Modifier les agents
    ],
    scope: PermissionScope.STRUCTURE, // Voit toute sa structure
  },

  responsable_district: {
    permissions: [
      "patient:create",
      "patient:read",
      "patient:update",
      "patient:delete",
      "visite:create",
      "visite:read",
      "visite:update",
      "visite:delete",
      "risque:read",
      "risque:update",
      "reference:create",
      "reference:read",
      "reference:update",
      "reference:delete",
      "csu:create",
      "csu:read",
      "csu:update",
      "pev:create",
      "pev:read",
      "pev:update",
      "nutrition:create",
      "nutrition:read",
      "nutrition:update",
      "personnel:read",
      "personnel:update",
      "structure:read",
      "structure:update",
      "dhis2:export",
      "analytics:read",
      "analytics:export",
      "agent:create",
      "agent:read",
      "agent:update",
      "agent:delete",
    ],
    scope: PermissionScope.DISTRICT, // Voit tout son district
  },

  partenaire_ong: {
    permissions: [
      "analytics:read", // Données anonymisées uniquement
    ],
    scope: PermissionScope.ANONYMOUS, // Accès anonymisé seulement
  },

  partenaire_regional: {
    permissions: [
      "analytics:read",
      "analytics:export",
    ],
    scope: PermissionScope.ANONYMOUS,
  },

  partenaire_gouvernemental: {
    permissions: [
      "analytics:read",
      "analytics:export",
      "dhis2:read", // Peut voir les exports DHIS2
    ],
    scope: PermissionScope.ANONYMOUS,
  },
};

// Permissions spéciales qui nécessitent des vérifications supplémentaires
export const SENSITIVE_ACTIONS = [
  "patient:delete",
  "visite:delete",
  "reference:delete",
  "dhis2:export",
];

/**
 * Vérifie si un rôle a une permission spécifique
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  const roleConfig = ROLE_PERMISSIONS[role];
  return roleConfig.permissions.includes(permission);
}

/**
 * Récupère le scope d'un rôle
 */
export function getPermissionScope(role: UserRole): PermissionScope {
  return ROLE_PERMISSIONS[role].scope;
}

/**
 * Récupère toutes les permissions d'un rôle
 */
export function getRolePermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role].permissions;
}

/**
 * Vérifie si un rôle a accès à une ressource (quelle que soit l'action)
 */
export function hasResourceAccess(role: UserRole, resource: Resource): boolean {
  const permissions = getRolePermissions(role);
  return permissions.some((p) => p.startsWith(`${resource}:`));
}

/**
 * Vérifie si une action est sensible et nécessite une confirmation
 */
export function isSensitiveAction(permission: Permission): boolean {
  return SENSITIVE_ACTIONS.includes(permission);
}

/**
 * Récupère les actions disponibles pour un rôle sur une ressource
 */
export function getAvailableActions(role: UserRole, resource: Resource): Action[] {
  const permissions = getRolePermissions(role);
  const resourcePermissions = permissions.filter((p) => p.startsWith(`${resource}:`));
  return resourcePermissions.map((p) => p.split(":")[1] as Action);
}

/**
 * Vérifie si un utilisateur peut accéder à une donnée selon la hiérarchie
 */
export function canAccessData(
  userRole: UserRole,
  userStructure: string | undefined,
  userDistrict: string | undefined,
  userRegion: string | undefined,
  dataStructure?: string,
  dataDistrict?: string,
  dataRegion?: string,
  dataAgent?: string,
  userName?: string
): boolean {
  const scope = getPermissionScope(userRole);

  switch (scope) {
    case PermissionScope.OWN:
      // Sage-femme: seulement ses propres patientes
      return dataAgent === userName;

    case PermissionScope.STRUCTURE:
      // Responsable structure: toutes les données de sa structure
      return userStructure !== undefined && dataStructure === userStructure;

    case PermissionScope.DISTRICT:
      // Responsable district: toutes les données de son district
      return userDistrict !== undefined && dataDistrict === userDistrict;

    case PermissionScope.REGION:
      // Niveau régional: toutes les données de la région
      return userRegion !== undefined && dataRegion === userRegion;

    case PermissionScope.NATIONAL:
      // Accès national: toutes les données
      return true;

    case PermissionScope.ANONYMOUS:
      // Partenaires: pas d'accès aux données individuelles
      return false;

    default:
      return false;
  }
}

/**
 * Matrice de permissions pour affichage (debugging/admin)
 */
export function getPermissionMatrix(): Record<UserRole, { permissions: Permission[]; scope: PermissionScope }> {
  return ROLE_PERMISSIONS;
}

// Export des constantes pour utilisation facile
export const Permissions = {
  // Patient
  PATIENT_CREATE: "patient:create" as Permission,
  PATIENT_READ: "patient:read" as Permission,
  PATIENT_UPDATE: "patient:update" as Permission,
  PATIENT_DELETE: "patient:delete" as Permission,

  // Visite
  VISITE_CREATE: "visite:create" as Permission,
  VISITE_READ: "visite:read" as Permission,
  VISITE_UPDATE: "visite:update" as Permission,
  VISITE_DELETE: "visite:delete" as Permission,

  // Risque
  RISQUE_READ: "risque:read" as Permission,
  RISQUE_UPDATE: "risque:update" as Permission,

  // Référence
  REFERENCE_CREATE: "reference:create" as Permission,
  REFERENCE_READ: "reference:read" as Permission,
  REFERENCE_UPDATE: "reference:update" as Permission,
  REFERENCE_DELETE: "reference:delete" as Permission,

  // CSU
  CSU_CREATE: "csu:create" as Permission,
  CSU_READ: "csu:read" as Permission,
  CSU_UPDATE: "csu:update" as Permission,

  // PEV
  PEV_CREATE: "pev:create" as Permission,
  PEV_READ: "pev:read" as Permission,
  PEV_UPDATE: "pev:update" as Permission,

  // Nutrition
  NUTRITION_CREATE: "nutrition:create" as Permission,
  NUTRITION_READ: "nutrition:read" as Permission,
  NUTRITION_UPDATE: "nutrition:update" as Permission,

  // DHIS2
  DHIS2_EXPORT: "dhis2:export" as Permission,

  // Analytics
  ANALYTICS_READ: "analytics:read" as Permission,
  ANALYTICS_EXPORT: "analytics:export" as Permission,

  // Personnel
  PERSONNEL_READ: "personnel:read" as Permission,
  PERSONNEL_UPDATE: "personnel:update" as Permission,

  // Structure
  STRUCTURE_READ: "structure:read" as Permission,
  STRUCTURE_UPDATE: "structure:update" as Permission,

  // Agent
  AGENT_CREATE: "agent:create" as Permission,
  AGENT_READ: "agent:read" as Permission,
  AGENT_UPDATE: "agent:update" as Permission,
  AGENT_DELETE: "agent:delete" as Permission,
};
