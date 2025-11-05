/**
 * Système d'audit trail côté frontend
 * Enregistre toutes les actions importantes des utilisateurs
 */

import { User } from "@/data/mockData";
import { Permission, Resource, Action } from "./permissions";

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userRole: string;
  userName: string;
  action: Action;
  resource: Resource;
  resourceId?: string;
  details?: Record<string, any>;
  success: boolean;
  errorMessage?: string;
  ipAddress?: string;
  userAgent?: string;
}

const AUDIT_LOG_KEY = "tekhe_audit_log";
const MAX_LOG_ENTRIES = 1000; // Limite pour éviter de surcharger localStorage

/**
 * Récupère tous les logs d'audit
 */
export function getAuditLogs(): AuditLogEntry[] {
  try {
    const logs = localStorage.getItem(AUDIT_LOG_KEY);
    return logs ? JSON.parse(logs) : [];
  } catch (error) {
    console.error("Erreur lors de la lecture des logs d'audit:", error);
    return [];
  }
}

/**
 * Ajoute une entrée au log d'audit
 */
export function addAuditLog(
  user: User,
  action: Action,
  resource: Resource,
  resourceId?: string,
  details?: Record<string, any>,
  success: boolean = true,
  errorMessage?: string
): void {
  try {
    const logs = getAuditLogs();

    const entry: AuditLogEntry = {
      id: generateLogId(),
      timestamp: new Date().toISOString(),
      userId: user.id,
      userRole: user.role,
      userName: `${user.prenom} ${user.nom}`,
      action,
      resource,
      resourceId,
      details,
      success,
      errorMessage,
      userAgent: navigator.userAgent,
    };

    logs.unshift(entry); // Ajouter au début

    // Limiter le nombre d'entrées
    if (logs.length > MAX_LOG_ENTRIES) {
      logs.splice(MAX_LOG_ENTRIES);
    }

    localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(logs));
  } catch (error) {
    console.error("Erreur lors de l'ajout d'un log d'audit:", error);
  }
}

/**
 * Récupère les logs d'un utilisateur spécifique
 */
export function getUserAuditLogs(userId: string): AuditLogEntry[] {
  const logs = getAuditLogs();
  return logs.filter((log) => log.userId === userId);
}

/**
 * Récupère les logs d'une ressource spécifique
 */
export function getResourceAuditLogs(resource: Resource, resourceId?: string): AuditLogEntry[] {
  const logs = getAuditLogs();
  return logs.filter(
    (log) => log.resource === resource && (!resourceId || log.resourceId === resourceId)
  );
}

/**
 * Récupère les logs d'une période donnée
 */
export function getAuditLogsByDateRange(startDate: Date, endDate: Date): AuditLogEntry[] {
  const logs = getAuditLogs();
  return logs.filter((log) => {
    const logDate = new Date(log.timestamp);
    return logDate >= startDate && logDate <= endDate;
  });
}

/**
 * Récupère les logs d'actions échouées
 */
export function getFailedAuditLogs(): AuditLogEntry[] {
  const logs = getAuditLogs();
  return logs.filter((log) => !log.success);
}

/**
 * Récupère les logs d'actions sensibles (suppressions, exports)
 */
export function getSensitiveAuditLogs(): AuditLogEntry[] {
  const logs = getAuditLogs();
  const sensitiveActions = [Action.DELETE, Action.EXPORT];
  return logs.filter((log) => sensitiveActions.includes(log.action));
}

/**
 * Nettoie les logs anciens (plus de X jours)
 */
export function cleanOldAuditLogs(daysToKeep: number = 90): number {
  const logs = getAuditLogs();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

  const filteredLogs = logs.filter((log) => new Date(log.timestamp) >= cutoffDate);
  const removedCount = logs.length - filteredLogs.length;

  localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(filteredLogs));
  return removedCount;
}

/**
 * Exporte les logs d'audit au format JSON
 */
export function exportAuditLogs(): string {
  const logs = getAuditLogs();
  return JSON.stringify(logs, null, 2);
}

/**
 * Statistiques des logs d'audit
 */
export function getAuditLogStats(): {
  totalLogs: number;
  successfulActions: number;
  failedActions: number;
  actionsByType: Record<Action, number>;
  resourcesByType: Record<Resource, number>;
  recentActivity: AuditLogEntry[];
} {
  const logs = getAuditLogs();

  const stats = {
    totalLogs: logs.length,
    successfulActions: logs.filter((log) => log.success).length,
    failedActions: logs.filter((log) => !log.success).length,
    actionsByType: {} as Record<Action, number>,
    resourcesByType: {} as Record<Resource, number>,
    recentActivity: logs.slice(0, 10), // 10 dernières actions
  };

  // Compter les actions par type
  logs.forEach((log) => {
    stats.actionsByType[log.action] = (stats.actionsByType[log.action] || 0) + 1;
    stats.resourcesByType[log.resource] = (stats.resourcesByType[log.resource] || 0) + 1;
  });

  return stats;
}

/**
 * Génère un ID unique pour les logs
 */
function generateLogId(): string {
  return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Hook pour utiliser l'audit log dans les composants
 */
export function useAuditLog() {
  const logAction = (
    user: User,
    action: Action,
    resource: Resource,
    resourceId?: string,
    details?: Record<string, any>,
    success: boolean = true,
    errorMessage?: string
  ) => {
    addAuditLog(user, action, resource, resourceId, details, success, errorMessage);
  };

  return {
    logAction,
    getAuditLogs,
    getUserLogs: getUserAuditLogs,
    getResourceLogs: getResourceAuditLogs,
    getLogsByDateRange: getAuditLogsByDateRange,
    getFailedLogs: getFailedAuditLogs,
    getSensitiveLogs: getSensitiveAuditLogs,
    cleanOldLogs: cleanOldAuditLogs,
    exportLogs: exportAuditLogs,
    getStats: getAuditLogStats,
  };
}
