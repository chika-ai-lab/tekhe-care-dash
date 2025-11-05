/**
 * Composants de garde pour contrôler l'affichage selon les permissions
 * Ces composants encapsulent la logique de vérification des permissions
 */

import React from "react";
import { usePermissions } from "@/hooks/usePermissions";
import { Permission, Resource } from "@/lib/permissions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface PermissionGuardProps {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showWarning?: boolean;
}

/**
 * Guard général pour vérifier une permission spécifique
 * Si l'utilisateur n'a pas la permission, affiche le fallback ou rien
 */
export function PermissionGuard({
  permission,
  children,
  fallback = null,
  showWarning = false,
}: PermissionGuardProps) {
  const { can } = usePermissions();

  if (!can(permission)) {
    if (showWarning) {
      return (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Vous n'avez pas la permission nécessaire pour cette action.
          </AlertDescription>
        </Alert>
      );
    }
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface ResourceGuardProps {
  resource: Resource;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showWarning?: boolean;
}

/**
 * Guard pour vérifier l'accès à une ressource (toute action)
 */
export function ResourceGuard({
  resource,
  children,
  fallback = null,
  showWarning = false,
}: ResourceGuardProps) {
  const { hasAccess } = usePermissions();

  if (!hasAccess(resource)) {
    if (showWarning) {
      return (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Vous n'avez pas accès à cette ressource.
          </AlertDescription>
        </Alert>
      );
    }
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface CreateGuardProps {
  resource: Resource;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Guard spécifique pour la création
 */
export function CreateGuard({ resource, children, fallback = null }: CreateGuardProps) {
  const { canCreate } = usePermissions();

  if (!canCreate(resource)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface UpdateGuardProps {
  resource: Resource;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Guard spécifique pour la modification
 */
export function UpdateGuard({ resource, children, fallback = null }: UpdateGuardProps) {
  const { canUpdate } = usePermissions();

  if (!canUpdate(resource)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface DeleteGuardProps {
  resource: Resource;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Guard spécifique pour la suppression
 */
export function DeleteGuard({ resource, children, fallback = null }: DeleteGuardProps) {
  const { canDelete } = usePermissions();

  if (!canDelete(resource)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface ExportGuardProps {
  resource: Resource;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Guard spécifique pour l'export
 */
export function ExportGuard({ resource, children, fallback = null }: ExportGuardProps) {
  const { canExport } = usePermissions();

  if (!canExport(resource)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface RoleGuardProps {
  allowedRoles?: ("sage_femme" | "responsable_structure" | "responsable_district" | "partenaire_ong" | "partenaire_regional" | "partenaire_gouvernemental")[];
  healthWorkerOnly?: boolean;
  managerOnly?: boolean;
  partenaireOnly?: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Guard basé sur le type de rôle
 */
export function RoleGuard({
  allowedRoles,
  healthWorkerOnly = false,
  managerOnly = false,
  partenaireOnly = false,
  children,
  fallback = null,
}: RoleGuardProps) {
  const { isHealthWorker, isManager, isPartenaire } = usePermissions();
  const { user } = useAuth();

  // Vérifier les rôles spécifiques
  if (allowedRoles && user) {
    if (!allowedRoles.includes(user.role)) {
      return <>{fallback}</>;
    }
  }

  // Vérifier les types de rôles
  if (healthWorkerOnly && !isHealthWorker) {
    return <>{fallback}</>;
  }

  if (managerOnly && !isManager) {
    return <>{fallback}</>;
  }

  if (partenaireOnly && !isPartenaire) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Import pour RoleGuard
import { useAuth } from "@/contexts/AuthContext";
