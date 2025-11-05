/**
 * Hook personnalisé pour gérer les permissions utilisateur
 */

import { useAuth } from "@/contexts/AuthContext";
import {
  Permission,
  Resource,
  Action,
  hasPermission,
  getPermissionScope,
  getRolePermissions,
  hasResourceAccess,
  isSensitiveAction,
  getAvailableActions,
  canAccessData,
  PermissionScope,
} from "@/lib/permissions";

interface UsePermissionsReturn {
  // Vérifications de permissions
  can: (permission: Permission) => boolean;
  canCreate: (resource: Resource) => boolean;
  canRead: (resource: Resource) => boolean;
  canUpdate: (resource: Resource) => boolean;
  canDelete: (resource: Resource) => boolean;
  canExport: (resource: Resource) => boolean;

  // Vérifications de scope
  hasAccess: (resource: Resource) => boolean;
  getScope: () => PermissionScope;
  isSensitive: (permission: Permission) => boolean;

  // Vérifications de données
  canAccessDataItem: (
    dataStructure?: string,
    dataDistrict?: string,
    dataRegion?: string,
    dataAgent?: string
  ) => boolean;

  // Utilitaires
  getActions: (resource: Resource) => Action[];
  getAllPermissions: () => Permission[];
  isPartenaire: boolean;
  isHealthWorker: boolean;
  isManager: boolean;
}

/**
 * Hook pour vérifier les permissions de l'utilisateur actuel
 */
export function usePermissions(): UsePermissionsReturn {
  const { user } = useAuth();

  // Vérification générique de permission
  const can = (permission: Permission): boolean => {
    if (!user) return false;
    return hasPermission(user.role, permission);
  };

  // Vérifications spécifiques par action
  const canCreate = (resource: Resource): boolean => {
    return can(`${resource}:create` as Permission);
  };

  const canRead = (resource: Resource): boolean => {
    return can(`${resource}:read` as Permission);
  };

  const canUpdate = (resource: Resource): boolean => {
    return can(`${resource}:update` as Permission);
  };

  const canDelete = (resource: Resource): boolean => {
    return can(`${resource}:delete` as Permission);
  };

  const canExport = (resource: Resource): boolean => {
    return can(`${resource}:export` as Permission);
  };

  // Vérifier l'accès à une ressource (toute action)
  const hasAccess = (resource: Resource): boolean => {
    if (!user) return false;
    return hasResourceAccess(user.role, resource);
  };

  // Récupérer le scope de l'utilisateur
  const getScope = (): PermissionScope => {
    if (!user) return PermissionScope.ANONYMOUS;
    return getPermissionScope(user.role);
  };

  // Vérifier si une action est sensible
  const isSensitive = (permission: Permission): boolean => {
    return isSensitiveAction(permission);
  };

  // Vérifier si l'utilisateur peut accéder à une donnée spécifique
  const canAccessDataItem = (
    dataStructure?: string,
    dataDistrict?: string,
    dataRegion?: string,
    dataAgent?: string
  ): boolean => {
    if (!user) return false;

    const userName = `${user.prenom} ${user.nom}`;

    return canAccessData(
      user.role,
      user.structure,
      user.district,
      user.region,
      dataStructure,
      dataDistrict,
      dataRegion,
      dataAgent,
      userName
    );
  };

  // Récupérer les actions disponibles pour une ressource
  const getActions = (resource: Resource): Action[] => {
    if (!user) return [];
    return getAvailableActions(user.role, resource);
  };

  // Récupérer toutes les permissions de l'utilisateur
  const getAllPermissions = (): Permission[] => {
    if (!user) return [];
    return getRolePermissions(user.role);
  };

  // Helpers pour les types de rôles
  const isPartenaire =
    user?.role === "partenaire_ong" ||
    user?.role === "partenaire_regional" ||
    user?.role === "partenaire_gouvernemental";

  const isHealthWorker =
    user?.role === "sage_femme" ||
    user?.role === "responsable_structure" ||
    user?.role === "responsable_district";

  const isManager =
    user?.role === "responsable_structure" || user?.role === "responsable_district";

  return {
    can,
    canCreate,
    canRead,
    canUpdate,
    canDelete,
    canExport,
    hasAccess,
    getScope,
    isSensitive,
    canAccessDataItem,
    getActions,
    getAllPermissions,
    isPartenaire,
    isHealthWorker,
    isManager,
  };
}

/**
 * Hook pour créer un guard de permission
 * Retourne null si l'utilisateur n'a pas la permission
 */
export function usePermissionGuard(permission: Permission) {
  const { can } = usePermissions();
  return can(permission);
}

/**
 * Hook pour créer un guard de ressource
 * Retourne null si l'utilisateur n'a aucun accès à la ressource
 */
export function useResourceGuard(resource: Resource) {
  const { hasAccess } = usePermissions();
  return hasAccess(resource);
}
